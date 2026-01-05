import { useState, useCallback, useEffect } from 'react'
import { View, Text } from "@tarojs/components";
import { Button } from "@taroify/core"
import useUserStore from '../../store/useUser'
import addressApi from '../../api/address';
import { addressUtil } from '../../utils/address';
import { Transit, Location } from '@nutui/icons-react-taro';
import AddressSelect from './select';
import { AddressItem } from 'src/api/address/types';
import Taro from '@tarojs/taro';

interface AddressProps {
    selected: (address: AddressItem) => void;
}

const Address = ({ selected }: AddressProps) => {
    const userInfo = useUserStore();
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formattedAddress, setFormattedAddress] = useState<string>('');
    const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(null);
    const [addressList, setAddressList] = useState<AddressItem[]>([]);

    const fetchAddressList = useCallback(() => {
        if (!userInfo.isLogin()) return;

        setLoading(true);
        setError('');
        addressApi.lists()
            .then(res => {
                setAddressList(res || []);
                if (res?.length > 0) {
                    const findDefault = res?.find(item => item.is_default);
                    const addressToSelect = findDefault || res[0];
                    setSelectedAddress(addressToSelect);
                    selected(addressToSelect);
                }
            })
            .catch(() => {
                setError('加载地址失败');
                Taro.showToast({ title: '加载地址失败', icon: 'none' });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selected, userInfo]);

    const handleSelectAddress = useCallback((item: AddressItem) => {
        setSelectedAddress(item);
        selected(item);
        if (addressList?.length <= 0) {
            setAddressList([item]);
        }
    }, [addressList, selected]);

    const handleLoginClick = useCallback(() => {
        Taro.navigateTo({ url: `/pages/login/index` });
    }, []);

    useEffect(() => {
        fetchAddressList();
    }, [fetchAddressList]);

    useEffect(() => {
        if (selectedAddress) {
            setFormattedAddress(addressUtil.formatAddressToString({
                name: selectedAddress.name || '',
                phone: selectedAddress.phone || '',
                province: selectedAddress.province || '',
                city: selectedAddress.city || '',
                district: selectedAddress.district || '',
                address: selectedAddress.address || '',
                is_default: selectedAddress.is_default
            }));
        }
    }, [selectedAddress]);

    // Non-intrusive login guidance
    if (!userInfo.isLogin()) {
        return (
            <View className="bg-gradient-to-r from-blue-50 to-indigo-50 mt-4 rounded-lg border border-blue-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <View className="px-4 py-4 flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-3 flex-1">
                        <View className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Location size={20} color="#3b82f6" />
                        </View>
                        <View className="flex flex-col gap-1">
                            <Text className="text-sm font-semibold text-gray-800">需要填写收货地址</Text>
                            <Text className="text-xs text-gray-600">登录后即可管理您的收货地址</Text>
                        </View>
                    </View>
                    <Button
                        color="primary"
                        size="small"
                        className="!rounded-full !px-4 !py-1 transition-transform duration-200 active:scale-95"
                        onClick={handleLoginClick}
                    >
                        去登录
                    </Button>
                </View>
            </View>
        );
    }

    // Loading state
    if (loading) {
        return (
            <View className="bg-white mt-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <View className="px-4 py-4 animate-pulse">
                    <View className="h-4 bg-gray-200 rounded w-3/4 mb-2"></View>
                    <View className="h-3 bg-gray-200 rounded w-1/2"></View>
                </View>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View className="bg-red-50 mt-4 rounded-lg border border-red-200 shadow-sm overflow-hidden">
                <View className="px-4 py-4 flex flex-row items-center justify-between">
                    <Text className="text-sm text-red-600">{error}</Text>
                    <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={fetchAddressList}
                    >
                        重试
                    </Button>
                </View>
            </View>
        );
    }

    // Empty state
    if (addressList.length <= 0) {
        return (
            <View className="bg-white mt-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <View className="px-4 py-4 flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-3">
                        <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Location size={20} color="#9ca3af" />
                        </View>
                        <Text className="text-sm text-gray-600">暂无收货地址</Text>
                    </View>
                    <Button
                        color="primary"
                        size="small"
                        className="!rounded-full !px-4 !py-1 transition-transform duration-200 active:scale-95"
                        onClick={() => setVisible(true)}
                    >
                        添加地址
                    </Button>
                </View>
                <AddressSelect visible={visible} setVisible={setVisible} selected={handleSelectAddress} />
            </View>
        );
    }

    // Address selected state
    return (
        <View className="relative bg-white mt-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-300">
            <View className="px-4 py-4 pr-20">
                <View className="flex flex-row items-start gap-2 mb-1">
                    <Location size={16} color="#3b82f6" className="mt-0.5 flex-shrink-0" />
                    <Text className="text-sm font-medium text-gray-800 leading-relaxed">
                        {formattedAddress}
                    </Text>
                </View>
            </View>
            <View
                onClick={() => setVisible(true)}
                className="absolute top-0 right-0 h-full px-4 flex flex-row gap-2 items-center cursor-pointer transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
            >
                {selectedAddress?.is_default && (
                    <View className="px-2 py-0.5 bg-green-100 rounded-full">
                        <Text className="text-xs font-medium text-green-700">默认</Text>
                    </View>
                )}
                <Transit size={18} color="#6b7280" />
            </View>
            <AddressSelect visible={visible} setVisible={setVisible} selected={handleSelectAddress} />
        </View>
    );
}

export default Address;