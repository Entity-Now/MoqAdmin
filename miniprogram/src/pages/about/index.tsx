import Taro from '@tarojs/taro';
import { useDidShow, useLoad } from '@tarojs/taro'
import { useState, useCallback } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Cell, Button, Skeleton } from '@taroify/core';
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
          <Skeleton row={3} animate />
        </View>
        <View className="bg-white rounded-lg p-4 mb-4">
          <Skeleton row={2} animate />
        </View>
        <View className="bg-white rounded-lg">
          <Skeleton row={4} animate />
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
          color="primary"
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
    <View className="min-h-screen bg-gradient-to-b from-cotton-candy/10 via-gray-50 to-white">
      {/* 顶部导航栏 */}
      <TopBar
        title="我的"
        icon={
          <View className='flex flex-row gap-3'>
            <ShareF size={18} color='white' />
          </View>
        }
      />

      {/* 内容区域 */}
      <View className="px-4 pt-4 pb-8">

        {/* 用户信息卡片 - 增强版 */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-gray-50">
          {loggedIn && userInfo ? (
            <View className="flex flex-row items-center">
              <View className="relative">
                <Image
                  className="w-16 h-16 rounded-full border-2 border-sakura-100 shadow-sm"
                  src={userInfo.avatar || '/assets/default-avatar.png'}
                  mode="aspectFill"
                />
                <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </View>
              <View className="flex-1 ml-4 min-w-0">
                <Text className="text-xl font-bold text-gray-900 mb-1 block truncate">
                  {userInfo.nickname || '优选用户'}
                </Text>
                <View className="flex flex-row items-center">
                  <Text className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mr-2">
                    ID: {userInfo.account || '-'}
                  </Text>
                  <Text className="text-xs text-sakura-500 font-medium">正式会员</Text>
                </View>
              </View>
              <Button
                size="small"
                variant="outlined"
                className="!text-xs !px-3 !h-7 !rounded-full !border-gray-200 !text-gray-500 active:bg-gray-50"
                onClick={() => handleNavigate('/pages/personal/index')}
              >
                资料设置
              </Button>
            </View>
          ) : (
            <View className="flex flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-sakura-50 flex items-center justify-center border-2 border-white shadow-sm">
                <Text className="text-3xl">👋</Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-xl font-bold text-gray-900 mb-1 block">
                  欢迎回来！
                </Text>
                <Text className="text-xs text-gray-400">请先登录，享受会员专区权益</Text>
              </View>
              <Button
                size="small"
                className="!bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !font-bold !rounded-full !px-5 !h-8 !border-none !shadow-md !shadow-sakura-100"
                onClick={handleLogin}
              >
                立即登录
              </Button>
            </View>
          )}
        </View>

        {/* 订单入口 - 卡片化 */}
        <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-50">
          <View className="flex flex-row justify-between items-center mb-5">
            <View className="flex flex-row items-center">
              <View className="w-1 h-4 bg-sakura-400 rounded-full mr-2" />
              <Text className="text-base font-bold text-gray-800">交易订单</Text>
            </View>
            <View
              className="flex flex-row items-center active:opacity-60 transition-opacity"
              onClick={() => handleNavigate('/pages/order/index')}
            >
              <Text className="text-xs text-gray-400 mr-0.5">查看全部</Text>
              <Right size="10" className="text-gray-300" />
            </View>
          </View>

          <View className="flex flex-row justify-between">
            {ORDER_TYPES.map((item) => (
              <View
                key={item.key}
                className={`flex flex-col items-center flex-1 active:scale-95 transition-all ${activeOrderKey === item.key ? 'opacity-60' : ''}`}
                onClick={() => handleOrderClick(item)}
              >
                <View className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-2 relative">
                  <item.icon size={22} className="text-gray-700" />
                  {/* 可选：添加角标计数 */}
                </View>
                <Text className="text-xs font-medium text-gray-500">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 功能列表 - 组合卡片 */}
        <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 mb-4">
          <Cell
            title="常用工具"
            className="!px-5 !py-4 !bg-gray-50/30 !font-bold !text-gray-800"
            bordered={false}
          />
          <View className="px-2">
            <Cell
              title="地址管理"
              icon={<Text className="mr-2">📍</Text>}
              className="!px-3 !py-4 active:bg-gray-50"
              onClick={() => handleNavigate('/pages/personal/address')}
            />
            <Cell
              title="清除缓存"
              icon={<Text className="mr-2">🧹</Text>}
              className="!px-3 !py-4 active:bg-gray-50"
              onClick={() => {
                Taro.clearStorage({
                  success: () => {
                    Taro.showToast({ title: '已恢复到初始状态', icon: 'success' });
                  }
                });
              }}
            />
            <Cell
              title="隐私清单"
              icon={<Text className="mr-2">🛡️</Text>}
              className="!px-3 !py-4 !border-b-0 active:bg-gray-50"
              onClick={() => Taro.navigateTo({ url: '/pages/personal/private' })}
            />
          </View>
        </View>

        {/* 退出按钮 */}
        {loggedIn && (
          <View className="px-4">
            <Button
              block
              variant="outlined"
              className="!border-red-50 !text-red-400 !bg-white !rounded-2xl !py-6 !font-medium !text-sm active:!bg-red-50/30 active:!border-red-100 transition-all"
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </View>
        )}

        {/* 测试按钮 */}
        {process.env.NODE_ENV === 'development' && (
          <View className="px-4">
            <Button
              block
              variant="outlined"
              className="!border-red-50 !text-red-400 !bg-white !rounded-2xl !py-6 !font-medium !text-sm active:!bg-red-50/30 active:!border-red-100 transition-all"
              onClick={() => Taro.navigateTo({ url: '/pages/login/index?sense=login%3Aea66b117564096deee0cd94016535ae1cslBP9' })}
            >
              测试扫码登录逻辑
            </Button>
          </View>
        )}

        {/* 底部文案 */}
        <View className="mt-8 mb-4 text-center">
          <Text className="text-xs text-gray-300 font-light tracking-widest">MOQISTAR · PREMIUM SELECTION</Text>
        </View>
      </View>

      {/* 底部安全距离 */}
      <View className="h-6" />
    </View>
  );
}