import { useState, useCallback, useEffect } from 'react'

import { View, Text } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro"
import useUserStore from '../../store/useUser'
import addressApi from '../../api/address';
import { addressUtil } from '../../utils/address';
import { Transit } from '@nutui/icons-react-taro';
import AddressSelect from './select';
import { AddressItem } from 'src/api/address/types';
import Taro from '@tarojs/taro';



const Address = ({ selected }) => {
    const userInfo = useUserStore();
    const [visible, setVisible] = useState<boolean>(false);
    const [formattedAddress, setFormattedAddress] = useState<string>('');
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [addressList, setAddressList] = useState<any>([]);

    const fetchAddressList = useCallback(() => {
        addressApi.lists().then(res => {
            setAddressList(res || []);
            if (res?.length > 0) {
                setSelectedAddress(res[0]);
                selected(res[0]);
            }
        });
    }, []);

    const handleSelectAddress = useCallback((item: AddressItem) => {
        setSelectedAddress(item);
        selected(item);
    }, []);

    useEffect(() => {
        fetchAddressList();
    }, []);

    useEffect(() => {
        if (selectedAddress) {
            setFormattedAddress(addressUtil.formatAddressToString(
                {
                    name: selectedAddress.name,
                    phone: selectedAddress.phone,
                    province: selectedAddress.province,
                    city: selectedAddress.city,
                    district: selectedAddress.district,
                    address: selectedAddress.address,
                    is_default: selectedAddress.is_default
                }
            ));
        }
    }, [selectedAddress]);

    if (!userInfo.isLogin()) {
        return (
            <View className="address flex flex-row bg-white mt-4 px-4 py-4 shadow-sm border border-gray-200">
                <View className="address-item flex flex-row">
                    <View className="address-item-content flex flex-col">
                        <View className="address-item-content-name">
                            <Text onClick={() => Taro.switchTab({ url: '/pages/login/index' })}>登录</Text>后填写地址</View>
                    </View>
                </View>
            </View>
        )
    }
    if (!selectedAddress && addressList.length <= 0) {
        return (
            <View className="address flex flex-row bg-white mt-4 px-4 py-4 shadow-sm border border-gray-200">
                <View className="address-item flex flex-row">
                    <View className="address-item-content flex flex-row items-center gap-2">
                        <Text>暂无地址</Text>
                        <Button fill="none"  onClick={() => setVisible(true)}>点击添加地址</Button>
                    </View>
                    <AddressSelect visible={visible} setVisible={setVisible} selected={handleSelectAddress} />
                </View>
            </View>
        )
    }
    return (
        <View className="relative address flex flex-row bg-white mt-4 px-4 py-4 shadow-sm border border-gray-200" >
            <Text className="text-xs font-medium text-gray-800" >{formattedAddress}</Text>
            <View onClick={() => setVisible(true)}
                className="absolute top-0 right-0 flex flex-row gap-2 items-center">
                <Text className="text-xs font-medium text-gray-500">{selectedAddress?.is_default ? '默认地址' : ''}</Text>
                <Transit />
            </View>
            <AddressSelect visible={visible} setVisible={setVisible} selected={handleSelectAddress} />
        </View>
    );
}

export default Address;