import Taro from '@tarojs/taro';
import { useDidShow, useLoad } from '@tarojs/taro'
import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, Button as TaroButton } from '@tarojs/components';
import { Cell, Button, Skeleton } from '@nutui/nutui-react-taro';
import { Right, ShareF } from '@nutui/icons-react-taro';
import useUserStore from '../../store/useUser';
import TopBar from '../../components/TopBar';
import { ORDER_TYPES } from '../../../types/PayStatus';
import './index.scss';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOrderKey, setActiveOrderKey] = useState<string | null>(null);

  // 从 store 中解构具体字段，避免整个 store 变化导致不必要的重渲染
  const { isLogin, userInfo, getUserInfo, logout } = useUserStore();

  // 页面加载时检查登录状态
  useLoad(() => {
    const loggedIn = isLogin();
    if (!loggedIn) {
      // 未登录，直接结束加载，显示游客界面
      setLoading(false);
      return;
    }
    // 如果已登录但用户信息为空，触发加载
    if (userInfo === null) {
      fetchUserInfo();
    } else {
      // 如果用户信息已存在，直接结束加载
      setLoading(false);
    }
  });

  useDidShow(() => {
    const loggedIn = isLogin();
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    if (userInfo === null) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  })

  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await getUserInfo();
    } catch (err: any) {
      // 处理认证错误
      if (err.code === 401 || err.code === 403) {
        setError(null); // 清除错误，显示游客界面
      } else {
        setError('获取用户信息失败');
        console.error('Fetch user info error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [getUserInfo]);

  // 导航处理 - 需要登录的页面
  const handleNavigate = useCallback((url: string) => {
    if (!isLogin()) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
      Taro.navigateTo({
        url: `/pages/login/index?redirect=${encodeURIComponent(url)}`
      });
      return;
    }
    Taro.navigateTo({ url });
  }, [isLogin]);

  // 订单点击处理(带视觉反馈)
  const handleOrderClick = useCallback((item: typeof ORDER_TYPES[number]) => {
    if (!isLogin()) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
      Taro.navigateTo({
        url: `/pages/login/index?redirect=${encodeURIComponent(item.path)}`
      });
      return;
    }
    setActiveOrderKey(item.key);
    setTimeout(() => {
      setActiveOrderKey(null);
      Taro.navigateTo({ url: item.path });
    }, 150);
  }, [isLogin]);

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
          setLoading(false);
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      },
    });
  }, [logout]);

  // 登录处理
  const handleLogin = useCallback(() => {
    Taro.navigateTo({
      url: `/pages/login/index?redirect=${encodeURIComponent('/pages/about/index')}`
    });
  }, []);

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

  const loggedIn = isLogin();

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <TopBar title="我的" icon={<View className='flex flex-row gap-3'>
        <ShareF size={18} color='white' />
      </View>} />

      {/* 用户信息卡片 */}
      <View className="bg-white px-4 pt-6 pb-4 mb-2">
        {loggedIn && userInfo ? (
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
              onClick={() => handleNavigate('/pages/personal/index')}
            >
              编辑资料
            </Button>
          </View>
        ) : (
          <View className="flex flex-row items-center">
            <View className="w-16 h-16 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
              <Text className="text-3xl text-gray-400">👤</Text>
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-lg font-medium text-gray-900 mb-1 block">
                您还未登录
              </Text>
              <Text className="text-sm text-gray-500 block">
                登录后享受更多功能
              </Text>
            </View>
            <Button
              size="small"
              type="primary"
              className="flex-shrink-0"
              onClick={handleLogin}
            >
              立即登录
            </Button>
          </View>
        )}
      </View>

      {/* 订单入口 - 所有用户可见，但点击需要登录 */}
      <View className="bg-white px-4 py-3 mb-2">
        <View className="flex flex-row justify-between items-center mb-3">
          <Text className="text-base font-medium text-gray-900">我的订单</Text>
          <View
            className="flex flex-row items-center"
            onClick={() => handleNavigate('/pages/order/index')}
          >
            <Text className="text-sm text-gray-500 mr-1">全部订单</Text>
            <Right className="text-gray-400" size="12" />
          </View>
        </View>

        <View className="flex flex-row -mx-2">
          {ORDER_TYPES.map((item) => (
            <View
              key={item.key}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors ${activeOrderKey === item.key ? 'bg-gray-100' : ''
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
          title="地址管理"
          className="text-gray-900"
          onClick={() => handleNavigate('/pages/personal/address')}
        />
        <Cell
          title="用户隐私收集清单"
          className="text-gray-900 border-b-0"
          onClick={() => Taro.navigateTo({ url: '/pages/personal/private' })}
        />
      </View>

      {/* 通用设置 - 所有用户可见 */}
      <View className="bg-white mb-2">
        <Cell
          title="关于我们"
          className="text-gray-900"
          onClick={() => Taro.navigateTo({ url: '/pages/about/info' })}
        />
        <Cell
          title="清除缓存"
          className="text-gray-900 border-b-0"
          onClick={() => {
            Taro.clearStorage({
              success: () => {
                Taro.showToast({
                  title: '清除成功',
                  icon: 'success'
                });
              }
            });
          }}
        />
      </View>

      {/* 退出登录 - 仅登录用户可见 */}
      {loggedIn && (
        <View className="bg-white">
          <Cell
            title="退出登录"
            className="text-red-500 text-center border-b-0"
            onClick={handleLogout}
          />
        </View>
      )}

      {/* 底部安全距离 */}
      <View className="h-8" />
    </View>
  );
}