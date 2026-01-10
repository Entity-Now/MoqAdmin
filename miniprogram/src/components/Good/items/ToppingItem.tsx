import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import { GoodsItemProps } from '../types';
import { getImageUrl } from '../utils';

const ToppingItem: React.FC<GoodsItemProps> = ({ item, onClick }) => {
    const imageUrl = getImageUrl(item);

    return (
        <View
            className="relative flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100/50 transition-all duration-300 active:scale-[0.98]"
            onClick={() => onClick?.(item)}
        >
            {item.label === '置顶' && (
                <View className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10 flex items-center">
                    <Text>🔥 置顶</Text>
                </View>
            )}

            {/* 图片容器 - 16:9 比例提升设计感 */}
            <View className="relative w-full aspect-video bg-gray-50">
                <Image
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    mode="aspectFill"
                    lazyLoad
                />
                <View className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </View>

            <View className="p-3">
                <View className="mb-2">
                    <Text className="text-sm font-bold text-gray-800 line-clamp-1">
                        {item.name || item.title || ''}
                    </Text>
                </View>

                {item.tag && (
                    <View className="inline-flex bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium mb-3">
                        <Text>{item.tag}</Text>
                    </View>
                )}

                <View className="flex items-center justify-between mt-1">
                    <View className="flex items-baseline">
                        <Text className="text-xs font-bold text-sakura-500">¥</Text>
                        <Text className="text-lg font-bold text-sakura-500 ml-0.5">{item.price}</Text>
                    </View>
                    {item.label && item.label !== '置顶' && (
                        <View className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                            <Text>{item.label}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default ToppingItem;
