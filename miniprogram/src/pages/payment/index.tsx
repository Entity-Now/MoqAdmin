import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Button, Empty, Dialog } from '@taroify/core';
import TopBar from '../../components/TopBar';
import orderApi from '../../api/order';
import paymentApi from '../../api/payment'
import type { OrderDetailResponse, OrderGoodsItem } from '../../api/order/types';
import { GoodsItem } from '../../components/Good';
import { PayStatusMap } from '../../../types/PayStatus';
import './index.scss';
import taroHelper from '../../utils/taroHelper'

function OrderPay() {
  // 订单ID状态
  const [orderId, setOrderId] = useState<number>(0);
  // 支付提醒弹窗状态
  const [visible, setVisible] = useState(false);

  // 订单详情状态
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  // 支付加载状态
  const [paying, setPaying] = useState(false);
  // 参数无效状态
  const [paramsInvalid, setParamsInvalid] = useState(false);

  // 加载订单详情
  useLoad((options) => {
    const id = Number(options.id);
    if (!id || isNaN(id)) {
      setParamsInvalid(true);
      setIsLoading(false);
      return;
    }
    setOrderId(id);
    loadOrderDetail(id);
  });

  const loadOrderDetail = async (id: number) => {
    try {
      Taro.showLoading({ title: '加载中...' });
      setIsLoading(true);
      const res = await orderApi.detail(id);
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

  // 支付订单（模拟或调用支付API，根据实际支付SDK调整）
  const handlePay = async () => {
    if (!order || !orderId || isNaN(orderId)) return;

    if (order.pay_status !== 0) { // 假设 0 为未支付
      Taro.showToast({
        title: '订单已支付',
        icon: 'none'
      });
      Taro.navigateTo({ url: '/pages/order/detail?id=' + orderId })
      return;
    }

    try {
      setPaying(true);
      Taro.showLoading({ title: '发起支付中...' });
      // 调用支付API
      const res = await paymentApi.prepay({
        order_id: orderId,
        pay_way: 2, // 假设 2 为微信支付
        attach: "2",
        redirect_url: ""
      });
      if (!res) {
        Taro.showToast({
          title: '支付失败',
          icon: 'none'
        });
        return;
      }
      const paymentResult: boolean = await taroHelper.requestPayment({
        ...res
      })
      if (paymentResult) {
        console.log('支付成功', paymentResult)
      } else {
        console.log('支付失败', paymentResult)
      }
      setVisible(true);
    } catch (error) {
      console.error('支付失败:', error);
      Taro.showToast({
        title: '支付失败',
        icon: 'none'
      });
    } finally {
      Taro.hideLoading();
      setPaying(false);
    }
  };

  const confirmPay = async () => {
    if (!orderId || isNaN(orderId)) {
      Taro.showToast({ title: '订单参数错误', icon: 'none' });
      return;
    }
    try {
      Taro.showLoading({ title: '确认支付中...' });
      const res = await paymentApi.checkPayStatus({
        attach: "2",
        order_id: orderId,
      });
      if (res) {
        Taro.showToast({
          title: '支付成功',
          icon: 'success'
        });
        Taro.navigateTo({ url: '/pages/order/index' })
      }
    } catch (err) {
      Taro.showToast({
        title: '支付失败',
        icon: 'none'
      });
    } finally {
      Taro.hideLoading();
    }
  }

  // 参数无效提示
  if (paramsInvalid) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white px-6">
        <Empty className='!bg-transparent'>
          <Empty.Description>参数无效，请从订单列表重新进入支付页面</Empty.Description>
        </Empty>
        <Button
          block
          className="!bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-md active:scale-95 transition-transform mt-8"
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
      <View className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white">
        <View className="text-4xl mb-4 animate-pulse">⏳</View>
        <Text className="text-xs text-gray-400 mt-4 tracking-widest uppercase">Fetching Order Details</Text>
      </View>
    );
  }

  // 订单不存在或已支付
  if (!order || order.pay_status !== 0) {
    return (
      <View className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white px-6">
        <View className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 w-full max-w-sm text-center">
          <View className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Text className="text-4xl">📭</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900 mb-2 block">订单无效或已支付</Text>
          <Button
            block
            className="!bg-white !text-gray-500 !py-4 !rounded-2xl !font-bold !border !border-gray-100 active:bg-gray-50 mt-6"
            onClick={() => Taro.navigateBack()}
          >
            返回上一页
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white">
      <TopBar title="订单支付" showBack />

      <View className="px-4 pt-4 pb-32">
        {/* 订单信息卡片 */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-gray-50 overflow-hidden relative">
          <View className="absolute top-0 right-0 w-32 h-32 bg-cotton-candy/5 rounded-full -mr-16 -mt-16" />

          <View className="flex flex-row justify-between items-start mb-6">
            <View>
              <View className="flex flex-row gap-2 mb-2">
                <Text className="text-md font-bold text-gray-900">
                  订单详情
                </Text>
                <Text className={`text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-current`}>
                  {PayStatusMap[order.pay_status]}
                </Text>
              </View>
              <Text className="text-xs text-gray-400">流水号: {order.order_sn}</Text>
            </View>
            <View className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Text className="text-xs text-gray-400">MOQISTAR · PAYMENT</Text>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex flex-row justify-between">
              <Text className="text-sm text-gray-400">下单时间</Text>
              <Text className="text-sm text-gray-600 font-medium">{order.create_time}</Text>
            </View>
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
          {order.goods_list.map((item: OrderGoodsItem, idx: number) => (
            <View key={`${item.commodity_id}-${item.sku || idx}`} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
              <GoodsItem
                item={{
                  id: item.commodity_id,
                  title: item.title,
                  imgUrl: item.image || '', // Compatible with detail.tsx style props
                  price: item.price,
                  quantity: item.quantity,
                  sku: item.sku || {},
                }}
                type="order"
                isLast={true}
              />
            </View>
          ))}
        </View>
      </View>

      {/* 底部支付详情 - 固定栏 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 pb-10 flex flex-col gap-4 z-50">
        <View className="flex flex-row justify-between items-end px-2">
          <View>
            <Text className="text-xs text-gray-400 block mb-1 tracking-wider">TOTAL TO PAY</Text>
            <View className="flex flex-row items-baseline">
              <Text className="text-2xl font-black text-red-500 italic">¥{order.actual_pay_amount.toFixed(2)}</Text>
            </View>
          </View>
          <View className="text-right">
            {order.discount_amount > 0 && (
              <Text className="text-xs text-green-500 font-bold block mb-1">已优惠 ¥{order.discount_amount.toFixed(2)}</Text>
            )}
            <Text className="text-xs text-gray-400">商品总额 ¥{order.total_amount.toFixed(2)}</Text>
          </View>
        </View>

        <Button
          block
          loading={paying}
          onClick={handlePay}
          className="!bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-lg !shadow-sakura-100 active:scale-95 transition-transform"
        >
          立即支付 · SECURE CHECKOUT
        </Button>
      </View>

      {/* 支付提醒 */}
      <Dialog
        open={visible}
        onClose={() => setVisible(false)}
        className="!rounded-3xl"
      >
        <Dialog.Header className="!font-bold !text-lg">支付提醒</Dialog.Header>
        <Dialog.Content className="!text-center !py-6 !text-gray-600">
          请确认支付是否已经完成！
        </Dialog.Content>
        <Dialog.Actions>
          <View className="flex flex-row w-full px-6 pb-6 pt-0 gap-3">
            <Button
              onClick={() => setVisible(false)}
              className="!flex-1 !rounded-2xl !border-gray-100 !text-gray-400 !h-10"
            >
              未支付
            </Button>
            <Button
              onClick={confirmPay}
              className="!flex-1 !rounded-2xl !bg-sakura-400 !text-white !border-none !h-10 !font-bold shadow-md shadow-sakura-100"
            >
              已支付
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

export default OrderPay;