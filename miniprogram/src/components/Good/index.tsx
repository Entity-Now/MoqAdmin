import React, { useCallback } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { Checkbox, InputNumber, Price } from '@nutui/nutui-react-taro';
import { More } from '@nutui/icons-react-taro'; // 假设 More 图标来自 NutUI 或自定义

// 商品数据通用接口（基于提供的片段推断）
interface GoodsItemData {
  id?: string | number;
  name?: string;
  title?: string;
  imgUrl?: string;
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
  type: 'topping' | 'ranking' | 'cart' | 'order' | 'recommend'; // 渲染类型
  index?: number; // 用于排行榜排名
  isLast?: boolean; // 用于订单/购物车边框
  selected?: boolean; // 购物车选中状态
  onClick?: (item: GoodsItemData) => void; // 点击跳转详情
  onSelect?: (id: string | number, checked: boolean) => void; // 购物车选中
  onQuantityChange?: (item: GoodsItemData, quantity: number) => void; // 数量变更
  onLongPress?: (id: string | number) => void; // 长按事件
  onShowMore?: (id: string | number) => void; // 显示更多
  updating?: Record<string | number, boolean>; // 数量更新中
  disabledQuantity?: boolean; // 数量输入禁用
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
    if (Array.isArray(item.image)) {
      return item.image[0] || '';
    }
    if(item.imgUrl){
      return item.imgUrl || '';
    }
    return item.image || '';
  };
  // 通用商品标题
  const renderTitle = () => {
    const title = item.name || item.title || '';
    return (
      <Text className={`font-medium line-clamp-2 ${type === 'topping' ? 'text-sm text-cloud-600 mb-1.5' : 'text-sm text-cloud-600 mb-1 leading-tight'}`}>
        {title}
      </Text>
    );
  };

  // 通用标签
  const renderTag = () => {
    if (!item.tag) return null;
    const tagClass = type === 'topping' ? 'bg-mint-100 text-mint-600 px-2 py-0.5 rounded text-[11px] mb-2' : 
                     type === 'ranking' ? 'bg-lemon-100 text-lemon-600 px-1.5 py-0.5 rounded text-[10px] mb-1.5' : 
                     null;
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
    const skuClass = type === 'cart' || type === 'order' ? 'text-xs text-gray-400 mb-2 block line-clamp-1' : null;
    if (!skuClass) return null;
    return (
      <Text className={skuClass}>
        {skuText}
      </Text>
    );
  };

  // 通用价格和数量/标签底部
  const renderBottom = () => {
    const priceClass = type === 'topping' ? 'text-sakura-500 font-bold' : 'text-sakura-500 font-bold';
    const bottomClass = type === 'topping' ? 'flex items-center justify-between' :
                        type === 'ranking' || type === 'cart' || type === 'order' ? 'flex flex-row justify-between items-end mt-2' : null;
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
          <View className="label bg-mermaid-wave text-white px-2 py-0.5 rounded text-[10px]">
            <Text>{item.label}</Text>
          </View>
        )}
        {(type === 'ranking' || type === 'order') && item.label && (
          <View className="label bg-cloud-100 text-cloud-600 px-1.5 py-0.5 rounded text-[10px]">
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
          className="topping-card relative flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden shadow-lg"
          onClick={handleClick}
        >
          {item.label === '置顶' && ( // 假设 label 为 '置顶' 时显示徽章
            <View className="topping-badge absolute top-2.5 left-2.5 bg-sunset-glow text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
              <Text>置顶</Text>
            </View>
          )}
          <Image
            className="topping-image w-full h-[200px] object-cover"
            src={getImageUrl()}
            mode="aspectFill"
          />
          <View className="topping-info p-3">
            {renderTitle()}
            {renderTag()}
            {renderBottom()}
          </View>
        </View>
      );

    case 'ranking':
      return (
        <View
          className="ranking-item flex items-center py-3 border-b border-cloud-200 last:border-b-0"
          onClick={handleClick}
        >
          <View className={`ranking-number w-10 h-10 flex items-center justify-center flex-shrink-0 mr-3 ${index! < 3 ? 'top-three' : ''}`}>
            {index! < 3 ? (
              <View className="medal-icon text-2xl">
                {index === 0 && <Text>🥇</Text>}
                {index === 1 && <Text>🥈</Text>}
                {index === 2 && <Text>🥉</Text>}
              </View>
            ) : (
              <View className="number-text text-base font-bold text-cloud-400">
                <Text>{index! + 1}</Text>
              </View>
            )}
          </View>
          <Image
            className="ranking-image w-20 h-20 rounded-lg flex-shrink-0 mr-3"
            src={getImageUrl()}
            mode="aspectFill"
          />
          <View className="ranking-info flex-1 min-w-0">
            {renderTitle()}
            {renderTag()}
            {renderBottom()}
          </View>
        </View>
      );

    case 'cart':
      return (
        <View
          className={`bg-white mb-2 p-3 rounded-lg relative ${onLongPress ? 'supports-long-press' : ''}`}
          onLongPress={handleLongPress}
          
        >
          <View className="flex flex-row items-start">
            {/* 选择框 - 仅 cart */}
            <View className="flex-shrink-0 pt-1">
              <Checkbox
                checked={selected || item.is_selected === 1}
                onChange={handleSelect}
              />
            </View>

            {/* 商品图片 */}
            <Image
              src={getImageUrl()}
              mode="aspectFill"
              className="w-20 h-20 rounded ml-3 bg-gray-100 flex-shrink-0"
              lazyLoad
            />

            {/* 商品信息 */}
            <View className="flex-1 ml-3 min-w-0">
              <View className="flex flex-row items-center justify-between">
                {renderTitle()}
              </View>
              {renderSku()}
              {renderBottom()}
              {/* 库存提示 - 可选，根据需要添加 */}
              {/* {item.stock < 10 && (
                <Text className="text-xs text-orange-500 mt-1 block">
                  仅剩 {item.stock} 件
                </Text>
              )} */}
            </View>

            {/* 更多操作 - 仅 cart */}
            {onShowMore && (
              <More className="absolute top-0 right-0 text-slate-100" size="18" onClick={handleShowMore} />
            )}
          </View>
        </View>
      );

    case 'order':
      return (
        <View 
          className={`flex flex-row py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}
          onClick={handleClick}
        >
          <Image
            className="w-20 h-20 rounded bg-gray-100 flex-shrink-0"
            src={getImageUrl()}
            mode="aspectFill"
          />
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
          className="recommend-card bg-white rounded-lg overflow-hidden shadow-sm flex flex-col"
          onClick={handleClick}
        >
          <Image
            className="w-full h-[150px] object-cover" // 根据 imgHeight='80%' 调整，假设固定高度
            src={item.imgUrl || item.image?.[0] || ''}
            mode="aspectFill"
            
          />
          <View className="p-3 flex-1 flex flex-col justify-between">
            <View className="recommend-title mb-2">
              <Text className="text-sm font-medium text-cloud-600 line-clamp-2">
                {item.name || item.title || ''}
              </Text>
            </View>
            {item.tag && (
              <View className="recommend-tag inline-block bg-mint-100 text-mint-600 px-2 py-0.5 rounded text-[11px] mb-2 self-start">
                <Text>{item.tag}</Text>
              </View>
            )}
            <View className="recommend-bottom flex items-center justify-between">
              <View className="recommend-price">
                <Price
                  price={item.price}
                  size="normal"
                  symbol="¥"
                  className="text-sakura-500 font-bold"
                />
              </View>
              {item.label && (
                <View className="recommend-label bg-mermaid-wave text-white px-2 py-0.5 rounded text-[10px]">
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
  type: 'topping' | 'ranking' | 'cart' | 'order';
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
  bgClass?: string; // 背景类，如 'bg-cotton-candy' 或 'bg-white'
  headerClass?: string;
  listClass?: string; // 如 'flex overflow-x-auto px-4 gap-3 scrollbar-none' for topping
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
  headerClass = 'px-4 pt-5 pb-3',
  listClass = '',
}) => {
  if (!data || data.length === 0) return null;

  const isTopping = type === 'topping';
  const isRanking = type === 'ranking';

  return (
    <View className={`${bgClass} ${isTopping ? 'topping-section mt-2.5 pb-4 rounded-lg' : 'ranking-section mt-2.5 pb-4 rounded-lg shadow-sm'}`}>
      {/* Section Header */}
      {(title || subtitle) && (
        <View className={headerClass}>
          <View className="header-title flex items-center mb-1">
            {titleIcon && <View className="title-icon text-xl mr-1.5 text-white">{titleIcon}</View>}
            <View className={`title-text text-lg font-bold ${isTopping ? 'text-white' : 'text-cloud-600'}`}>
              <Text>{title}</Text>
            </View>
          </View>
          <View className={`header-subtitle text-xs ${isTopping ? 'text-white/80' : 'text-cloud-400'} ml-[26px]`}>
            <Text>{subtitle}</Text>
          </View>
        </View>
      )}

      {/* List */}
      <View className={listClass || (isTopping ? 'topping-scroll flex overflow-x-auto px-4 gap-3 scrollbar-none' : 'ranking-list px-4')}>
        {data.map((item, index) => (
          <GoodsItem
            key={`${item.id}-${index}`} // 唯一 key
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
        ))}
      </View>
    </View>
  );
};