import React, { useCallback } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Checkbox, InputNumber, Price } from '@nutui/nutui-react-taro';
import { More } from '@nutui/icons-react-taro';

// 商品数据通用接口（基于提供的片段推断）
interface GoodsItemData {
  id?: string | number;
  name?: string;
  title?: string;
  imgUrl?: string;
  main_image?: string;
  image?: string[] | string;
  price: number;
  tag?: string;
  label?: string;
  sku?: Record<string, any> | null;
  quantity?: number;
  stock?: number;
  is_selected?: number;
  commodity_id?: number;
}

// 组件 Props 接口
interface GoodsItemProps {
  item: GoodsItemData;
  type: 'topping' | 'ranking' | 'cart' | 'order' | 'recommend';
  index?: number;
  isLast?: boolean;
  selected?: boolean;
  onClick?: (item: GoodsItemData) => void;
  onSelect?: (id: string | number, checked: boolean) => void;
  onQuantityChange?: (item: GoodsItemData, quantity: number) => void;
  onLongPress?: (id: string | number) => void;
  onShowMore?: (id: string | number) => void;
  updating?: Record<string | number, boolean>;
  disabledQuantity?: boolean;
}

// 单个商品项通用组件
export const GoodsItem: React.FC<GoodsItemProps> = ({
  item,
  type,
  index,
  isLast = false,
  selected = false,
  onClick,
  onSelect,
  onQuantityChange,
  onLongPress,
  onShowMore,
  updating = {},
  disabledQuantity = false,
}) => {
  const handleClick = useCallback(() => {
    onClick?.(item);
  }, [item, onClick]);

  const handleSelect = useCallback((checked: boolean) => {
    onSelect?.(item.id || '', checked);
  }, [item.id, onSelect]);

  const handleQuantityChange = useCallback((value: number) => {
    onQuantityChange?.(item, value);
  }, [item, onQuantityChange]);

  const handleLongPress = useCallback(() => {
    onLongPress?.(item.id || '');
  }, [item.id, onLongPress]);

  const handleShowMore = useCallback(() => {
    onShowMore?.(item.id || '');
  }, [item.id, onShowMore]);

  const getImageUrl = () => {
    return item.imgUrl || item.main_image || item.image;
  };

  // 通用商品标题
  const renderTitle = () => {
    const title = item.name || item.title || '';
    return (
      <Text className={`font-semibold line-clamp-2 ${type === 'topping'
        ? 'text-sm text-gray-800 mb-2'
        : 'text-sm text-gray-800 mb-1.5 leading-tight'
        }`}>
        {title}
      </Text>
    );
  };

  // 通用标签
  const renderTag = () => {
    if (!item.tag) return null;
    const tagClass = type === 'topping'
      ? 'bg-mint-100 text-mint-600 px-2 py-1 rounded-tag text-tag font-medium mb-2'
      : type === 'ranking'
        ? 'bg-lemon-100 text-lemon-600 px-2 py-0.5 rounded-tag text-tag-sm font-medium mb-1.5'
        : null;
    if (!tagClass) return null;
    return (
      <View className={`inline-block ${tagClass}`}>
        <Text>{item.tag}</Text>
      </View>
    );
  };

  // 通用规格
  const renderSku = () => {
    if (!item.sku || Object.keys(item.sku).length === 0) return null;
    const skuText = Object.entries(item.sku).map(([k, v]) => `${k}:${v}`).join(' ');
    const skuClass = type === 'cart' || type === 'order'
      ? 'text-xs text-gray-500 mb-2 block line-clamp-1'
      : null;
    if (!skuClass) return null;
    return (
      <Text className={skuClass}>
        {skuText}
      </Text>
    );
  };

  // 通用价格和数量/标签底部
  const renderBottom = () => {
    const priceClass = 'text-sakura-500 font-bold';
    const bottomClass = type === 'topping'
      ? 'flex items-center justify-between'
      : type === 'ranking' || type === 'cart' || type === 'order'
        ? 'flex flex-row justify-between items-end mt-2'
        : null;
    if (!bottomClass) return null;

    return (
      <View className={bottomClass}>
        <View className="price-section">
          <Price
            price={item.price}
            size={type === 'topping' ? 'large' : 'normal'}
            symbol="¥"
            className={priceClass}
          />
        </View>
        {type === 'topping' && item.label && (
          <View className="px-2.5 py-1 bg-gradient-to-r from-mint-400 to-mint-500 text-white rounded-tag text-tag-sm font-medium shadow-sm">
            <Text>{item.label}</Text>
          </View>
        )}
        {(type === 'ranking' || type === 'order') && item.label && (
          <View className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-tag text-tag-sm font-medium">
            <Text>{item.label}</Text>
          </View>
        )}
        {type === 'cart' && (
          <InputNumber
            value={item.quantity || 1}
            min={1}
            max={item.stock || 999}
            onChange={handleQuantityChange}
            disabled={disabledQuantity || updating[item.id || '']}
            className="mr-2"
          />
        )}
        {type === 'order' && (
          <Text className="text-xs text-gray-500">x{item.quantity || 1}</Text>
        )}
      </View>
    );
  };

  // 渲染根据类型
  switch (type) {
    case 'topping':
      return (
        <View
          className="relative flex-shrink-0 w-[280px] bg-white rounded-card-lg overflow-hidden shadow-card-lg border border-gray-100 transition-all duration-card active:scale-95 hover:shadow-card-hover"
          onClick={handleClick}
        >
          {item.label === '置顶' && (
            <View className="absolute top-3 left-3 bg-gradient-to-r from-sakura-400 to-sakura-500 text-white px-3 py-1.5 rounded-full text-tag-sm font-bold shadow-md z-10">
              <Text>🔥 置顶</Text>
            </View>
          )}
          {/* 图片容器 - 16:9 宽高比 */}
          <View className="relative w-full aspect-square">
            <Image
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={getImageUrl()}
              mode="aspectFill"
            />
          </View>
          <View className="p-card-padding">
            {renderTitle()}
            {renderTag()}
            {renderBottom()}
          </View>
        </View>
      );

    case 'ranking':
      return (
        <View
          className="flex items-center py-3 border-b border-gray-100 last:border-b-0 transition-all duration-card hover:bg-gray-50 active:bg-gray-100"
          onClick={handleClick}
        >
          <View className={`w-10 h-10 flex items-center justify-center flex-shrink-0 mr-3 ${index! < 3 ? 'top-three' : ''}`}>
            {index! < 3 ? (
              <View className="text-2xl">
                {index === 0 && <Text>🥇</Text>}
                {index === 1 && <Text>🥈</Text>}
                {index === 2 && <Text>🥉</Text>}
              </View>
            ) : (
              <View className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Text className="text-sm font-bold text-gray-500">{index! + 1}</Text>
              </View>
            )}
          </View>
          {/* 图片容器 - 1:1 宽高比 */}
          <View className="relative w-20 h-20 aspect-square rounded-card overflow-hidden flex-shrink-0 mr-3 border border-gray-100 bg-gray-50">
            <Image
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={getImageUrl()}
              mode="aspectFill"
            />
          </View>
          <View className="flex-1 min-w-0">
            {renderTitle()}
            {renderTag()}
            {renderBottom()}
          </View>
        </View>
      );

    case 'cart':
      return (
        <View
          className={`bg-white mb-3 p-card-padding rounded-card-lg border border-gray-100 shadow-card transition-all duration-card hover:shadow-card-hover ${onLongPress ? 'supports-long-press' : ''}`}
          onLongPress={handleLongPress}
        >
          <View className="flex flex-row items-start">
            {/* 选择框 */}
            <View className="flex-shrink-0 pt-1">
              <Checkbox
                checked={selected || item.is_selected === 1}
                onChange={handleSelect}
              />
            </View>

            {/* 商品图片 - 1:1 宽高比 */}
            <View className="relative w-20 h-20 aspect-square rounded-card overflow-hidden ml-3 bg-gray-50 flex-shrink-0 border border-gray-100">
              <Image
                src={getImageUrl()}
                className="absolute top-0 left-0 w-full h-full object-cover"
                mode="aspectFill"
                lazyLoad
              />
            </View>

            {/* 商品信息 */}
            <View className="flex-1 ml-3 min-w-0">
              <View className="flex flex-row items-center justify-between">
                {renderTitle()}
              </View>
              {renderSku()}
              {renderBottom()}
            </View>

            {/* 更多操作 */}
            {onShowMore && (
              <More className="absolute top-3 right-3 text-gray-400" size="18" onClick={handleShowMore} />
            )}
          </View>
        </View>
      );

    case 'order':
      return (
        <View
          className={`flex flex-row py-3 transition-all duration-card hover:bg-gray-50 ${!isLast ? 'border-b border-gray-100' : ''}`}
          onClick={handleClick}
        >
          {/* 图片容器 - 1:1 宽高比 */}
          <View className="relative w-20 h-20 rounded-card overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
            <Image
              className="absolute top-0 left-0 w-full h-full object-cover"
              mode="aspectFill"
              src={getImageUrl()}
            />
          </View>
          <View className="flex-1 ml-3 min-w-0">
            {renderTitle()}
            {renderSku()}
            {renderBottom()}
          </View>
        </View>
      );

    case 'recommend':
      return (
        <View
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-card hover:shadow-card-hover active:scale-95 w-full" // 添加 w-full 以填满列
          onClick={handleClick}
        >
          {/* 图片容器 - 16:9 宽高比 */}
          <View className="relative w-full aspect-square">
            <Image
              className="absolute top-0 left-0 w-full h-full object-cover" // 改为 object-cover 以更好地适应
              src={item.imgUrl || item.main_image!}
              mode="aspectFill"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </View>
          <View className="p-2.5 flex-1 flex flex-col justify-between">
            <View className="mb-1.5">
              <Text className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                {item.name || item.title || ''}
              </Text>
            </View>
            {item.tag && (
              <View className="inline-block bg-mint-100 text-mint-600 px-2 py-0.5 rounded-tag text-tag font-medium mb-1.5 self-start">
                <Text>{item.tag}</Text>
              </View>
            )}
            <View className="flex items-center justify-between mt-auto">
              <View>
                <Price
                  price={item.price}
                  size="normal"
                  symbol="¥"
                  className="text-sakura-500 font-bold"
                />
              </View>
              {item.label && (
                <View className="px-2 py-0.5 bg-gradient-to-r from-mint-400 to-mint-500 text-white rounded-tag text-tag-sm font-medium shadow-sm">
                  <Text>{item.label}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      );

    default:
      return null;
  }
};

// 商品列表组件（用于封装列表渲染，基于提供的 render 函数）
interface GoodsListProps {
  type: 'topping' | 'ranking' | 'cart' | 'order' | 'recommend';
  data: GoodsItemData[];
  onItemClick?: (item: GoodsItemData) => void;
  onItemSelect?: (id: string | number, checked: boolean) => void;
  onQuantityChange?: (item: GoodsItemData, quantity: number) => void;
  onLongPress?: (id: string | number) => void;
  onShowMore?: (id: string | number) => void;
  updating?: Record<string | number, boolean>;
  disabledQuantity?: boolean;
  // 额外：section 标题 props
  title?: string;
  subtitle?: string;
  titleIcon?: string;
  bgClass?: string;
  headerClass?: string;
  listClass?: string;
}

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
  headerClass = 'px-3 pt-3 pb-2',
  listClass = '',
}) => {
  if (!data || data.length === 0) return null;

  const isTopping = type === 'topping';
  const isRanking = type === 'ranking';
  const isRecommend = type === 'recommend'; // 用于判断是否应用瀑布流

  return (
    <View className={`${bgClass} ${isTopping ? 'pb-3 rounded-xl shadow-sm border border-gray-100' : 'pb-3 rounded-xl shadow-sm border border-gray-100'}`}>
      {/* Section Header */}
      {(title || subtitle) && (
        <View className={headerClass}>
          <View className="flex items-center mb-1">
            {titleIcon && (
              <View className={`w-7 h-7 ${isTopping ? 'bg-white/20' : 'bg-gradient-to-br from-pink-100 to-purple-100'} rounded-full flex items-center justify-center mr-1.5`}>
                <Text className="text-base">{titleIcon}</Text>
              </View>
            )}
            <View className={`text-base font-bold ${isTopping ? 'text-white' : 'text-gray-800'}`}>
              <Text>{title}</Text>
            </View>
          </View>
          <View className={`text-xs ${isTopping ? 'text-white/80' : 'text-gray-500'} ml-8.5`}>
            <Text>{subtitle}</Text>
          </View>
        </View>
      )}

      {/* List - 对于 'recommend' 类型应用错位瀑布流 */}
      <View
        className={
          isRecommend
            ? 'columns-2 md:columns-3 lg:columns-4 gap-4 px-4' // Tailwind 瀑布流容器：响应式列数 + 间距
            : listClass || (isTopping ? 'flex overflow-x-auto px-3 gap-2.5 scrollbar-none' : 'px-3')
        }
      >
        {data.map((item, index) => (
          <View
            key={`${item.id}-${index}`}
            className={isRecommend ? 'break-inside-avoid mb-4' : ''} // 关键：break-inside-avoid 防止跨列撕裂 + 垂直间距
          >
            <GoodsItem
              item={item}
              type={type}
              index={isRanking ? index : undefined}
              isLast={type === 'order' ? index === data.length - 1 : undefined}
              selected={onItemSelect ? (item.is_selected === 1) : undefined}
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