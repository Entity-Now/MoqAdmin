import Taro from '@tarojs/taro';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { Checkbox, InputNumber, Button, ActionSheet, Empty, Skeleton } from '@nutui/nutui-react-taro';
import { SettleBar } from '@nutui/nutui-biz';
import { More, ShareF, DelF } from '@nutui/icons-react-taro';
import shoppingCartApi from '../../api/shopping_cart';
import orderApi from '../../api/order';
import TopBar from '../../components/TopBar';
import type { ShoppingCartListResponse, ShoppingCartItem } from '../../api/shopping_cart/types';
import './shoppingCart.scss';

function ShoppingCart() {
  const [cart, setCart] = useState<ShoppingCartListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [allSelected, setAllSelected] = useState(false);
  const [updating, setUpdating] = useState<{ [key: number]: boolean }>({});
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  // 加载购物车列表
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await shoppingCartApi.lists();
      setCart(res);
      setAllSelected(res.selected_count === res.total_count && res.total_count > 0);
    } catch (error) {
      console.error('加载购物车失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // 处理全选/全不选
  const handleAllSelect = useCallback(async (checked: boolean) => {
    if (!cart || cart.items.length === 0) return;
    const ids = cart.items.map(item => item.id);
    try {
      await shoppingCartApi.select({ ids, is_selected: checked ? 1 : 0 });
      setAllSelected(checked);
      await loadCart();
    } catch (error) {
      console.error('全选操作失败:', error);
      Taro.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  }, [cart, loadCart]);

  // 处理单个选中
  const handleItemSelect = useCallback(async (id: number, checked: boolean) => {
    try {
      await shoppingCartApi.select({ ids: [id], is_selected: checked ? 1 : 0 });
      await loadCart();
    } catch (error) {
      console.error('选中操作失败:', error);
      Taro.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  }, [loadCart]);

  // 更新数量
  const handleQuantityChange = useCallback(async (item: ShoppingCartItem, value: number) => {
    if (value === item.quantity || value <= 0) return;
    setUpdating(prev => ({ ...prev, [item.id]: true }));
    try {
      await shoppingCartApi.update({ id: item.id, quantity: value });
      await loadCart();
    } catch (error) {
      console.error('更新数量失败:', error);
      Taro.showToast({
        title: '更新失败',
        icon: 'none'
      });
    } finally {
      setUpdating(prev => ({ ...prev, [item.id]: false }));
    }
  }, [loadCart]);

  // 删除商品
  const handleDelete = useCallback(async (id: number) => {
    const confirmed = await Taro.showModal({
      title: '删除商品',
      content: '确定要从购物车删除该商品吗？',
      confirmText: '删除',
      cancelText: '取消'
    });
    if (!confirmed.confirm) return;

    try {
      await shoppingCartApi.delete({ ids: [id] });
      await loadCart();
      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('删除失败:', error);
      Taro.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  }, [loadCart]);

  // 清空购物车
  const handleClear = useCallback(async () => {
    const confirmed = await Taro.showModal({
      title: '清空购物车',
      content: '确定要清空整个购物车吗？',
      confirmText: '清空',
      cancelText: '取消'
    });
    if (!confirmed.confirm) return;

    try {
      await shoppingCartApi.clear();
      setCart(null);
      setAllSelected(false);
      Taro.showToast({
        title: '清空成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('清空失败:', error);
      Taro.showToast({
        title: '清空失败',
        icon: 'none'
      });
    }
  }, []);

  // 长按删除
  const handleLongPress = useCallback((id: number) => {
    Taro.vibrateShort({ type: 'light' });
    setCurrentItemId(id);
    setActionSheetVisible(true);
  }, []);

  // 显示更多操作
  const handleShowMore = useCallback((id: number) => {
    setCurrentItemId(id);
    setActionSheetVisible(true);
  }, []);

  // ActionSheet 选项
  const actionSheetOptions = [
    {
      name: '删除订单',
    }
  ];
  const actionSelectHandle = (item) => {
    if (item.name === '删除订单') {
      handleDelete(currentItemId || 0);
    }
  }

  // 结算
  const handleCheckout = useCallback(() => {
    if (cart && cart.selected_count > 0) {
      // orderApi.create({
      //   cart_ids: cart.items.filter(item => item.is_selected === 1).map(item => item.id),
      //   is_from_cart: true,

      // })
      Taro.navigateTo({
        url: '/pages/order/confirm'
      });
    } else {
      Taro.showToast({
        title: '请先选择商品',
        icon: 'none'
      });
    }
  }, [cart]);

  // 渲染商品项
  const renderCartItem = useCallback((item: ShoppingCartItem) => (
    <View
      key={item.id}
      className="bg-white mb-2 p-3 rounded-lg relative"
      onLongPress={() => handleLongPress(item.id)}
    >
      <View className="flex flex-row items-start">
        {/* 选择框 */}
        <View className="flex-shrink-0 pt-1">
          <Checkbox
            checked={item.is_selected === 1}
            onChange={(checked) => handleItemSelect(item.id, checked)}
          />
        </View>

        {/* 商品图片 */}
        <Image
          src={item.image?.[0] || ''}
          mode="aspectFill"
          className="w-20 h-20 rounded ml-3 bg-gray-100 flex-shrink-0"
          lazyLoad
        />

        {/* 商品信息 */}
        <View className="flex-1 ml-3 min-w-0">
          <View className='flex flex-row items-center justify-between'>
            <Text className="text-xs text-gray-900 mb-1 block line-clamp-2">
              {item.title}
            </Text>
          </View>
          {item.sku && Object.keys(item.sku).length > 0 && (
            <Text className="text-xs text-gray-400 mb-2 block line-clamp-1">
              {Object.entries(item.sku).map(([k, v]) => `${k}:${v}`).join(' ')}
            </Text>
          )}

          {/* 价格和数量 */}
          <View className="flex flex-row justify-between items-end mt-2">
            <Text className="text-xs font-medium text-red-500">
              ¥{item.price.toFixed(2)}
            </Text>

            <InputNumber
              value={item.quantity}
              min={1}
              max={item.stock}
              onChange={(value) => handleQuantityChange(item, value as number)}
              disabled={updating[item.id]}
              className="mr-2"
            />
          </View>

          {/* 库存提示 */}
          {/* {item.stock < 10 && (
            <Text className="text-xs text-orange-500 mt-1 block">
              仅剩 {item.stock} 件
            </Text>
          )} */}
        </View>
            <More className="absolute t-0 right-0 text-slate-100" size="18" onClick={() => handleShowMore(item.id)}/>
      </View>
    </View>
  ), [handleItemSelect, handleQuantityChange, handleLongPress, handleShowMore, updating]);

  // Loading 状态
  if (loading) {
    return (
      <View className="h-screen flex flex-col bg-gray-50">
        {/* 顶部导航 */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <Text className="text-base font-medium text-gray-900 text-center">购物车</Text>
        </View>

        {/* Skeleton */}
        <View className="flex-1 p-4">
          {[1, 2, 3].map(i => (
            <View key={i} className="bg-white mb-2 p-3 rounded-lg">
              <Skeleton rows={3} animated />
            </View>
          ))}
        </View>
      </View>
    );
  }

  // 空状态
  if (!cart || cart.items.length === 0) {
    return (
      <View className="h-screen flex flex-col bg-gray-50">
        {/* 顶部导航 */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <Text className="text-base font-medium text-gray-900 text-center">购物车</Text>
        </View>

        {/* 空状态 */}
        <View className="flex-1 flex flex-col items-center justify-center px-4">
          <Empty description="购物车是空的" />
          <Button
            type="primary"
            size="large"
            className="mt-6 w-40"
            onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
          >
            去逛逛
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <TopBar title={`购物车(${cart.total_count})`} icon={<View className='flex flex-row gap-3'>
        <ShareF size={18} color='white' />
        <DelF size={18} color='white' onClick={handleClear}/>
        </View>}/>

      {/* 商品列表 - 使用 flex-1 占据剩余空间 */}
      <View className="flex-1 overflow-hidden">
        <ScrollView
          scrollY
          className="h-full"
          enableBackToTop
        >
          <View className="p-4 pb-2">
            {cart.items.map(renderCartItem)}
          </View>

          {/* 底部安全距离 */}
          <View className="h-4" />
        </ScrollView>
      </View>

      {/* 底部结算栏 - 使用 flex-shrink-0 固定在底部 */}
      <SettleBar className="mb-[50px] flex-shrink-0"
        total={cart.selected_price.toFixed(2)}
        settleCount={cart.selected_count}
        settleButtonText={`结算`}
        disabled={cart.selected_count === 0}
        onClickButton={handleCheckout}
        isCheckedAll={allSelected}
        onSelectAll={handleAllSelect}
      />

      {/* ActionSheet 操作菜单 */}
      <ActionSheet
        visible={actionSheetVisible}
        options={actionSheetOptions}
        onSelect={actionSelectHandle}
        onCancel={() => setActionSheetVisible(false)}
        onClose={() => setActionSheetVisible(false)}
      />
    </View>
  );
}

export default ShoppingCart;