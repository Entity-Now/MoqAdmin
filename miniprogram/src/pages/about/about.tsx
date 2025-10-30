import Taro from '@tarojs/taro';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Cell, Button, Skeleton } from '@nutui/nutui-react-taro';
import { Wallet, Transit, NoReceive, ToPay, Right } from '@nutui/icons-react-taro';
import useUserStore from '../../store/useUser';
import './about.scss';

// 订单类型配置
const ORDER_TYPES = [
  {
    key: 'toPay',
    icon: ToPay,
    label: '待付款',
    path: '/pages/order/toPay',
  },
  {
    key: 'paid',
    icon: Wallet,
    label: '已付款',
    path: '/pages/order/paid',
  },
  {
    key: 'shipping',
    icon: Transit,
    label: '已发货',
    path: '/pages/order/shipping',
  },
  {
    key: 'refund',
    icon: NoReceive,
    label: '退款/售后',
    path: '/pages/order/refund',
  },
] as const;

export default function About() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOrderKey, setActiveOrderKey] = useState<string | null>(null);
  
  // 从 store 中解构具体字段，避免整个 store 变化导致不必要的重渲染
  const { isLogin, userInfo, getUserInfo, logout } = useUserStore();

  // 登录检查：依赖 isLogin，当 store 变化时重新检查
  useEffect(() => {
    if (!isLogin) {
      Taro.navigateTo({
        url: `/pages/login/login?redirect=${encodeURIComponent('/pages/about/about')}`,
      });
      return;
    }
    // 如果已登录但用户信息为空，触发加载
    if (userInfo === null) {
      fetchUserInfo();
    } else {
      // 如果用户信息已存在，直接结束加载
      setLoading(false);
    }
  }, [isLogin, userInfo]);

  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    // 移除 !isLogin 检查，因为上层已守卫
    setLoading(true);
    setError(null);
    try {
      await getUserInfo();
    } catch (err) {
      setError('获取用户信息失败');
      console.error('Fetch user info error:', err);
    } finally {
      setLoading(false);
    }
  }, [getUserInfo]);

  // 导航处理
  const handleNavigate = useCallback((url: string) => {
    Taro.navigateTo({ url });
  }, []);

  // 订单点击处理(带视觉反馈)
  const handleOrderClick = useCallback((item: typeof ORDER_TYPES[number]) => {
    setActiveOrderKey(item.key);
    setTimeout(() => {
      setActiveOrderKey(null);
      handleNavigate(item.path);
    }, 150);
  }, [handleNavigate]);

  // 退出登录确认
  const handleLogout = useCallback(() => {
    Taro.showModal({
      title: '退出登录',
      content: '确认退出当前账号?',
      confirmText: '退出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          logout();
          Taro.reLaunch({ url: '/pages/index/index' });
        }
      },
    });
  }, [logout]);

  // Loading 状态
  if (loading) {
    return (
      <View className="min-h-screen bg-gray-50 p-4">
        <View className="bg-white rounded-lg p-4 mb-4">
          <Skeleton rows={3} animated />
        </View>
        <View className="bg-white rounded-lg p-4 mb-4">
          <Skeleton rows={2} animated />
        </View>
        <View className="bg-white rounded-lg">
          <Skeleton rows={4} animated />
        </View>
      </View>
    );
  }

  // Error 状态
  if (error) {
    return (
      <View className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Text className="text-gray-500 text-base mb-4">{error}</Text>
        <Button
          type="primary"
          size="small"
          onClick={fetchUserInfo}
        >
          重新加载
        </Button>
      </View>
    );
  }

  // 如果用户信息为空（异常情况），显示空状态或重定向，但避免返回 null 导致白屏
  if (!userInfo) {
    return (
      <View className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Text className="text-gray-500 text-base mb-4">用户信息加载中...</Text>
        <Button
          type="primary"
          size="small"
          onClick={fetchUserInfo}
        >
          刷新
        </Button>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 用户信息卡片 */}
      <View className="bg-white px-4 pt-6 pb-4 mb-2">
        <View className="flex flex-row items-center">
          <Image
            className="w-16 h-16 rounded-full mr-3 border border-gray-200"
            src={userInfo.avatar || '/assets/default-avatar.png'}
            mode="aspectFill"
          />
          <View className="flex-1 min-w-0">
            <Text className="text-lg font-medium text-gray-900 mb-1 block truncate">
              {userInfo.nickname || '用户'}
            </Text>
            <Text className="text-sm text-gray-500 block">
              ID: {userInfo.account || '-'}
            </Text>
          </View>
          <Button
            size="small"
            fill="outline"
            className="flex-shrink-0"
            onClick={() => handleNavigate('/pages/profile/edit')}
          >
            编辑资料
          </Button>
        </View>
      </View>

      {/* 订单入口 */}
      <View className="bg-white px-4 py-3 mb-2">
        <View className="flex flex-row justify-between items-center mb-3">
          <Text className="text-base font-medium text-gray-900">我的订单</Text>
          <View 
            className="flex flex-row items-center"
            onClick={() => handleNavigate('/pages/order/order')}
          >
            <Text className="text-sm text-gray-500 mr-1">全部订单</Text>
            <Right className="text-gray-400" size="12" />
          </View>
        </View>
        
        <View className="flex flex-row -mx-2">
          {ORDER_TYPES.map((item) => (
            <View
              key={item.key}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${
                activeOrderKey === item.key ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleOrderClick(item)}
            >
              <item.icon className="text-2xl text-gray-700 mb-2" />
              <Text className="text-xs text-gray-600 text-center">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 功能列表 */}
      <View className="bg-white mb-2">
        <Cell
          title="账号与安全"
          className="text-gray-900"
          onClick={() => handleNavigate('/pages/profile/security')}
        />
        <Cell
          title="地址管理"
          className="text-gray-900"
          onClick={() => handleNavigate('/pages/profile/address')}
        />
        <Cell
          title="联系客服"
          className="text-gray-900"
          onClick={() => handleNavigate('/pages/support/contact')}
        />
        <Cell
          title="关于我们"
          className="text-gray-900 border-b-0"
          onClick={() => handleNavigate('/pages/about/info')}
        />
      </View>

      {/* 退出登录 */}
      <View className="bg-white">
        <Cell
          title="退出登录"
          className="text-red-500 text-center border-b-0"
          onClick={handleLogout}
        />
      </View>

      {/* 底部安全距离 */}
      <View className="h-8" />
    </View>
  );
}