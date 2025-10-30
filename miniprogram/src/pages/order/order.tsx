import Taro from '@tarojs/taro';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { Button, Empty, Skeleton, Radio } from '@nutui/nutui-react-taro';
import orderApi from '../../api/order';
import type { OrderListVo, OrderGoodsItem, OrderListResponse } from '../../api/order/types';
import './order.scss';

// 订单状态枚举
enum OrderStatus {
  WAITING = 0,    // 待付款
  PAID = 1,       // 已付款
  DELIVERED = 2,  // 已发货
  REFUNDED = 3,   // 已退款
  COMPLETED = 4,  // 已完成
}

// Tab 配置
const ORDER_TABS: { title: string; value: any }[] = [
  { title: '全部', value: null },
  { title: '待付款', value: OrderStatus.WAITING },
  { title: '已付款', value: OrderStatus.PAID },
  { title: '已发货', value: OrderStatus.DELIVERED },
];

// 状态标签配置
const STATUS_CONFIG = {
  [OrderStatus.WAITING]: { text: '待付款', color: 'text-orange-600' },
  [OrderStatus.PAID]: { text: '已付款', color: 'text-blue-600' },
  [OrderStatus.DELIVERED]: { text: '已发货', color: 'text-green-600' },
  [OrderStatus.REFUNDED]: { text: '已退款', color: 'text-red-600' },
  [OrderStatus.COMPLETED]: { text: '已完成', color: 'text-gray-600' },
};

interface OrderListProps {}

export default function OrderList(props: OrderListProps) {
  const [currentTab, setCurrentTab] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orders, setOrders] = useState<OrderListVo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const status = instance.router?.params?.status;
    if (status !== undefined) {
      const statusNum = parseInt(status, 10);
      if (!isNaN(statusNum)) {
        setCurrentTab(statusNum);
      }
    }
  }, []);

  // 加载订单列表
  const fetchOrders = useCallback(async (
    status: number | null,
    pageNum: number,
    isRefresh: boolean = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const params = status || -99;
      const res = await orderApi.lists(params as any, pageNum, 10);

      const newOrders = res || [];
      
      if (isRefresh || pageNum === 1) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }

      setHasMore(newOrders.length === 10 && res.length > pageNum * 10);
      setPage(pageNum);
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      setError(err.message || '加载失败，请重试');
      if (pageNum === 1) {
        setOrders([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  // 切换 Tab
  const handleTabChange = useCallback((value: number) => {
    setCurrentTab(value);
    setPage(1);
    setHasMore(true);
    fetchOrders(value, 1);
  }, [fetchOrders]);

  // 下拉刷新
  const handleRefresh = useCallback(() => {
    fetchOrders(currentTab, 1, true);
  }, [currentTab, fetchOrders]);

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      fetchOrders(currentTab, page + 1);
    }
  }, [currentTab, page, hasMore, loadingMore, loading, fetchOrders]);

  // 初始化加载
  useEffect(() => {
    fetchOrders(currentTab, 1);
  }, [currentTab]);

  // 订单操作
  const handleOrderAction = useCallback(async (
    orderId: number,
    action: 'cancel' | 'delete' | 'pay' | 'detail'
  ) => {
    if (action === 'detail') {
      Taro.navigateTo({ url: `/pages/order/detail?id=${orderId}` });
      return;
    }

    if (action === 'pay') {
      Taro.navigateTo({ url: `/pages/payment/payment?order_id=${orderId}` });
      return;
    }

    const actionText = action === 'cancel' ? '取消' : '删除';
    const { confirm } = await Taro.showModal({
      title: `${actionText}订单`,
      content: `确认${actionText}该订单吗？`,
    });

    if (!confirm) return;

    try {
      Taro.showLoading({ title: '处理中...', mask: true });
      
     
      await orderApi.delete(orderId);

      Taro.showToast({ title: `${actionText}成功`, icon: 'success' });
      handleRefresh();
    } catch (err: any) {
      Taro.showToast({ 
        title: err.message || `${actionText}失败`, 
        icon: 'none' 
      });
    } finally {
      Taro.hideLoading();
    }
  }, [handleRefresh]);

  // 渲染商品项
  const renderGoodsItem = (item: OrderGoodsItem, isLast: boolean) => (
    <View 
      key={`${item.commodity_id}-${item.sku}`}
      className={`flex flex-row py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <Image
        className="w-20 h-20 rounded bg-gray-100 flex-shrink-0"
        src={item.image?.[0]}
        mode="aspectFill"
      />
      <View className="flex-1 ml-3 min-w-0">
        <Text className="text-sm text-gray-900 mb-1 block line-clamp-2">
          {item.title}
        </Text>
        {item.sku && (
          <Text className="text-xs text-gray-400 mb-2 block">
            规格: {JSON.stringify(item.sku)}
          </Text>
        )}
        <View className="flex flex-row justify-between items-center">
          <Text className="text-sm font-medium text-gray-900">
            ¥{item.price.toFixed(2)}
          </Text>
          <Text className="text-xs text-gray-500">
            x{item.quantity}
          </Text>
        </View>
      </View>
    </View>
  );

  // 渲染订单卡片
  const renderOrderCard = (order: OrderListVo) => {
    const statusConfig = STATUS_CONFIG[order.pay_status];
    const isWaiting = order.pay_status === OrderStatus.WAITING;
    const isCompleted = order.pay_status === OrderStatus.COMPLETED;
    const isRefunded = order.pay_status === OrderStatus.REFUNDED;

    return (
      <View key={order.id} className="bg-white mb-2 rounded-lg overflow-hidden">
        {/* 订单头部 */}
        <View className="flex flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
          <Text className="text-xs text-gray-500">
            订单号: {order.order_sn}
          </Text>
          <Text className={`text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.text}
          </Text>
        </View>

        {/* 商品列表 */}
        <View className="px-4">
          {order.goods_list.map((item, idx) => 
            renderGoodsItem(item, idx === order.goods_list.length - 1)
          )}
        </View>

        {/* 订单金额 */}
        <View className="px-4 py-3 border-t border-gray-100">
          <View className="flex flex-row justify-end items-center">
            <Text className="text-xs text-gray-500 mr-2">
              共{order.total_goods}件商品 实付:
            </Text>
            <Text className="text-base font-medium text-red-500">
              ¥{order.actual_pay_amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View className="flex flex-row justify-end items-center px-4 py-3 bg-gray-50 gap-2">
          {!isRefunded && (
            <Button
              size="small"
              fill="outline"
              onClick={() => handleOrderAction(order.id, 'detail')}
            >
              订单详情
            </Button>
          )}
          
          {isWaiting && (
            <>
              <Button
                size="small"
                fill="outline"
                onClick={() => handleOrderAction(order.id, 'delete')}
              >
                删除订单
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => handleOrderAction(order.id, 'pay')}
              >
                立即支付
              </Button>
            </>
          )}

          {(isCompleted || isRefunded) && (
            <Button
              size="small"
              fill="outline"
              onClick={() => handleOrderAction(order.id, 'delete')}
            >
              删除订单
            </Button>
          )}
        </View>
      </View>
    );
  };

  // Loading 状态
  if (loading && page === 1) {
    return (
      <View className="min-h-screen bg-gray-50">
        <View className="bg-white mb-2">
          <Radio.Group defaultValue={currentTab} direction="horizontal">
            {ORDER_TABS.map(tab => (
              <Radio key={tab.value} value={tab.value}  shape="button">
                {tab.title}
              </Radio>
            ))}
          </Radio.Group>
        </View>
        <View className="px-4">
          {[1, 2, 3].map(i => (
            <View key={i} className="bg-white mb-2 rounded-lg p-4">
              <Skeleton rows={3} animated />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* Tab 切换 */}
      <View className="bg-white mb-2 sticky top-0 z-10 p-2">
        <Radio.Group 
          defaultValue={currentTab}
           direction="horizontal"
          onChange={(value) => handleTabChange(value as number)}
        >
          {ORDER_TABS.map(tab => (
            <Radio
              key={tab.value} 
              value={tab.value}
              shape="button"
            >
              {tab.title}
            </Radio>
          ))}
        </Radio.Group>
      </View>

      {/* 订单列表 */}
      <ScrollView
        scrollY
        className="h-screen"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleLoadMore}
        lowerThreshold={100}
      >
        <View className="px-4 pb-4">
          {error && orders.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-20">
              <Text className="text-gray-500 text-sm mb-4">{error}</Text>
              <Button
                size="small"
                type="primary"
                onClick={() => fetchOrders(currentTab, 1)}
              >
                重新加载
              </Button>
            </View>
          ) : orders.length === 0 ? (
            <View className="py-20">
              <Empty description="暂无订单" />
            </View>
          ) : (
            <>
              {orders.map(renderOrderCard)}
              
              {/* 加载更多提示 */}
              {loadingMore && (
                <View className="py-4 text-center">
                  <Text className="text-xs text-gray-400">加载中...</Text>
                </View>
              )}
              
              {!hasMore && orders.length > 0 && (
                <View className="py-4 text-center">
                  <Text className="text-xs text-gray-400">没有更多了</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}