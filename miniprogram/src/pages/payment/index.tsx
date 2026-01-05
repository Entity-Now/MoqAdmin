import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Button, Empty, Dialog } from '@taroify/core';
import TopBar from '../../components/TopBar';
import orderApi from '../../api/order';
import paymentApi from '../../api/payment'
import type { OrderDetailResponse, OrderGoodsItem } from '../../api/order/types';
import { GoodsItem } from '../../components/Good'; // 假设之前封装的 GoodsItem 组件路径，根据实际调整
import { PayStatusMap } from '../../../types/PayStatus';
import './index.scss'; // 假设有样式文件
import taroHelper from '../../utils/taroHelper'

function OrderPay() {
  // 从路由获取订单ID
  const routerParams = Taro.getCurrentInstance()?.router?.params || {};
  const orderId = Number(routerParams.id);
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
  useLoad(() => {
    if (!orderId) {
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
      const res = await orderApi.detail(orderId);
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
    if (!order) return;

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
      <View className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Empty className='!bg-gray-50'>
          <Empty.Description>参数无效，请从订单列表重新进入支付页面</Empty.Description>
        </Empty>
        <Button
          className="mt-4"
          color="primary"
          onClick={() => Taro.navigateTo({ url: '/pages/order/index' })}
        >
          返回
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

  // 订单不存在或已支付
  if (!order || order.pay_status !== 0) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 bg-white shadow-lg rounded-lg">
          <View className="text-4xl mb-4">📭</View>
          <Text className="text-gray-600 font-medium">订单无效或已支付</Text>
          <Button
            className="mt-4"
            size="medium"
            onClick={() => Taro.navigateBack()}
          >
            返回
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <TopBar title="订单支付" showBack />

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
          <Text className="min-w-[120px] text-sm text-gray-600">订单状态</Text>
          <Text className="text-xs text-gray-400">{PayStatusMap[order.pay_status]}</Text>
        </View>

        {order.remark && (
          <View className="text-xs text-gray-500 mt-1">备注: {order.remark}</View>
        )}
      </View>

      {/* 收货地址 */}
      <View className="bg-white mx-4 mt-3 p-4 rounded-lg shadow-sm">
        <View className="flex items-start mb-2">
          <Text className="text-sm font-medium text-gray-900 mr-2">收件人</Text>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">{order.receiver_name}</Text>
            <Text className="text-sm text-gray-600 ml-1">{order.receiver_phone}</Text>
          </View>
        </View>
        <View className="text-sm text-gray-600 leading-relaxed">
          地址: {order.receiver_address}
        </View>
      </View>

      {/* 商品列表 */}
      <View className="bg-white mx-4 mt-3 p-4 rounded-lg shadow-sm">
        <Text className="text-base font-semibold text-gray-900 mb-3">商品详情</Text>
        <View className="space-y-2">
          {order.goods_list.map((item: OrderGoodsItem, idx: number) => (
            <GoodsItem
              key={`${item.commodity_id}-${item.sku || idx}`}
              item={{
                id: item.commodity_id,
                title: item.title,
                image: [item.image?.[0] || ''],
                price: item.price,
                quantity: item.quantity,
                sku: item.sku || {},
              }}
              type="order"
              isLast={idx === order.goods_list.length - 1}
            />
          ))}
        </View>
      </View>

      {/* 金额详情 */}
      <View className="bg-white mx-4 mt-3 p-4 rounded-lg shadow-sm">
        <View className="flex justify-between items-center mb-2">
          <Text className="text-sm text-gray-600">商品总金额</Text>
          <Text className="text-gray-900 text-sm font-medium">¥{order.total_amount.toFixed(2)}</Text>
        </View>
        {order.discount_amount > 0 && (
          <View className="flex justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">优惠</Text>
            <Text className="text-sm text-green-500">-¥{order.discount_amount.toFixed(2)}</Text>
          </View>
        )}
        <View className="flex justify-between items-center pt-2 border-t border-gray-100">
          <Text className="text-base font-semibold text-gray-900">实付款</Text>
          <Text className="text-red-500 font-bold text-xl">¥{order.actual_pay_amount.toFixed(2)}</Text>
        </View>
      </View>

      {/* 支付按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          color="primary"
          block
          size="large"
          loading={paying}
          onClick={handlePay}
          className="rounded-full h-12 text-base font-semibold"
        >
          立即支付 ¥{order.actual_pay_amount.toFixed(2)}
        </Button>
      </View>
      {/* 支付提醒 */}
      <Dialog
        open={visible}
        onClose={() => setVisible(false)}
      >
        <Dialog.Header>支付提醒</Dialog.Header>
        <Dialog.Content>请确认支付是否已经完成！</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setVisible(false)}>未支付</Button>
          <Button color="primary" onClick={confirmPay}>已支付</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

export default OrderPay;