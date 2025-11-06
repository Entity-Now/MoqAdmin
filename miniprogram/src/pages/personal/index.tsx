// pages/personal/index.tsx
import { View, Image, Text } from '@tarojs/components';
import Taro, { useReady, useRouter } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { Cell, CellGroup, Avatar, Button, Toast } from '@nutui/nutui-react-taro';
import userApi from '../../api/user';
import type { UserCenterResponse } from '../../api/user/types';
import { showToast } from '@tarojs/taro';
import TopBar from '../../components/TopBar/index';
import './index.scss';

const Personal = () => {
    const [userInfo, setUserInfo] = useState<UserCenterResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserCenter = async () => {
        try {
            setLoading(true);
            const res = await userApi.center();
            setUserInfo(res);
        } catch (err: any) {
            showToast({
                title: err.message || '获取个人信息失败',
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useReady(() => {
        fetchUserCenter();
    });

    const handleEdit = async (field: string, value: string | number) => {
        try {
            await userApi.edit({ field: field as string, value });
            showToast({ title: '修改成功', icon: 'success' });
            fetchUserCenter();
        } catch (err: any) {
            showToast({ title: err.message || '修改失败', icon: 'error' });
        }
    };

    const handleNavigate = (path: string) => {
        Taro.navigateTo({ url: path });
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

    if (!userInfo) {
        return (
            <View className="flex items-center justify-center min-h-screen bg-gray-50">
                <Text className="text-gray-500">暂无用户信息</Text>
            </View>
        );
    }

    return (
        <View className="personal-page min-h-screen bg-gray-50">
            <TopBar title="个人信息" showBack />
            {/* 个人信息卡片 */}
            <View className="bg-white shadow-sm">
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
            </View>

            {/* 资产信息 */}
            <CellGroup title="我的资产" className="mt-4">
                <Cell
                    title="余额"
                    extra={`${userInfo.balance} 元`}
                    onClick={() => handleNavigate('/pages/balance/index')}
                />
                <Cell
                    title="收藏"
                    extra={`${userInfo.collect} 件`}
                    onClick={() => handleNavigate('/pages/collect/index')}
                />
            </CellGroup>

            {/* 账号绑定 */}
            <CellGroup title="账号绑定" className="mt-4">
                <Cell
                    title="手机号"
                    extra={userInfo.mobile || '未绑定'}
                    onClick={() =>
                        userInfo.mobile
                            ? null
                            : handleNavigate('/pages/bind-mobile/index?scene=bind')
                    }
                />
                <Cell
                    title="邮箱"
                    extra={userInfo.email || '未绑定'}
                    onClick={() =>
                        userInfo.email
                            ? null
                            : handleNavigate('/pages/bind-email/index?scene=bind')
                    }
                />
                <Cell
                    title="微信"
                    extra={userInfo.is_wechat ? '已绑定' : '未绑定'}
                    onClick={() =>
                        userInfo.is_wechat
                            ? null
                            : handleNavigate('/pages/bind-wechat/index')
                    }
                />
            </CellGroup>

            {/* 安全设置 */}
            <CellGroup title="安全设置" className="mt-4">
                <Cell
                    title="登录密码"
                    extra={userInfo.is_password ? '已设置' : '未设置'}
                    onClick={() =>
                        userInfo.is_password
                            ? handleNavigate('/pages/change-pwd/index')
                            : handleNavigate('/pages/set-pwd/index')
                    }
                />
            </CellGroup>

            {/* 其他信息 */}
            <CellGroup title="其他信息" className="mt-4 mb-8">
                <Cell title="注册时间" extra={formatTime(userInfo.create_time)} />
                <Cell title="最近登录" extra={formatTime(userInfo.last_login_time)} />
                <Cell title="性别" extra={userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '保密'} />
            </CellGroup>
        </View>
    );
};

export default Personal;