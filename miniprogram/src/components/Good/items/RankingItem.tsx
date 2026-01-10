import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import { GoodsItemProps } from '../types';
import { getImageUrl } from '../utils';

const RankingItem: React.FC<GoodsItemProps> = ({ item, index = 0, onClick }) => {
    const imageUrl = getImageUrl(item);
    const isTopThree = index < 3;

    const getRankStyle = () => {
        switch (index) {
            case 0: return 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-yellow-100';
            case 1: return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-gray-100';
            case 2: return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-orange-100';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    const getRankEmoji = () => {
        switch (index) {
            case 0: return '🥇';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return null;
        }
    };

    return (
        <View
            className="flex flex-row items-center py-4 border-b border-gray-50 last:border-b-0 active:bg-gray-50 transition-colors"
            onClick={() => onClick?.(item)}
        >
            <View className="w-10 flex-shrink-0 flex items-center justify-center mr-2">
                {isTopThree ? (
                    <View className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${getRankStyle()}`}>
                        <Text>{getRankEmoji() || index + 1}</Text>
                    </View>
                ) : (
                    <Text className="text-sm font-bold text-gray-300 italic">{index + 1}</Text>
                )}
            </View>

            <View className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 mr-3 bg-gray-50 border border-gray-100">
                <Image
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    mode="aspectFill"
                    lazyLoad
                />
            </View>

            <View className="flex-1 min-w-0 pr-2">
                <Text className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                    {item.name || item.title || ''}
                </Text>

                {item.tag && (
                    <View className="inline-block bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded text-xs font-medium mb-2">
                        <Text>{item.tag}</Text>
                    </View>
                )}

                <View className="flex flex-row justify-between items-end mt-1">
                    <View className="flex items-baseline text-sakura-500 font-bold">
                        <Text className="text-xs">¥</Text>
                        <Text className="text-base ml-0.5">{item.price}</Text>
                    </View>
                    {item.label && (
                        <Text className="text-xs text-gray-400 font-medium">{item.label}</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default RankingItem;
