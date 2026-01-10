import React, { useCallback } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Checkbox, Stepper } from '@taroify/core';
import { More } from '@nutui/icons-react-taro';
import { GoodsItemProps } from '../types';
import { getImageUrl } from '../utils';

const CartItem: React.FC<GoodsItemProps> = ({
    item,
    selected = false,
    onSelect,
    onQuantityChange,
    onLongPress,
    onShowMore,
    updating = {},
    disabledQuantity = false,
}) => {
    const imageUrl = getImageUrl(item);

    const handleSelect = useCallback((checked: boolean) => {
        onSelect?.(item.id || '', checked);
    }, [item.id, onSelect]);

    const handleQuantityChange = (value: number) => {
        onQuantityChange?.(item, value);
    };

    const skuText = item.sku ? Object.entries(item.sku).map(([k, v]) => `${k}:${v}`).join('; ') : '';

    return (
        <View
            className="bg-white mb-3 p-3 rounded-2xl shadow-sm border border-gray-100/50 active:bg-gray-50 transition-all"
            onLongPress={() => onLongPress?.(item.id || '')}
        >
            <View className="flex flex-row">
                {/* 选择框 */}
                <View className="flex flex-col justify-center mr-2">
                    <Checkbox
                        checked={selected || item.is_selected === 1}
                        onChange={handleSelect}
                        className="--checkbox-checked-color: #3b82f6"
                    />
                </View>

                {/* 商品图片 */}
                <View className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image
                        src={imageUrl}
                        className="w-full h-full object-cover"
                        mode="aspectFill"
                        lazyLoad
                    />
                </View>

                {/* 商品信息 */}
                <View className="flex-1 ml-3 min-w-0 flex flex-col justify-between">
                    <View>
                        <View className="flex flex-row items-start justify-between">
                            <Text className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug flex-1">
                                {item.name || item.title || ''}
                            </Text>
                            {onShowMore && (
                                <View onClick={() => onShowMore?.(item.id || '')} className="p-1 -mr-1">
                                    <More size="16" color="#9ca3af" />
                                </View>
                            )}
                        </View>
                        {skuText && (
                            <View className="mt-1 bg-gray-50 rounded px-1.5 py-0.5 inline-block">
                                <Text className="text-xs text-gray-500 line-clamp-1">{skuText}</Text>
                            </View>
                        )}
                    </View>

                    <View className="flex flex-row justify-between items-center mt-2">
                        <View className="flex items-baseline text-sakura-500 font-bold">
                            <Text className="text-xs">¥</Text>
                            <Text className="text-lg ml-0.5 font-bold">{item.price}</Text>
                        </View>

                        <Stepper
                            value={item.quantity || 1}
                            min={1}
                            max={item.stock || 999}
                            onChange={handleQuantityChange}
                            disabled={disabledQuantity || updating[item.id || '']}
                            className="custom-stepper"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CartItem;
