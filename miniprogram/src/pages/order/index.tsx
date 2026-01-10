import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { Button, Loading, Search, Tabs } from '@taroify/core';
import orderApi from '../../api/order';
import type { OrderListVo } from '../../api/order/types';
import './index.scss';
import TopBar from '../../components/TopBar';
import useUser from '../../store/useUser';
import { GoodsItem } from '../../components/Good';
import { PayStatusStyleMap, PayStatusEnum, DeliveryStatusEnum, DeliveryStatusStyleMap, AfterSalesStatusEnum, AfterSalesStatusStyleMap, ORDER_TABS } from '../../../types/PayStatus'




export default function OrderList() {
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
  const [tabsValue, setTabsValue] = useState<any>(ORDER_TABS[0].value);

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
  const handleTabChange = useCallback((value: any) => {
    const selectedTab = ORDER_TABS.find(t => t.value === value) || ORDER_TABS[0];
    setTabsValue(value);
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

    // 获取发货状态（从第一个商品获取）
    const firstGood = order.goods_list?.[0];
    const deliveryStatus = firstGood?.delivery_status ?? DeliveryStatusEnum.WAITING;
    const deliveryStatusConfig = DeliveryStatusStyleMap[deliveryStatus];

    return (
      <View key={order.id} className="bg-white mb-4 rounded-3xl overflow-hidden shadow-sm border border-gray-50">
        {/* 订单头部 */}
        <View className="flex flex-row justify-between items-center px-4 py-3 border-b border-gray-50/50 bg-gray-50/30">
          <View className="flex flex-row items-center">
            <View className="w-1 h-3 bg-sakura-300 rounded-full mr-2" />
            <Text className="text-xs text-gray-400 font-medium">
              NO.{order.order_sn}
            </Text>
          </View>
          <View className="flex flex-row gap-2">
            <Text className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusConfig.color} bg-white border border-current opacity-80`}>
              {statusConfig.text}
            </Text>
            {isCompleted && (
              <Text className={`text-xs font-bold px-2 py-0.5 rounded-full ${deliveryStatusConfig.color}`}>
                {deliveryStatusConfig.text}
              </Text>
            )}
          </View>
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
              {item.status && item.status > 0 && (() => {
                const afterSalesConfig = AfterSalesStatusStyleMap[item.status as AfterSalesStatusEnum];
                return afterSalesConfig ? (
                  <View className="flex justify-end mt-1 mb-2">
                    <Text className={`text-xs px-2 py-1 rounded ${afterSalesConfig.color}`}>
                      {afterSalesConfig.text}
                    </Text>
                  </View>
                ) : '';
              })() || ''}
            </View>
          ))}
        </View>

        {/* 订单金额 */}
        <View className="px-4 py-3 border-t border-gray-50/50">
          <View className="flex flex-row justify-end items-center">
            <Text className="text-xs text-gray-400 mr-2">
              共{order.total_goods}件商品 / 实付
            </Text>
            <Text className="text-sm font-bold text-red-500">
              ¥{order.actual_pay_amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View className="flex flex-row justify-end items-center px-4 py-3 bg-gray-50/30 gap-3">
          {!isRefunded && (
            <Button
              size="small"
              className="!text-xs !px-4 !h-7 !rounded-full !bg-white !border-gray-100 !text-gray-500 active:bg-gray-50"
              onClick={() => handleOrderAction(order.id, 'detail')}
            >
              详情
            </Button>
          )}

          {isWaiting && (
            <>
              <Button
                size="small"
                className="!text-xs !px-4 !h-7 !rounded-full !bg-white !border-gray-100 !text-gray-500 active:bg-gray-50"
                onClick={() => handleOrderAction(order.id, 'delete')}
              >
                删除
              </Button>
              <Button
                size="small"
                className="!text-xs !px-4 !h-7 !rounded-full !bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !font-bold !border-none !shadow-sm active:scale-95 transition-transform"
                onClick={() => handleOrderAction(order.id, 'pay')}
              >
                立即支付
              </Button>
            </>
          )}

          {(isCompleted || isRefunded) && (
            <Button
              size="small"
              className="!text-xs !px-4 !h-7 !rounded-full !bg-white !border-gray-100 !text-gray-500 active:bg-gray-50"
              onClick={() => handleOrderAction(order.id, 'delete')}
            >
              删除
            </Button>
          )}
        </View>
      </View>
    );
  };

  // Loading 状态
  if (loading && page === 1) {
    return (
      <View className="min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white">
        <TopBar title="我的订单" showBack>
          <Search
            placeholder="搜索您的订单"
            value={filter.keyword}
            onChange={(e) => {
              setFilter({ ...filter, keyword: e.detail.value });
            }}
            onSearch={performSearch}
            onClear={() => {
              setFilter({ keyword: '' });
              performSearch();
            }}
            shape="round"
            className="search-input-custom !bg-white/50 !backdrop-blur-sm !rounded-full !px-3"
          />
        </TopBar>
        {/* Tab 切换 */}
        <View className="px-2 sticky top-0 z-10 bg-transparent">
          <Tabs
            className="!bg-transparent"
            value={tabsValue}
            onChange={handleTabChange}
          >
            {ORDER_TABS.map((tab: any) => (
              <Tabs.TabPane
                key={tab.value}
                title={tab.title}
                value={tab.value}
              />
            ))}
          </Tabs>
        </View>

        <View className="flex flex-col items-center justify-center pt-20">
          <Loading type="spinner" style={{ color: '#FF8FAF' }} />
          <Text className="text-xs text-gray-400 mt-4">正在加载订单...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white">
      {/* 搜索头部区域 */}
      <TopBar title="我的订单" showBack>
        <Search
          placeholder="搜索您的订单"
          value={filter.keyword}
          onChange={(e) => {
            setFilter({ ...filter, keyword: e.detail.value });
          }}
          onSearch={performSearch}
          onClear={() => {
            setFilter({ keyword: '' });
            performSearch();
          }}
          shape="round"
          className="search-input-custom !bg-white/50 !backdrop-blur-sm !rounded-full !px-3"
        />
      </TopBar>

      {/* Tab 切换 */}
      <View className="px-2 sticky top-0 z-10 bg-transparent">
        <Tabs
          className="!bg-transparent"
          value={tabsValue}
          onChange={handleTabChange}
        >
          {ORDER_TABS.map((tab: any) => (
            <Tabs.TabPane
              key={tab.value}
              title={tab.title}
              value={tab.value}
            />
          ))}
        </Tabs>
      </View>

      {/* 订单列表 */}
      <ScrollView
        scrollY
        className="h-screen bg-transparent"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleLoadMore}
        lowerThreshold={100}
      >
        <View className="px-4 pb-10">
          {!user.isLogin() ? (
            <View className="flex flex-col items-center justify-center pt-20 px-6">
              <View className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 w-full max-w-sm text-center">
                <View className="w-20 h-20 bg-sakura-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Text className="text-4xl">📄</Text>
                </View>
                <Text className="text-lg font-bold text-gray-900 mb-2 block">订单同步</Text>
                <Text className="text-sm text-gray-400 mb-8 block">登录后即可查看和同步您的历史订单</Text>
                <Button
                  block
                  className="!bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-lg !shadow-sakura-100 active:scale-95 transition-transform"
                  onClick={() => Taro.navigateTo({ url: '/pages/login/index?redirect=/pages/order/index' })}
                >
                  立即登录
                </Button>
              </View>
            </View>
          ) : (error && orders.length === 0) ? (
            <View className="flex flex-col items-center justify-center pt-20">
              <View className="w-48 h-48 bg-gray-100/50 rounded-full flex items-center justify-center mb-6">
                <Text className="text-5xl">⚠️</Text>
              </View>
              <Text className="text-sm text-gray-400 mb-8 px-10 text-center">{error}</Text>
              <Button
                className="!px-10 !h-10 !rounded-full !bg-white !border-gray-100 !text-gray-500 !font-bold shadow-sm"
                onClick={() => fetchOrders(filter.keyword, currentTab?.value || null, query_type, 1)}
              >
                重新加载
              </Button>
            </View>
          ) : orders.length === 0 ? (
            <View className="flex flex-col items-center justify-center pt-20">
              <View className="w-48 h-48 bg-gray-100/50 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-br from-cotton-candy/20 to-transparent" />
                <Text className="text-6xl z-10">📦</Text>
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-2">暂无订单数据</Text>
              <Text className="text-sm text-gray-400 mb-8">您还没有相关的订单记录哦</Text>
              <Button
                className="!px-10 !h-10 !rounded-full !bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !font-bold !border-none shadow-md active:scale-95"
                onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
              >
                去逛逛吧
              </Button>
            </View>
          ) : (
            <View className="pt-2">
              {orders.map(renderOrderCard)}

              {/* 加载更多提示 */}
              {loadingMore && (
                <View className="py-6 flex flex-row items-center justify-center">
                  <Loading size="16px" type="spinner" style={{ color: '#FF8FAF' }} />
                  <Text className="text-xs text-gray-300 ml-2">正在为您努力加载...</Text>
                </View>
              )}

              {!hasMore && orders.length > 0 && (
                <View className="py-8 text-center">
                  <Text className="text-xs text-gray-300 font-light tracking-widest uppercase">MOQISTAR · NO MORE ORDERS</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}