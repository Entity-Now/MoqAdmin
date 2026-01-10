import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import { GoodsItemProps } from '../types';
import { getImageUrl } from '../utils';

const OrderItem: React.FC<GoodsItemProps> = ({ item, isLast = false, onClick }) => {
    const imageUrl = getImageUrl(item);
    const skuText = item.sku ? Object.entries(item.sku).map(([k, v]) => `${k}:${v}`).join(' ') : '';

    return (
        <View
            className={`flex flex-row py-4 active:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-50' : ''}`}
            onClick={() => onClick?.(item)}
        >
            <View className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                <Image
                    className="w-full h-full object-cover"
                    mode="aspectFill"
                    src={imageUrl}
                    lazyLoad
                />
            </View>

            <View className="flex-1 ml-3 min-w-0 flex flex-col justify-between">
                <View>
                    <Text className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
                        {item.name || item.title || ''}
                    </Text>
                    {skuText && (
                        <Text className="text-xs text-gray-400 block line-clamp-1">{skuText}</Text>
                    )}
                </View>

                <View className="flex flex-row justify-between items-end">
                    <View className="text-gray-900 font-bold">
                        <Text className="text-xs">¥</Text>
                        <Text className="text-base ml-0.5">{item.price}</Text>
                    </View>
                    <Text className="text-xs text-gray-400 font-medium">x{item.quantity || 1}</Text>
                </View>
            </View>
        </View>
    );
};

export default OrderItem;
