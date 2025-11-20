import React, { useState, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { useLoad } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { Button, Empty, Price } from '@nutui/nutui-react-taro';
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
          const payStatusItemStyle = getPayStatusStyle(order.pay_status); // 支付状态为订单级
          return (
            <View key={`${item.commodity_id}-${item.sku || idx}`} className="bg-white p-4 rounded-lg shadow-sm">
              {/* 商品发货状态 */}
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
            onClick={()=> Taro.navigateTo({ url: `/pages/payment/index?id=${order.id}` })}
            className="rounded-full h-12 text-base font-semibold"
          >
            立即支付 ¥{order.actual_pay_amount.toFixed(2)}
          </Button>
        )}
      </View>
    </View>
  );
}

export default OrderDetail;