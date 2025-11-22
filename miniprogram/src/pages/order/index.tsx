import Taro from '@tarojs/taro';
import { useLoad, useDidShow } from '@tarojs/taro'
import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { Button, Empty, Skeleton, Radio, SearchBar } from '@nutui/nutui-react-taro';
import orderApi from '../../api/order';
import type { OrderListVo, OrderGoodsItem, OrderListResponse } from '../../api/order/types';
import './index.scss';
import TopBar from '../../components/TopBar';
import useUser from '../../store/useUser';
import { GoodsItem } from '../../components/Good';
import { PayStatusStyleMap, PayStatusEnum, PayStatusMap, ORDER_TABS } from '../../../types/PayStatus'



interface OrderListProps { }

export default function OrderList(props: OrderListProps) {
  const user = useUser();
  const [filter, setFilter] = useState({ keyword: '' });
  const [query_type, setQueryType] = useState('payStatus');
  const [currentTab, setCurrentTab] = useState<any>(ORDER_TABS[0]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orders, setOrders] = useState<OrderListVo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取路由参数
  useLoad(() => {
    const instance = Taro.getCurrentInstance();
    const statusStr = instance.router?.params?.status;
    const type = instance.router?.params?.type || 'payStatus';
    let initTab = ORDER_TABS[0];
    let initType = 'payStatus';
    let initStatus: number | null = ORDER_TABS[0].value;
    if (statusStr !== undefined) {
      initType = type;
      const statusNum = parseInt(statusStr, 10);
      if (!isNaN(statusNum)) {
        initStatus = statusNum;
        initTab = ORDER_TABS.find(tab => tab.value === statusNum) || ORDER_TABS[0];
      }
    }
    setQueryType(initType);
    setCurrentTab(initTab);
    fetchOrders(filter.keyword, initStatus, initType, 1);
  });

  useDidShow(() => {
    if (!loading && !refreshing) {
      fetchOrders(filter.keyword, currentTab?.value || null, query_type, 1);
    }
  })

  // 加载订单列表
  const fetchOrders = useCallback(async (
    keyword: string,
    status: number | null,
    type: string,
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
      const param = status == null ? -99 : status;
      const res = await orderApi.lists(keyword, param as any, type, pageNum, 10);

      const newOrders = res || [];

      if (isRefresh || pageNum === 1) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }

      setHasMore(newOrders.length === 10);
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
  const handleTabChange = useCallback((selectedTab: any) => {
    setCurrentTab(selectedTab);
    setQueryType(selectedTab.type || 'payStatus');
    setPage(1);
    setHasMore(true);
    fetchOrders(filter.keyword, selectedTab.value, selectedTab.type || 'payStatus', 1);
  }, [fetchOrders, filter.keyword]);

  // 下拉刷新
  const handleRefresh = useCallback(() => {
    fetchOrders(filter.keyword, currentTab?.value || null, query_type, 1, true);
  }, [filter.keyword, currentTab, query_type, fetchOrders]);

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      fetchOrders(filter.keyword, currentTab?.value || null, query_type, page + 1);
    }
  }, [filter.keyword, currentTab, query_type, page, hasMore, loadingMore, loading, fetchOrders]);

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
      Taro.navigateTo({ url: `/pages/payment/index?id=${orderId}` });
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

  // 搜索订单
  const performSearch = useCallback(() => {
    setPage(1);
    setHasMore(true);
    fetchOrders(filter.keyword, currentTab?.value || null, query_type, 1);
  }, [filter.keyword, currentTab, query_type, fetchOrders]);

  // 渲染订单卡片
  const renderOrderCard = (order: OrderListVo) => {
    const statusConfig = PayStatusStyleMap[order.pay_status];
    const isWaiting = order.pay_status === PayStatusEnum.WAITING;
    const isCompleted = order.pay_status === PayStatusEnum.PAID;
    const isRefunded = order.pay_status === PayStatusEnum.REFUNDED;
    return (
      <View key={order.id} className="bg-white mb-2 rounded-lg overflow-hidden">
        {/* 订单头部 */}
        <View className="flex flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
          <Text className="text-xs text-gray-500">
            订单号: {order.order_sn}
          </Text>
          <Text className={`text-xs p-1 font-medium ${statusConfig.color}`}>
            {statusConfig.text}
          </Text>
        </View>

        {/* 商品列表 - 使用 GoodsItem 替换 renderGoodsItem */}
        <View className="px-4">
          {order.goods_list.map((item, idx) => (
            <View key={`${item.commodity_id}-${item.sku || idx}`}>
              <GoodsItem
                item={item}
                type="order"
                isLast={idx === order.goods_list.length - 1}
              />
              {/* 售后状态标签 */}
              {item.status && item.status > 0 && (
                <View className="flex justify-end mt-1 mb-2">
                  <Text className={`text-xs px-2 py-1 rounded ${item.status === 1 ? 'bg-orange-100 text-orange-600' :
                      item.status === 2 ? 'bg-blue-100 text-blue-600' :
                        item.status === 3 ? 'bg-green-100 text-green-600' :
                          item.status === 4 ? 'bg-red-100 text-red-600' : ''
                    }`}>
                    {item.status === 1 ? '申请售后中' :
                      item.status === 2 ? '同意退货' :
                        item.status === 3 ? '退货成功' :
                          item.status === 4 ? '拒绝退货' : ''}
                  </Text>
                </View>
              )}
            </View>
          ))}
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
        {/* 搜索头部区域 */}
        <TopBar title="搜索" showBack>
          <SearchBar
            placeholder="请输入关键词搜索"
            value={filter.keyword}
            onChange={(value) => {
              setFilter({ ...filter, keyword: value });
            }}
            onSearch={performSearch}
            onClear={() => {
              setFilter({ keyword: '' });
              performSearch();
            }}
            shape="round"
            clearable

            className="search-input-custom !bg-transparent !rounded-full !shadow-sm"
          />
        </TopBar>
        {/* Tab 切换 */}
        <View className="bg-white mb-2 sticky top-0 z-10 p-2">
          <Radio.Group
            value={currentTab}
            direction="horizontal"
            onChange={(selectedTab: any) => handleTabChange(selectedTab)}
          >
            {ORDER_TABS.map((tab: any) => (
              <Radio
                key={tab.value}
                value={tab}
                shape="button"
              >
                {tab.title}
              </Radio>
            ))}
          </Radio.Group>
        </View>

        {/* 订单列表 Skeleton */}
        <View className="h-screen !bg-gray-50 flex items-start justify-center">
          Loading...
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen ">
      {/* 搜索头部区域 */}
      <TopBar title="搜索" showBack>
        <SearchBar
          placeholder="请输入关键词搜索"
          value={filter.keyword}
          onChange={(value) => {
            setFilter({ ...filter, keyword: value });
          }}
          onSearch={performSearch}
          onClear={() => {
            setFilter({ keyword: '' });
            performSearch();
          }}
          shape="round"
          clearable

          className="search-input-custom !bg-transparent !rounded-full !shadow-sm"
        />

      </TopBar>
      {/* Tab 切换 */}
      <View className="bg-white mb-2 sticky top-0 z-10 p-2">
        <Radio.Group
          value={currentTab}
          direction="horizontal"
          onChange={(selectedTab: any) => handleTabChange(selectedTab)}
        >
          {ORDER_TABS.map((tab: any) => (
            <Radio
              key={tab.value}
              value={tab}
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
        className="h-screen !bg-gray-50"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleLoadMore}
        lowerThreshold={100}
      >
        <View className="px-4 pb-4">
          {!user.isLogin() ? (
            <>
              <View className="flex flex-col items-center justify-center py-20">
                <Text className="text-gray-500 text-sm mb-4">您当前未登录，请先登录</Text>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}
                >
                  去登录
                </Button>
              </View>
            </>
          ) : (error && orders.length === 0) ? (
            <View className="flex flex-col items-center justify-center py-20">
              <Text className="text-gray-500 text-sm mb-4">{error}</Text>
              <Button
                size="small"
                type="primary"
                onClick={() => fetchOrders(filter.keyword, currentTab?.value || null, query_type, 1)}
              >
                重新加载
              </Button>
            </View>
          ) : orders.length === 0 ? (
            <View className="py-20">
              <Empty description="暂无订单" className='!bg-gray-50' />
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