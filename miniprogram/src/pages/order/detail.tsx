import React, { useState, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { useLoad } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { Button, Empty, Price, Dialog, TextArea, Input } from '@nutui/nutui-react-taro';
import TopBar from '../../components/TopBar';
import orderApi from '../../api/order';
import type { OrderDetailResponse, OrderGoodsItem } from '../../api/order/types';
import { GoodsItem } from '../../components/Good';
import { PayStatusEnum, PayStatusStyleMap, PayWayMap, DeliveryStatusEnum } from '../../../types/PayStatus';
import './index.scss';

function OrderDetail() {
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
  const handleViewLogistics = (logisticsNo: string, company: string) => {
    Taro.showToast({
      title: `物流公司: ${company || '未知'}\n物流单号: ${logisticsNo}`,
      icon: 'none'
    });
    // 可扩展: Taro.navigateTo({ url: `/pages/logistics/index?no=${logisticsNo}&company=${company}` });
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

  // 参数无效提示
  if (paramsInvalid) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Empty
          title="参数无效"
          description="请从订单列表重新进入详情页面"
          className='!bg-gray-50'
        />
        <Button
          className="mt-4"
          type="primary"
          size="normal"
          onClick={() => Taro.navigateTo({ url: '/pages/order/index' })}
        >
          返回订单列表
        </Button>
      </View>
    );
  }

  // 加载中
  if (isLoading) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 bg-white shadow-lg rounded-lg">
          <View className="text-4xl mb-4 animate-pulse">⏳</View>
          <Text className="text-gray-600 font-medium">加载中...</Text>
        </View>
      </View>
    );
  }

  // 订单不存在
  if (!order) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 bg-white shadow-lg rounded-lg">
          <View className="text-4xl mb-4">📭</View>
          <Text className="text-gray-600 font-medium">订单不存在</Text>
          <Button
            className="mt-4"
            size="normal"
            onClick={() => Taro.navigateBack()}
          >
            返回
          </Button>
        </View>
      </View>
    );
  }

  const payStatusStyle = getPayStatusStyle(order.pay_status);

  return (
    <View className="min-h-screen bg-gray-50">
      <TopBar title="订单详情" showBack />

      {/* 订单信息 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex gap-2 justify-start items-center mb-1">
          <Text className="min-w-[120px] text-sm text-gray-600">订单号</Text>
          <Text className="text-xs text-gray-400">{order.order_sn}</Text>
        </View>
        <View className="flex gap-2 justify-start items-center mb-1">
          <Text className="min-w-[120px] text-sm text-gray-600">下单时间</Text>
          <Text className="text-xs text-gray-400">{order.create_time}</Text>
        </View>
        <View className="flex gap-2 justify-start items-center mb-1">
          <Text className="min-w-[120px] text-sm text-gray-600">付款状态</Text>
          <Text className={`text-xs ${payStatusStyle.color}`}>
            {payStatusStyle.text}
          </Text>
        </View>
        {order.pay_status === PayStatusEnum.PAID && order.pay_way && (
          <View className="flex gap-2 justify-start items-center mb-1">
            <Text className="min-w-[120px] text-sm text-gray-600">支付方式</Text>
            <Text className="text-xs text-gray-400">{PayWayMap[order.pay_way] || '未知'}</Text>
          </View>
        )}
        {order.pay_time && (
          <View className="flex gap-2 justify-start items-center mb-1">
            <Text className="min-w-[120px] text-sm text-gray-600">支付时间</Text>
            <Text className="text-xs text-gray-400">{order.pay_time}</Text>
          </View>
        )}
        {order.delivery_time && (
          <View className="flex gap-2 justify-start items-center mb-1">
            <Text className="min-w-[120px] text-sm text-gray-600">发货时间</Text>
            <Text className="text-xs text-gray-400">{order.delivery_time}</Text>
          </View>
        )}

        {order.remark && (
          <View className="text-xs text-gray-500 mt-1">备注: {order.remark}</View>
        )}
      </View>

      {/* 收货地址 */}
      <View className="bg-white mx-4 mt-3 p-4 rounded-lg shadow-sm">
        <View className="flex items-start mb-2">
          <View className="text-sm font-medium text-gray-900 mr-2">收货人</View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">{order.receiver_name}</Text>
            <Text className="text-sm text-gray-600 ml-1"> {order.receiver_phone}</Text>
          </View>
        </View>
        <View className="text-sm text-gray-600 leading-relaxed">
          地址: {order.receiver_address}
        </View>
      </View>

      {/* 商品列表 */}
      <View className="space-y-3 px-4 pb-20">
        <Text className="text-base font-semibold text-gray-900 mb-3">商品详情</Text>
        {order.goods_list.map((item: OrderGoodsItem, idx: number) => {
          const deliveryStatusStyle = getDeliveryStatusStyle(item.delivery_status);
          const isShipped = item.delivery_status === DeliveryStatusEnum.DELIVERED;
          const payStatusItemStyle = getPayStatusStyle(order.pay_status);
          const afterSalesStatusStyle = getAfterSalesStatusStyle(item.status);

          return (
            <View key={`${item.commodity_id}-${item.sku || idx}`} className="bg-white p-4 rounded-lg shadow-sm">
              {/* 商品状态信息 */}
              <View className="flex flex-col space-y-1 mb-3">
                <View className="flex justify-between">
                  <Text className="text-sm text-gray-600">付款状态</Text>
                  <Text className={`text-sm font-medium ${payStatusItemStyle.color}`}>
                    {payStatusItemStyle.text}
                  </Text>
                </View>
                <View className="flex justify-between">
                  <Text className="text-sm text-gray-600">发货状态</Text>
                  <Text className={`text-sm font-medium ${deliveryStatusStyle.color}`}>
                    {deliveryStatusStyle.text}
                  </Text>
                </View>
                {afterSalesStatusStyle && (
                  <View className="flex justify-between">
                    <Text className="text-sm text-gray-600">售后状态</Text>
                    <Text className={`text-sm font-medium ${afterSalesStatusStyle.color}`}>
                      {afterSalesStatusStyle.text}
                    </Text>
                  </View>
                )}
                {(!item.status || item.status === 0 || item.status === 4) && (
                  item.refuse_reason ? (
                    <Text className="text-xs text-gray-500">拒绝原因: {item.refuse_reason}</Text>
                  ) : null)}
              </View>

              {/* 物流信息 - 跟随每个商品 */}
              {isShipped && item.logistics_company && item.logistics_no && (
                <View className="bg-blue-50 p-3 rounded-lg mb-3">
                  <Text className="text-sm text-gray-600 mb-1">物流信息</Text>
                  <View className="flex justify-between mb-1">
                    <Text className="text-xs text-gray-500">物流公司</Text>
                    <Text className="text-xs text-gray-900">{item.logistics_company}</Text>
                  </View>
                  <View className="flex justify-between">
                    <Text className="text-xs text-gray-500">物流单号</Text>
                    <Text className="text-xs text-gray-900">{item.logistics_no}</Text>
                  </View>
                  <Button
                    size="small"
                    type="primary"
                    fill="outline"
                    className="mt-2"
                    onClick={() => handleViewLogistics(item.logistics_no || '', item.logistics_company || '')}
                  >
                    查看物流
                  </Button>
                </View>
              )}

              {/* 商品渲染 */}
              <View className="space-y-2 mb-3">
                <GoodsItem
                  item={{
                    id: item.commodity_id,
                    title: item.title,
                    image: item.image ? item.image : [],
                    price: item.price,
                    quantity: item.quantity,
                    sku: item.sku || {},
                  }}
                  type="order"
                  isLast={idx === order.goods_list.length - 1}
                />
              </View>

              {/* 售后操作按钮 */}
              {order.pay_status === PayStatusEnum.PAID && (
                <View className="flex gap-2 mt-3">
                  {/* 无售后或已拒绝 - 显示申请/重新申请按钮 */}

                  {(!item.status || item.status === 0 || item.status === 4) && (
                    <Button
                      size="small"
                      type="primary"
                      fill="outline"
                      onClick={() => handleOpenAfterSalesDialog(
                        item.status === 4 ? 'resubmit' : 'apply',
                        item.sub_order_id,
                        item.work_order_id
                      )}
                    >
                      {item.status === 4 ? '重新申请' : '申请售后'}
                    </Button>
                  )}

                  {/* 申请售后中 - 可以取消 */}
                  {item.status === 1 && item.work_order_id && (
                    <Button
                      size="small"
                      fill="outline"
                      onClick={() => handleOpenAfterSalesDialog('cancel', item.sub_order_id, item.work_order_id)}
                    >
                      取消售后
                    </Button>
                  )}

                  {/* 同意退货 - 需要填写物流 */}
                  {item.status === 2 && item.work_order_id && (
                    <Button
                      size="small"
                      type="warning"
                      fill="outline"
                      onClick={() => handleOpenAfterSalesDialog('logistics', item.sub_order_id, item.work_order_id)}
                    >
                      填写退货物流
                    </Button>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* 整体金额详情 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex justify-between items-center mb-2">
          <Text className="text-sm text-gray-600">商品总金额</Text>
          <Price
            price={order.total_amount}
            size="normal"
            symbol="¥"
            className="text-gray-900"
          />
        </View>
        {order.discount_amount > 0 && (
          <View className="flex justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">优惠</Text>
            <Text className="text-sm text-green-500">-¥{order.discount_amount.toFixed(2)}</Text>
          </View>
        )}
        <View className="flex justify-between items-center pt-2 border-t border-gray-100">
          <Text className="text-base font-semibold text-gray-900">实付款</Text>
          <Price
            price={order.actual_pay_amount}
            size="large"
            symbol="¥"
            className="text-red-500 font-bold"
          />
        </View>
        {order.pay_status === PayStatusEnum.WAITING && (
          <Button
            type="primary"
            block
            size="large"
            onClick={() => Taro.navigateTo({ url: `/pages/payment/index?id=${order.id}` })}
            className="rounded-full h-12 text-base font-semibold"
          >
            立即支付 ¥{order.actual_pay_amount.toFixed(2)}
          </Button>
        )}
      </View>

      {/* 售后对话框 */}
      <Dialog
        visible={afterSalesDialogVisible}
        title={getAfterSalesDialogTitle()}
        onCancel={() => setAfterSalesDialogVisible(false)}
        onConfirm={handleAfterSalesSubmit}
      >
        <View className="p-4">
          {(afterSalesType === 'apply' || afterSalesType === 'resubmit') && (
            <>
              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-2">申请类型</Text>
                <View className="flex gap-2">
                  <Button
                    size="small"
                    type={afterSalesForm.type === 1 ? 'primary' : 'default'}
                    onClick={() => setAfterSalesForm({ ...afterSalesForm, type: 1, return_type: 1 })}
                  >
                    仅退款
                  </Button>
                  <Button
                    size="small"
                    type={afterSalesForm.type === 2 ? 'primary' : 'default'}
                    onClick={() => setAfterSalesForm({ ...afterSalesForm, type: 2, return_type: 2 })}
                  >
                    退货退款
                  </Button>
                </View>
              </View>
              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-2">申请原因</Text>
                <TextArea
                  value={afterSalesForm.reason}
                  onChange={(value) => setAfterSalesForm({ ...afterSalesForm, reason: value })}
                  placeholder="请输入申请原因（1-500字）"
                  maxLength={500}
                  rows={4}
                />
              </View>
            </>
          )}
          {afterSalesType === 'logistics' && (
            <>
              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-2">物流公司</Text>
                <Input
                  value={afterSalesForm.logistics_company}
                  onChange={(value) => setAfterSalesForm({ ...afterSalesForm, logistics_company: value })}
                  placeholder="请输入物流公司名称"
                />
              </View>
              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-2">物流单号</Text>
                <Input
                  value={afterSalesForm.logistics_no}
                  onChange={(value) => setAfterSalesForm({ ...afterSalesForm, logistics_no: value })}
                  placeholder="请输入物流单号"
                />
              </View>
            </>
          )}
          {afterSalesType === 'cancel' && (
            <Text className="text-sm text-gray-600">确认取消该售后申请吗？</Text>
          )}
        </View>
      </Dialog>
    </View>
  );
}

export default OrderDetail;