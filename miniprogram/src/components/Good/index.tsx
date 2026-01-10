import React from 'react';
import { View, Text } from '@tarojs/components';
import { GoodsItemProps, GoodsListProps } from './types';

// Importing sub-components
import ToppingItem from './items/ToppingItem';
import RankingItem from './items/RankingItem';
import CartItem from './items/CartItem';
import OrderItem from './items/OrderItem';
import RecommendItem from './items/RecommendItem';

export * from './types';

/**
 * 单个商品项通用组件 (分发器)
 */
export const GoodsItem: React.FC<GoodsItemProps> = (props) => {
  const { type = 'recommend' } = props;

  switch (type) {
    case 'topping':
      return <ToppingItem {...props} />;
    case 'ranking':
      return <RankingItem {...props} />;
    case 'cart':
      return <CartItem {...props} />;
    case 'order':
      return <OrderItem {...props} />;
    case 'recommend':
      return <RecommendItem {...props} />;
    default:
      return null;
  }
};

/**
 * 商品列表组件
 */
export const GoodsList: React.FC<GoodsListProps> = ({
  type,
  data,
  onItemClick,
  onItemSelect,
  onQuantityChange,
  onLongPress,
  onShowMore,
  updating = {},
  disabledQuantity = false,
  title = '',
  subtitle = '',
  titleIcon = '',
  bgClass = 'bg-white',
  headerClass = 'px-4 pt-4 pb-2',
  listClass = '',
}) => {
  if (!data || data.length === 0) return null;

  const isRecommend = type === 'recommend';

  return (
    <View className={`${bgClass} rounded-2xl shadow-sm border border-gray-100/50 mb-4 overflow-hidden`}>
      {/* Section Header */}
      {(title || subtitle) && (
        <View className={headerClass}>
          <View className="flex flex-row items-center mb-1">
            {titleIcon && (
              <View className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-2 shadow-inner">
                <Text className="text-base">{titleIcon}</Text>
              </View>
            )}
            <View>
              <Text className="text-base font-bold text-gray-900 leading-none">
                {title}
              </Text>
              {subtitle && (
                <View className="mt-1">
                  <Text className="text-[11px] text-gray-400 font-medium">{subtitle}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* List Container */}
      <View
        className={
          isRecommend
            ? 'columns-2 gap-3 px-3 pb-2' // Waterfall layout for recommend
            : listClass || (type === 'topping' ? 'flex flex-row overflow-x-auto px-4 gap-3 py-2 scrollbar-none' : 'px-4 pb-2')
        }
      >
        {data.map((item, index) => (
          <View
            key={`${item.id}-${index}`}
            className={isRecommend ? 'break-inside-avoid mb-3' : ''}
          >
            <GoodsItem
              item={item}
              type={type}
              index={index}
              isLast={index === data.length - 1}
              selected={item.is_selected === 1}
              onClick={onItemClick}
              onSelect={onItemSelect}
              onQuantityChange={onQuantityChange}
              onLongPress={onLongPress}
              onShowMore={onShowMore}
              updating={updating}
              disabledQuantity={disabledQuantity}
            />
          </View>
        ))}
      </View>
    </View>
  );
};