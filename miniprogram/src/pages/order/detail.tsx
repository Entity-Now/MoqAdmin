import { useState } from 'react';
import Taro, { useLoad, requirePlugin } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { Button, Dialog, Textarea, Input } from '@taroify/core';
import TopBar from '../../components/TopBar';
import orderApi from '../../api/order';
import weixinApi from '../../api/weixin';
import type { OrderDetailResponse, OrderGoodsItem } from '../../api/order/types';
import { GoodsItem } from '../../components/Good';
import { PayStatusEnum, PayWayMap, DeliveryStatusEnum } from '../../../types/PayStatus';
import { Loading } from '@taroify/core';
import './index.scss';


function OrderDetail() {
  const plugin = requirePlugin("logisticsPlugin");
  // 从路由获取订单ID
  const routerParams = Taro.getCurrentInstance()?.router?.params || {};
  const orderId = Number(routerParams.id);
  const orderSn = routerParams.sn;

  // 订单详情状态
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  // 参数无效状态
  const [paramsInvalid, setParamsInvalid] = useState(false);
  // 售后对话框状态
  const [afterSalesDialogVisible, setAfterSalesDialogVisible] = useState(false);
  const [afterSalesType, setAfterSalesType] = useState<'apply' | 'cancel' | 'logistics' | 'resubmit'>('apply');
  const [selectedSubOrderId, setSelectedSubOrderId] = useState<number>(0);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number>(0);
  // 售后表单数据
  const [afterSalesForm, setAfterSalesForm] = useState({
    reason: '',
    type: 1, // 1=退款, 2=退货退款
    return_type: 1, // 1=仅退款, 2=退货退款
    logistics_company: '',
    logistics_no: ''
  });

  // 加载订单详情
  useLoad(() => {
    if (!orderId && !orderSn) {
      setParamsInvalid(true);
      setIsLoading(false);
      return;
    }
    loadOrderDetail();
  });

  const loadOrderDetail = async () => {
    try {
      Taro.showLoading({ title: '加载中...' });
      setIsLoading(true);
      const res = await orderApi.detail(orderId, orderSn);
      setOrder(res);
    } catch (error) {
      console.error('加载订单详情失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
      Taro.navigateBack();
    } finally {
      Taro.hideLoading();
      setIsLoading(false);
    }
  };

  // 查看物流
  const handleViewLogistics = (logisticsNo: string, company: string, subOrderId: number) => {
    Taro.showToast({
      title: `物流公司: ${company || '未知'}\n物流单号: ${logisticsNo}`,
      icon: 'none'
    });
    Taro.showLoading({ title: '加载物流...' });
    weixinApi.trace_waybill({
      orderId: String(orderId),
      sub_order_id: String(subOrderId)
    }).then(res => {
      Taro.hideLoading();
      if (res && res.waybill_token) {
        console.log(res.waybill_token, plugin?.openWaybillTracking, "waybill_token");
        plugin?.openWaybillTracking({
          waybillToken: res.waybill_token
        });
      } else {
        Taro.showToast({
          title: `物流公司: ${company || '未知'}\n单号: ${logisticsNo}`,
          icon: 'none',
          duration: 3000
        });
      }
    }).catch(err => {
      Taro.hideLoading();
      console.error('查看物流失败', err);
      Taro.showToast({
        title: `物流公司: ${company || '未知'}\n单号: ${logisticsNo}`,
        icon: 'none',
        duration: 3000
      });
    });
  };

  // 获取支付状态样式
  const getPayStatusStyle = (status: number) => {
    switch (status) {
      case PayStatusEnum.WAITING:
        return { text: '待支付', color: 'text-orange-500' };
      case PayStatusEnum.PAID:
        return { text: '已支付', color: 'text-green-500' };
      case PayStatusEnum.REFUNDED:
        return { text: '已退款', color: 'text-red-500' };
      default:
        return { text: '未知', color: 'text-gray-400' };
    }
  };

  // 获取发货状态样式
  const getDeliveryStatusStyle = (status: number) => {
    switch (status) {
      case DeliveryStatusEnum.WAITING:
        return { text: '待发货', color: 'text-yellow-600' };
      case DeliveryStatusEnum.DELIVERED:
        return { text: '已发货', color: 'text-blue-600' };
      case DeliveryStatusEnum.REFUNDED:
        return { text: '已退货', color: 'text-red-600' };
      default:
        return { text: '未知', color: 'text-gray-400' };
    }
  };

  // 获取售后状态样式
  const getAfterSalesStatusStyle = (status?: number) => {
    if (!status || status === 0) return null;
    switch (status) {
      case 1:
        return { text: '申请售后中', color: 'text-orange-500' };
      case 2:
        return { text: '同意退货', color: 'text-blue-500' };
      case 3:
        return { text: '退货成功', color: 'text-green-500' };
      case 4:
        return { text: '拒绝退货', color: 'text-red-500' };
      default:
        return null;
    }
  };

  // 打开售后对话框
  const handleOpenAfterSalesDialog = (type: 'apply' | 'cancel' | 'logistics' | 'resubmit', subOrderId: number, workOrderId?: number) => {
    setAfterSalesType(type);
    setSelectedSubOrderId(subOrderId);
    setSelectedWorkOrderId(workOrderId || 0);
    setAfterSalesForm({
      reason: '',
      type: 1,
      return_type: 1,
      logistics_company: '',
      logistics_no: ''
    });
    setAfterSalesDialogVisible(true);
  };

  // 处理售后操作
  const handleAfterSalesSubmit = async () => {
    try {
      Taro.showLoading({ title: '处理中...', mask: true });

      if (afterSalesType === 'apply') {
        // 申请售后
        if (!afterSalesForm.reason.trim()) {
          Taro.showToast({ title: '请填写申请原因', icon: 'none' });
          return;
        }
        await orderApi.applyAfterSales({
          sub_order_id: selectedSubOrderId,
          type: afterSalesForm.type,
          reason: afterSalesForm.reason,
          return_type: afterSalesForm.return_type
        });
        Taro.showToast({ title: '申请成功', icon: 'success' });
      } else if (afterSalesType === 'cancel') {
        // 取消售后
        await orderApi.cancelAfterSales({
          work_order_id: selectedWorkOrderId
        });
        Taro.showToast({ title: '取消成功', icon: 'success' });
      } else if (afterSalesType === 'logistics') {
        // 填写物流
        if (!afterSalesForm.logistics_company.trim() || !afterSalesForm.logistics_no.trim()) {
          Taro.showToast({ title: '请填写完整物流信息', icon: 'none' });
          return;
        }
        await orderApi.fillReturnLogistics({
          work_order_id: selectedWorkOrderId,
          logistics_company: afterSalesForm.logistics_company,
          logistics_no: afterSalesForm.logistics_no
        });
        Taro.showToast({ title: '提交成功', icon: 'success' });
      } else if (afterSalesType === 'resubmit') {
        // 重新提交售后
        if (!afterSalesForm.reason.trim()) {
          Taro.showToast({ title: '请填写申请原因', icon: 'none' });
          return;
        }
        await orderApi.resubmitAfterSales({
          work_order_id: selectedWorkOrderId,
          type: afterSalesForm.type,
          reason: afterSalesForm.reason,
          return_type: afterSalesForm.return_type
        });
        Taro.showToast({ title: '重新提交成功', icon: 'success' });
      }

      setAfterSalesDialogVisible(false);
      // 刷新订单详情
      loadOrderDetail();
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '操作失败',
        icon: 'none'
      });
    } finally {
      Taro.hideLoading();
    }
  };

  // 获取售后对话框标题
  const getAfterSalesDialogTitle = () => {
    switch (afterSalesType) {
      case 'apply':
        return '申请售后';
      case 'cancel':
        return '取消售后';
      case 'logistics':
        return '填写退货物流';
      case 'resubmit':
        return '重新提交售后';
      default:
        return '售后';
    }
  };

  if (paramsInvalid) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white px-6">
        <View className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 w-full max-w-sm text-center">
          <View className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Text className="text-4xl text-gray-300">❓</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900 mb-2 block">参数错误</Text>
          <Text className="text-sm text-gray-400 mb-8 block">无法获取订单详情，请返回重试</Text>
          <Button
            block
            className="!bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-md active:scale-95 transition-transform"
            onClick={() => Taro.navigateTo({ url: '/pages/order/index' })}
          >
            返回订单列表
          </Button>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white">
        <Loading type="spinner" style={{ color: '#FF8FAF' }} />
        <Text className="text-xs text-gray-400 mt-4 tracking-widest uppercase">Fetching Order Details</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white px-6">
        <View className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 w-full max-w-sm text-center">
          <View className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Text className="text-4xl">📭</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900 mb-2 block">订单找不到了</Text>
          <Text className="text-sm text-gray-400 mb-8 block">该订单可能已被删除或不存在</Text>
          <Button
            block
            className="!bg-white !text-gray-500 !py-4 !rounded-2xl !font-bold !border !border-gray-100 active:bg-gray-50"
            onClick={() => Taro.navigateBack()}
          >
            返回上一页
          </Button>
        </View>
      </View>
    );
  }

  const payStatusStyle = getPayStatusStyle(order.pay_status);

  return (
    <View className="min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white">
      <TopBar title="订单明细" showBack />

      <View className="px-4 pt-4 pb-32">
        {/* 订单状态卡片 */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-gray-50 overflow-hidden relative">
          <View className="absolute top-0 right-0 w-32 h-32 bg-cotton-candy/5 rounded-full -mr-16 -mt-16" />

          <View className="flex flex-row justify-between items-start mb-6">
            <View>
              <View className="flex flex-row gap-2 mb-2">
                <Text className={`text-md font-bold px-3 py-1 rounded-full ${payStatusStyle.color} bg-gray-50 border border-current`}>
                  {payStatusStyle.text}
                </Text>
                {order.pay_status === PayStatusEnum.PAID && order.goods_list?.[0] && (
                  <Text className={`text-md font-bold px-3 py-1 rounded-full ${order.goods_list[0].delivery_status === DeliveryStatusEnum.DELIVERED ? 'text-blue-600 bg-blue-50 border border-blue-200' :
                    order.goods_list[0].delivery_status === DeliveryStatusEnum.REFUNDED ? 'text-red-600 bg-red-50 border border-red-200' :
                      'text-yellow-600 bg-yellow-50 border border-yellow-200'
                    }`}>
                    {order.goods_list[0].delivery_status === DeliveryStatusEnum.DELIVERED ? '已发货' :
                      order.goods_list[0].delivery_status === DeliveryStatusEnum.REFUNDED ? '已退货' : '待发货'}
                  </Text>
                )}
              </View>
              <Text className="text-xs text-gray-400">流水号: {order.order_sn}</Text>
            </View>
            <View className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Text className="text-xs text-gray-400">MOQISTAR · PREMIUM</Text>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex flex-row justify-between">
              <Text className="text-sm text-gray-400">下单时间</Text>
              <Text className="text-sm text-gray-600 font-medium">{order.create_time}</Text>
            </View>
            {order.pay_status === PayStatusEnum.PAID && (
              <>
                <View className="flex flex-row justify-between">
                  <Text className="text-sm text-gray-400">支付方式</Text>
                  <Text className="text-sm text-gray-600 font-medium">{PayWayMap[order.pay_way] || '微信支付'}</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-sm text-gray-400">支付时间</Text>
                  <Text className="text-sm text-gray-600 font-medium">{order.pay_time || '-'}</Text>
                </View>
              </>
            )}
            {order.delivery_time && (
              <View className="flex flex-row justify-between">
                <Text className="text-sm text-gray-400">发货时间</Text>
                <Text className="text-sm text-gray-600 font-medium">{order.delivery_time}</Text>
              </View>
            )}
            {order.remark && (
              <View className="pt-2 mt-2 border-t border-dashed border-gray-100">
                <Text className="text-xs text-gray-400">买家备注: {order.remark}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 收货地址 */}
        <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50 flex flex-row items-start">
          <View className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
            <Text className="text-xl">📍</Text>
          </View>
          <View className="flex-1">
            <View className="flex flex-row items-center mb-1">
              <Text className="text-base font-bold text-gray-900 mr-2">{order.receiver_name}</Text>
              <Text className="text-sm text-gray-400 font-medium">{order.receiver_phone}</Text>
            </View>
            <Text className="text-xs text-gray-500 leading-relaxed">
              {order.receiver_address}
            </Text>
          </View>
        </View>

        {/* 商品列表 */}
        <View className="flex flex-row items-center mb-4 px-1">
          <View className="w-1 h-4 bg-sakura-400 rounded-full mr-2" />
          <Text className="text-base font-bold text-gray-800">商品清单</Text>
        </View>

        <View className="space-y-4">
          {order.goods_list.map((item: OrderGoodsItem, idx: number) => {
            const deliveryStatusStyle = getDeliveryStatusStyle(item.delivery_status);
            const isShipped = item.delivery_status === DeliveryStatusEnum.DELIVERED;
            const afterSalesStatusStyle = getAfterSalesStatusStyle(item.status);

            return (
              <View key={`${item.commodity_id}-${item.sku || idx}`} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                {/* 商品头部状态 */}
                <View className="flex flex-row justify-between items-center mb-4 pb-4 border-b border-gray-50">
                  <View className="flex flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-2 ${isShipped ? 'bg-green-400' : 'bg-orange-400'}`} />
                    <Text className="text-xs font-bold text-gray-700">{deliveryStatusStyle.text}</Text>
                  </View>
                  {afterSalesStatusStyle && (
                    <Text className={`text-xs font-bold px-2 py-0.5 rounded-full ${afterSalesStatusStyle.color} bg-gray-50`}>
                      {afterSalesStatusStyle.text}
                    </Text>
                  )}
                </View>

                {/* 商品内容 */}
                <View className="mb-4">
                  <GoodsItem
                    item={{
                      id: item.commodity_id,
                      title: item.title,
                      imgUrl: item.image,
                      price: item.price,
                      quantity: item.quantity,
                      sku: item.sku || {},
                    }}
                    type="order"
                    isLast={true}
                  />
                </View>

                {/* 物流及售后操作区 */}
                <View className="space-y-3">
                  {isShipped && item.logistics_company && item.logistics_no && (
                    <View className="bg-indigo-50/50 rounded-2xl p-3 flex flex-row items-center justify-between">
                      <View>
                        <Text className="text-xs text-indigo-400 block">物流: {item.logistics_company}</Text>
                        <Text className="text-xs font-bold text-indigo-600">{item.logistics_no}</Text>
                      </View>
                      <Button
                        size="small"
                        className="!text-xs !px-3 !h-6 !rounded-full !bg-white !border-indigo-100 !text-indigo-500"
                        onClick={() => handleViewLogistics(item.logistics_no || '', item.logistics_company || '', item.sub_order_id)}
                      >
                        查看物流
                      </Button>
                    </View>
                  )}

                  {order.pay_status === PayStatusEnum.PAID && (
                    <View className="flex flex-row gap-2 justify-end pt-2">
                      {(!item.status || item.status === 0 || item.status === 4) && (
                        <Button
                          size="small"
                          className="!text-xs !px-4 !h-7 !rounded-full !bg-white !border-gray-100 !text-gray-500 active:bg-gray-50"
                          onClick={() => handleOpenAfterSalesDialog(
                            item.status === 4 ? 'resubmit' : 'apply',
                            item.sub_order_id,
                            item.work_order_id
                          )}
                        >
                          {item.status === 4 ? '重新申请' : '申请售后'}
                        </Button>
                      )}
                      {item.status === 1 && item.work_order_id && (
                        <Button
                          size="small"
                          className="!text-xs !px-4 !h-7 !rounded-full !bg-white !border-gray-100 !text-gray-500 active:bg-gray-50"
                          onClick={() => handleOpenAfterSalesDialog('cancel', item.sub_order_id, item.work_order_id)}
                        >
                          取消售后
                        </Button>
                      )}
                      {item.status === 2 && item.work_order_id && (
                        <Button
                          size="small"
                          className="!text-xs !px-4 !h-7 !rounded-full !bg-gradient-to-r !from-orange-400 !to-orange-500 !text-white !font-bold !border-none active:scale-95"
                          onClick={() => handleOpenAfterSalesDialog('logistics', item.sub_order_id, item.work_order_id)}
                        >
                          填写物流
                        </Button>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 底部金额详情 - 固定栏 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 pb-10 flex flex-col gap-4 z-50">
        <View className="flex flex-row justify-between items-end px-2">
          <View>
            <Text className="text-xs text-gray-400 block mb-1 tracking-wider">TOTAL AMOUNT</Text>
            <View className="flex flex-row items-baseline">
              <Text className="text-xs text-gray-400 mr-2 line-through">¥{order.total_amount?.toFixed(2)}</Text>
              <Text className="text-2xl font-black text-red-500 italic">¥{order.actual_pay_amount?.toFixed(2)}</Text>
            </View>
          </View>
          <View className="text-right">
            <Text className="text-xs text-green-500 font-bold block mb-1">已优惠 ¥{order.discount_amount?.toFixed(2)}</Text>
            <Text className="text-xs text-gray-400">含运费 ¥0.00</Text>
          </View>
        </View>

        {order.pay_status === PayStatusEnum.WAITING && (
          <Button
            block
            className="!bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-lg !shadow-sakura-100 active:scale-95 transition-transform"
            onClick={() => Taro.navigateTo({ url: `/pages/payment/index?id=${order.id}` })}
          >
            立即支付 · SECURE CHECKOUT
          </Button>
        )}
      </View>

      {/* 售后对话框 - 适配品牌色 */}
      <Dialog
        open={afterSalesDialogVisible}
        onClose={() => setAfterSalesDialogVisible(false)}
        className="!rounded-3xl"
      >
        <Dialog.Header className="!font-bold !text-lg">{getAfterSalesDialogTitle()}</Dialog.Header>
        <Dialog.Content>
          <View className="px-6 pb-6 pt-2">
            {(afterSalesType === 'apply' || afterSalesType === 'resubmit') && (
              <>
                <View className="mb-6">
                  <Text className="text-xs text-gray-400 mb-3 block font-bold tracking-widest">SELECT TYPE</Text>
                  <View className="flex gap-3">
                    <Button
                      size="small"
                      className={`!flex-1 !rounded-2xl !py-5 !font-bold ${afterSalesForm.type === 1 ? '!bg-sakura-400 !text-white !border-none shadow-md shadow-sakura-100' : '!bg-white !text-gray-400 !border-gray-100'}`}
                      onClick={() => setAfterSalesForm({ ...afterSalesForm, type: 1, return_type: 1 })}
                    >
                      仅退款
                    </Button>
                    <Button
                      size="small"
                      className={`!flex-1 !rounded-2xl !py-5 !font-bold ${afterSalesForm.type === 2 ? '!bg-indigo-400 !text-white !border-none shadow-md shadow-indigo-100' : '!bg-white !text-gray-400 !border-gray-100'}`}
                      onClick={() => setAfterSalesForm({ ...afterSalesForm, type: 2, return_type: 2 })}
                    >
                      退货退款
                    </Button>
                  </View>
                </View>
                <View className="mb-4">
                  <Text className="text-xs text-gray-400 mb-3 block font-bold tracking-widest">REASON</Text>
                  <View className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <Textarea
                      className="!min-h-[100px] !p-3 !text-sm !bg-transparent"
                      value={afterSalesForm.reason}
                      onChange={(e) => setAfterSalesForm({ ...afterSalesForm, reason: e.detail.value })}
                      placeholder="请详细描述您的售后原因..."
                      maxlength={500}
                    />
                  </View>
                </View>
              </>
            )}
            {afterSalesType === 'logistics' && (
              <View className="space-y-4">
                <View>
                  <Text className="text-xs text-gray-400 mb-2 block font-bold">LOGISTICS COMPANY</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-3 py-1">
                    <Input
                      className="!text-sm"
                      value={afterSalesForm.logistics_company}
                      onChange={(e) => setAfterSalesForm({ ...afterSalesForm, logistics_company: e.detail.value })}
                      placeholder="例如：顺丰速运"
                    />
                  </View>
                </View>
                <View>
                  <Text className="text-xs text-gray-400 mb-2 block font-bold">TRACKING NUMBER</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-3 py-1">
                    <Input
                      className="!text-sm"
                      value={afterSalesForm.logistics_no}
                      onChange={(e) => setAfterSalesForm({ ...afterSalesForm, logistics_no: e.detail.value })}
                      placeholder="请输入快递单号"
                    />
                  </View>
                </View>
              </View>
            )}
            {afterSalesType === 'cancel' && (
              <View className="py-4 text-center">
                <Text className="text-gray-500">确定要撤销当前的售后申请吗？撤销后可能无法再次申请。</Text>
              </View>
            )}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <View className="flex flex-row w-full px-6 pb-6 pt-0 gap-3">
            <Button
              className="!flex-1 !rounded-2xl !border-gray-100 !text-gray-400 !h-10"
              onClick={() => setAfterSalesDialogVisible(false)}
            >
              取消
            </Button>
            <Button
              className="!flex-1 !rounded-2xl !bg-sakura-400 !text-white !border-none !h-10 !font-bold shadow-md shadow-sakura-100"
              onClick={handleAfterSalesSubmit}
            >
              确认提交
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

export default OrderDetail;