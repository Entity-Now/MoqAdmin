import Taro from '@tarojs/taro';
import React, { useState, useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Tabs, Cell, Badge, Button } from '@nutui/nutui-react-taro';
import type { UserInfoResponse } from '../../api/user/types'; // 假设的用户信息类型
import './about.scss';

interface OrderTab {
  title: string;
  badge: number;
  path: string;
}

const ORDER_TABS: OrderTab[] = [
  { title: '待付款', badge: 2, path: '/pages/order/pending-pay' },
  { title: '已付款', badge: 1, path: '/pages/order/paid' },
  { title: '已收货', badge: 3, path: '/pages/order/received' },
  { title: '退款', badge: 0, path: '/pages/order/refund' },
];

function MyPage() {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('0');

  // 使用默认数据
  useEffect(() => {
    setUserInfo({ nickname: '未命名用户', avatar: '' });
    setLoading(false);
  }, []);

  // 刷新用户信息（模拟）
  const handleRefresh = () => {
    setUserInfo({ nickname: '未命名用户', avatar: '' });
    setError(false);
  };

  // 查看/更换头像
  const handleAvatarClick = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    }).then((res) => {
      if (res.tempFilePaths.length > 0) {
        // 上传逻辑（假设）
        Taro.showToast({ title: '头像更换成功', icon: 'success' });
        // 更新userInfo.avatar
      }
    });
  };

  // 编辑个人资料
  const handleEditProfile = () => {
    Taro.navigateTo({ url: '/pages/profile/edit' });
  };

  // Tab切换：跳转到订单页面
  const handleTabChange = (value: string) => {
    const tabIndex = parseInt(value);
    const tab = ORDER_TABS[tabIndex];
    Taro.navigateTo({ url: tab.path });
  };

  // 设置项跳转
  const handleContactSupport = () => {
    // 优先唤起系统电话，fallback到聊天页
    Taro.makePhoneCall({ phoneNumber: '400-123-4567' }).catch(() => {
      Taro.navigateTo({ url: '/pages/support/chat' });
    });
  };

  const handlePrivacyPolicy = () => {
    Taro.navigateTo({
      url: '/pages/policy/privacy?type=h5',
      // 或使用web-view组件加载H5
    });
  };

  const handleSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/index' });
  };

  if (loading) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center">
          <View className="text-4xl mb-2 animate-pulse">⏳</View>
          <Text className="text-gray-500">加载中...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 bg-white rounded-lg shadow-sm">
          <Text className="text-gray-500 mb-4">加载用户信息失败</Text>
          <Button type="primary" size="small" onClick={handleRefresh}>
            刷新重试
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部个人信息区 */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <View className="flex items-center space-x-4">
          {/* 头像 */}
          <View
            className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 cursor-pointer active:opacity-80 transition-opacity"
            onClick={handleAvatarClick}
          >
            {userInfo?.avatar ? (
              <Image src={userInfo.avatar} mode="cover" className="w-full h-full" />
            ) : (
              <View className="w-full h-full flex items-center justify-center bg-gray-300">
                <Text className="text-xs text-gray-500 absolute bottom-1 right-1">点击更换</Text>
              </View>
            )}
          </View>
          {/* 用户名 */}
          <View className="flex-1 min-w-0 cursor-pointer active:opacity-80 transition-opacity" onClick={handleEditProfile}>
            <Text className="text-lg font-semibold text-gray-900 truncate">{userInfo?.nickname || '未命名用户'}</Text>
            <Text className="text-sm text-gray-500">点击编辑资料</Text>
          </View>
        </View>
      </View>

      {/* 我的订单模块 */}
      <View className="bg-white mx-4 mt-4 rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className="border-b border-gray-200"
        >
          {ORDER_TABS.map((tab, index) => (
            <Tabs.TabPane key={index} title={
              <View className="flex items-center justify-center relative">
                <Text>{tab.title}</Text>
                {tab.badge > 0 && (
                  <Badge
                    value={tab.badge}
                    className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center"
                  />
                )}
              </View>
            }>
              {/* Tab内容：占位，实际跳转后显示列表 */}
              <View className="p-8 text-center text-gray-400">
                <View className="text-4xl mb-2">📦</View>
                <Text className="text-sm">暂无相关订单</Text>
              </View>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </View>

      {/* 设置类功能列表 */}
      <View className="mx-4 mt-4 space-y-0">
        <Cell
          title="联系客服"
          desc=""
          icon="message"
          className="bg-white rounded-lg shadow-sm border border-gray-200 mb-2 active:bg-gray-50 transition-colors"
          onClick={handleContactSupport}
          rightIcon="arrow-right"
        />
        <Cell
          title="隐私声明"
          desc=""
          icon="file-text"
          className="bg-white rounded-lg shadow-sm border border-gray-200 mb-2 active:bg-gray-50 transition-colors"
          onClick={handlePrivacyPolicy}
          rightIcon="arrow-right"
        />
        <Cell
          title="设置"
          desc=""
          icon="setting"
          className="bg-white rounded-lg shadow-sm border border-gray-200 active:bg-gray-50 transition-colors"
          onClick={handleSettings}
          rightIcon="arrow-right"
        />
      </View>
    </View>
  );
}

export default MyPage;