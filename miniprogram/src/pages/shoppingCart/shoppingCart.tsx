import Taro from '@tarojs/taro';
import React, { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { Checkbox, InputNumber, Button } from '@nutui/nutui-react-taro';
import shoppingCartApi from '../../api/shopping_cart';
import type { ShoppingCartListResponse, ShoppingCartItem } from '../../api/shopping_cart/types';
import './shoppingCart.scss';

function ShoppingCart() {
  const [cart, setCart] = useState<ShoppingCartListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [allSelected, setAllSelected] = useState(false);
  const [updating, setUpdating] = useState<{ [key: number]: boolean }>({});

  // 加载购物车列表
  const loadCart = async () => {
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
  };

  useEffect(() => {
    loadCart();
  }, []);

  // 处理全选/全不选
  const handleAllSelect = async (checked: boolean) => {
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
  };

  // 处理单个选中
  const handleItemSelect = async (id: number, checked: boolean) => {
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
  };

  // 更新数量
  const handleQuantityChange = async (item: ShoppingCartItem, value: number) => {
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
  };

  // 删除商品
  const handleDelete = async (id: number) => {
    const confirmed = await Taro.showModal({
      title: '确认删除',
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
  };

  // 清空购物车
  const handleClear = async () => {
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
  };

  // 结算
  const handleCheckout = () => {
    if (cart && cart.selected_count > 0) {
      Taro.navigateTo({
        url: '/pages/order/confirm'
      });
    } else {
      Taro.showToast({
        title: '请先选择商品',
        icon: 'none'
      });
    }
  };

  // 返回上一页
  const handleGoBack = () => {
    Taro.navigateBack();
  };

  if (loading) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8">
          <View className="text-4xl mb-4 animate-pulse">⏳</View>
          <View className="text-gray-600">加载中...</View>
        </View>
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <View className="text-center">
          <View className="text-6xl mb-4 text-gray-300">🛒</View>
          <View className="text-lg font-semibold text-gray-900 mb-2">购物车为空</View>
          <View className="text-sm text-gray-600 mb-6">赶紧去挑选心仪的商品吧</View>
          <Button
            type="primary"
            className="w-full max-w-xs"
            onClick={() => Taro.switchTab({ url: '/pages/index' })}
          >
            去逛逛
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航栏 */}
      <View className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <View className="flex items-center justify-between px-4 py-3">
          <View
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={handleGoBack}
          >
            <View className="text-gray-600 text-xl">←</View>
          </View>
          <View className="text-base font-semibold text-gray-900">购物车</View>
          <View
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={handleClear}
          >
            <View className="text-gray-600 text-sm">清空</View>
          </View>
        </View>
      </View>

      {/* 全选 */}
      <View className="mx-4 mt-12 bg-white rounded-lg px-4 py-3 border-b border-gray-200">
        <View className="flex items-center">
          <Checkbox
            checked={allSelected}
            onChange={handleAllSelect}
            shape="square"
          />
          <View className="text-sm font-medium text-gray-900 ml-2">全选</View>
          <View className="flex-1 text-right text-sm text-gray-600">
            已选 {cart.selected_count} 件 合计：
            <View className="text-lg font-semibold text-red-500 inline ml-1">
              ￥{cart.selected_price.toFixed(2)}
            </View>
          </View>
        </View>
      </View>

      {/* 商品列表 */}
      <View className="px-4 space-y-0">
        {cart.items.map((item) => (
          <View key={item.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            <View className="flex items-center">
              {/* 选中框 */}
              <Checkbox
                checked={item.is_selected === 1}
                onChange={(checked) => handleItemSelect(item.id, checked)}
                shape="square"
                className="mr-3"
              />

              {/* 商品图片 */}
              <Image
                src={item.image}
                mode="aspectFill"
                className="w-20 h-20 rounded-lg mr-3 flex-shrink-0"
              />

              {/* 商品信息 */}
              <View className="flex-1 min-w-0">
                <View className="text-sm font-semibold text-gray-900 mb-1 leading-tight truncate">
                  {item.title}
                </View>
                {item.sku && Object.keys(item.sku).length > 0 && (
                  <View className="text-xs text-gray-500 mb-2">
                    {Object.entries(item.sku).map(([k, v]) => `${k}: ${v}`).join(' ')}
                  </View>
                )}
                <View className="text-xs text-gray-500 mb-3">已售 {item.sales} 件</View>

                {/* 价格与数量 */}
                <View className="flex items-center justify-between">
                  <View className="text-sm font-semibold text-red-500">
                    ￥{item.price.toFixed(2)}
                  </View>
                  <View className="flex items-center space-x-2">
                    <InputNumber
                      value={item.quantity}
                      min={1}
                      max={item.stock}
                      onChange={(value) => handleQuantityChange(item, value as number)}
                      disabled={updating[item.id]}
                      size="small"
                    />
                    <View className="text-xs text-gray-500">/{item.stock} 件</View>
                  </View>
                </View>
              </View>

              {/* 删除按钮 */}
              <Button
                type="text"
                shape="round"
                className="ml-3 text-red-500"
                onClick={() => handleDelete(item.id)}
              >
                删除
              </Button>
            </View>
          </View>
        ))}
      </View>

      {/* 底部结算栏 */}
      <View className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex items-center h-12">
          <View className="flex-1 flex items-center">
            <Checkbox
              checked={allSelected}
              onChange={handleAllSelect}
              shape="square"
            />
            <View className="text-sm font-medium text-gray-900 ml-2">全选</View>
          </View>
          <View className="text-right">
            <View className="text-sm text-gray-600 mb-1">
              合计：<View className="text-lg font-semibold text-red-500 inline ml-1">￥{cart.selected_price.toFixed(2)}</View>
            </View>
            <Button
              type="primary"
              size="normal"
              className="w-32"
              disabled={cart.selected_count === 0}
              onClick={handleCheckout}
            >
              结算 ({cart.selected_count})
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ShoppingCart;