import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import { GoodsItemProps } from '../types';
import { getImageUrl } from '../utils';

const RecommendItem: React.FC<GoodsItemProps> = ({ item, onClick }) => {
    const imageUrl = getImageUrl(item);

    return (
        <View
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/50 flex flex-col transition-all duration-300 active:scale-95"
            onClick={() => onClick?.(item)}
        >
            {/* 图片容器 - 16:9 比例，同步 UI 设计风格 */}
            <View className="relative w-full aspect-video bg-gray-50 overflow-hidden">
                <Image
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    mode="aspectFill"
                    lazyLoad
                />
                <View className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </View>

            <View className="p-2.5 flex-1 flex flex-col">
                <Text className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight mb-2">
                    {item.name || item.title || ''}
                </Text>

                <View className="mt-auto">
                    {item.tag && (
                        <View className="inline-flex bg-mint-50 text-mint-600 px-1.5 py-0.5 rounded text-xs font-medium mb-2">
                            <Text>{item.tag}</Text>
                        </View>
                    )}

                    <View className="flex items-center justify-between">
                        <View className="flex items-baseline text-sakura-500 font-bold">
                            <Text className="text-xs">¥</Text>
                            <Text className="text-base font-bold ml-0.5">{item.price}</Text>
                        </View>

                        {item.label && (
                            <View className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded text-xs font-bold shadow-sm">
                                <Text>{item.label}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default RecommendItem;
