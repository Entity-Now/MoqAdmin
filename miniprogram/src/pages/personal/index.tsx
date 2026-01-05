// pages/personal/index.tsx
import { View, Image, Text } from '@tarojs/components';
import Taro, { useReady } from '@tarojs/taro';
import { useState } from 'react';
import { Cell, Button } from '@taroify/core';
import userApi from '../../api/user';
import type { UserCenterResponse } from '../../api/user/types';
import { showToast } from '@tarojs/taro';
import TopBar from '../../components/TopBar/index';
import useUser from '../../store/useUser';
import './index.scss';

const Personal = () => {
    const user = useUser();
    const [userInfo, setUserInfo] = useState<UserCenterResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchUserCenter = async () => {
        try {
            setLoading(true);
            // Check if user is logged in
            if (!user.isLogin()) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            setIsLoggedIn(true);
            const res = await userApi.center();
            setUserInfo(res);
        } catch (err: any) {
            // If error is auth-related, treat as guest
            if (err.code === 401 || err.code === 403) {
                setIsLoggedIn(false);
            } else {
                showToast({
                    title: err.message || '获取个人信息失败',
                    icon: 'error',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useReady(() => {
        fetchUserCenter();
    });


    const handleNavigate = (path: string) => {
        // Check login for protected routes
        if (!isLoggedIn) {
            showToast({ title: '请先登录', icon: 'none' });
            Taro.navigateTo({ url: '/pages/login/index' });
            return;
        }
        Taro.navigateTo({ url: path });
    };

    const handleLogin = () => {
        Taro.navigateTo({ url: '/pages/login/index' });
    };

    const formatTime = (time: string) => {
        return time ? new Date(time).toLocaleString('zh-CN', { hour12: false }) : '-';
    };

    if (loading) {
        return (
            <View className="flex items-center justify-center min-h-screen bg-gray-50">
                <Text className="text-gray-500">加载中...</Text>
            </View>
        );
    }

    return (
        <View className="personal-page min-h-screen bg-gray-50">
            <TopBar title="个人中心" showBack />

            {/* 个人信息卡片 - 未登录显示登录按钮 */}
            <View className="bg-white shadow-sm">
                {isLoggedIn && userInfo ? (
                    <View className="flex items-center p-6 space-x-4">
                        <Image className="w-16 h-16 rounded-full mr-3 border border-gray-200" src={userInfo.avatar} mode="aspectFill">
                        </Image>
                        <View className="flex-1 min-w-0">
                            <Text className="text-lg font-medium text-gray-900 mb-1 block truncate">
                                {userInfo.nickname || '用户'}
                            </Text>
                            <Text className="text-sm text-gray-500 block">
                                ID: {userInfo.account || '-'}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View className="flex flex-col items-center justify-center p-8">
                        <View className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            <Text className="text-4xl text-gray-400">👤</Text>
                        </View>
                        <Text className="text-base text-gray-600 mb-4">您还未登录</Text>
                        <Button
                            color="primary"
                            size="medium"
                            onClick={handleLogin}
                            className="rounded-full px-8"
                        >
                            立即登录
                        </Button>
                    </View>
                )}
            </View>

            {/* 资产信息 - 仅登录用户可见 */}
            {isLoggedIn && userInfo && (
                <Cell.Group title="我的资产" className="mt-4">
                    <Cell
                        title="余额"
                        onClick={() => handleNavigate('/pages/balance/index')}
                    >
                        {userInfo.balance} 元
                    </Cell>
                    <Cell
                        title="收藏"
                        onClick={() => handleNavigate('/pages/collect/index')}
                    >
                        {userInfo.collect} 件
                    </Cell>
                </Cell.Group>
            )}

            {/* 账号绑定 - 仅登录用户可见 */}
            {isLoggedIn && userInfo && (
                <Cell.Group title="账号绑定" className="mt-4">
                    <Cell
                        title="手机号"
                        onClick={() =>
                            userInfo.mobile
                                ? null
                                : handleNavigate('/pages/bind-mobile/index?scene=bind')
                        }
                    >
                        {userInfo.mobile || '未绑定'}
                    </Cell>
                    <Cell
                        title="邮箱"
                        onClick={() =>
                            userInfo.email
                                ? null
                                : handleNavigate('/pages/bind-email/index?scene=bind')
                        }
                    >
                        {userInfo.email || '未绑定'}
                    </Cell>
                    <Cell
                        title="微信"
                        onClick={() =>
                            userInfo.is_wechat
                                ? null
                                : handleNavigate('/pages/bind-wechat/index')
                        }
                    >
                        {userInfo.is_wechat ? '已绑定' : '未绑定'}
                    </Cell>
                </Cell.Group>
            )}

            {/* 安全设置 - 仅登录用户可见 */}
            {isLoggedIn && userInfo && (
                <Cell.Group title="安全设置" className="mt-4">
                    <Cell
                        title="登录密码"
                        onClick={() =>
                            userInfo.is_password
                                ? handleNavigate('/pages/change-pwd/index')
                                : handleNavigate('/pages/set-pwd/index')
                        }
                    >
                        {userInfo.is_password ? '已设置' : '未设置'}
                    </Cell>
                </Cell.Group>
            )}

            {/* 通用设置 - 所有用户可见 */}
            <Cell.Group title="通用设置" className="mt-4">
                <Cell
                    title="关于我们"
                    onClick={() => Taro.navigateTo({ url: '/pages/about/index' })}
                />
                <Cell
                    title="隐私政策"
                    onClick={() => Taro.navigateTo({ url: '/pages/personal/private' })}
                />
                <Cell
                    title="清除缓存"
                    onClick={() => {
                        Taro.clearStorage({
                            success: () => {
                                showToast({ title: '清除成功', icon: 'success' });
                            }
                        });
                    }}
                />
            </Cell.Group>

            {/* 其他信息 - 仅登录用户可见 */}
            {isLoggedIn && userInfo && (
                <Cell.Group title="其他信息" className="mt-4 mb-8">
                    <Cell title="注册时间">{formatTime(userInfo.create_time)}</Cell>
                    <Cell title="最近登录">{formatTime(userInfo.last_login_time)}</Cell>
                    <Cell title="性别">{userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '保密'}</Cell>
                </Cell.Group>
            )}

            {/* 登出按钮 - 仅登录用户可见 */}
            {isLoggedIn && (
                <View className="px-4 pb-8 mt-4">
                    <Button
                        color="default"
                        size="large"
                        block
                        onClick={() => {
                            Taro.showModal({
                                title: '提示',
                                content: '确定要退出登录吗？',
                                success: (res) => {
                                    if (res.confirm) {
                                        user.logout();
                                        showToast({ title: '已退出登录', icon: 'success' });
                                        fetchUserCenter();
                                    }
                                }
                            });
                        }}
                        className="rounded-full"
                    >
                        退出登录
                    </Button>
                </View>
            )}
        </View>
    );
};

export default Personal;