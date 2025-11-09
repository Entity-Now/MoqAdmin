import Taro from '@tarojs/taro';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { Checkbox, InputNumber, Button, ActionSheet, Empty, Skeleton } from '@nutui/nutui-react-taro';
import { More, ShareF, DelF } from '@nutui/icons-react-taro';
import shoppingCartApi from '../../api/shopping_cart';
import orderApi from '../../api/order';
import TopBar from '../../components/TopBar';
import useUser from '../../store/useUser';
import type { ShoppingCartListResponse, ShoppingCartItem } from '../../api/shopping_cart/types';
import './index.scss';
import { GoodsItem } from '../../components/Good'; // 修正导入路径
import AddressSelect from '../../components/Address/select';
import { AddressItem } from "../../api/address/types";
import SettleBar from '../../components/SettleBar';

function ShoppingCart() {
  const user = useUser();
  const [addressVisible, setAddressVisible] = useState(false);
  const [address, setAddress] = useState<AddressItem | null>(null);
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

  // 更新数量 - 调整参数类型为 string | number
  const handleQuantityChange = useCallback(async (item: ShoppingCartItem, value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    if (numValue === item.quantity || numValue <= 0) return;
    setUpdating(prev => ({ ...prev, [item.id]: true }));
    try {
      await shoppingCartApi.update({ id: item.id, quantity: numValue });
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

  // ActionSheet 选项 - 修正文本
  const actionSheetOptions = [
    {
      name: '删除商品',
    }
  ];
  // 修正 actionSelectHandle
  const actionSelectHandle = (item) => {
    if (item.name === '删除商品') {
      if (!currentItemId) return;
      handleDelete(currentItemId);
    }
    setActionSheetVisible(false);
  };

  // 结算 - 添加登录检查
  const handleCheckout = useCallback(() => {
    if (!user.isLogin()) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    if (cart && cart.selected_count > 0) {
      setAddressVisible(true);
    } else {
      Taro.showToast({
        title: '请先选择商品',
        icon: 'none'
      });
    }
  }, [cart, user.isLogin]);

  // 选择地址回调 - 添加 address_id 和 res 检查
  const handleAddressSelect = useCallback((item: AddressItem) => {
    setAddressVisible(false);
    setAddress(item);
    if (!item.id) {
      Taro.showToast({
        title: '请选择地址',
        icon: 'none'
      });
      return;
    }
    const selectedItems = cart?.items?.filter(item => item.is_selected === 1).map(it => it.id) || [];
    orderApi.create({
      cart_ids: selectedItems,
      is_from_cart: true,
      address_id: item.id,  // 新增
    }).then(res => {
      if (res && res.order_id) {  // 假设 res 有 order_id
        Taro.navigateTo({
          url: `/pages/order/confirm?id=${res.order_id}`
        });
      } else {
        Taro.showToast({
          title: '下单失败',
          icon: 'none'
        });
      }
    });
  }, [cart]);

  // 渲染商品项
  const CartGoodsList = ({ cartItems }: { cartItems: ShoppingCartItem[] }) => (
    <View>
      {cartItems.map((item) => (
        <GoodsItem
          key={item.id}
          item={item}
          type="cart"
          selected={item.is_selected === 1}
          onSelect={handleItemSelect}
          onQuantityChange={handleQuantityChange}
          onLongPress={handleLongPress}
          onShowMore={handleShowMore}
          updating={updating}
        />
      ))}
    </View>
  );

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

  // 空状态 - 移除 DelF
  if (!cart || cart.items.length === 0) {
    return (
      <View className="h-screen flex flex-col bg-gray-50">
        {/* 顶部导航 */}
        <TopBar title={`购物车`} icon={<ShareF size={18} color='white' />} />
        {/* 空状态 */}
        <View className="flex-1 flex flex-col items-center justify-center px-4">
          <Empty description="购物车是空的" className='!bg-gray-50' />
          {user.isLogin() ? (<Button
            type="primary"
            size="large"
            className="mt-6 w-40"
            onClick={() => Taro.switchTab({ url: '/pages/category/index' })}
          >
            去逛逛
          </Button>) : (
            <Button
              type="primary"
              size="large"
              className="mt-6 w-40"
              onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}
            >
              去登录
            </Button>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <TopBar title={`购物车(${cart.total_count})`} icon={<View className='flex flex-row gap-3'>
        <ShareF size={18} color='white' />
        <DelF size={18} color='white' onClick={handleClear} />
      </View>} />

      {/* 商品列表 - 使用 flex-1 占据剩余空间 */}
      <View className="flex-1 overflow-hidden">
        <ScrollView
          scrollY
          className="h-full"
          enableBackToTop
          refresherEnabled  // 新增：下拉刷新
          onRefresherRefresh={loadCart}  // 新增
          refresherTriggered={false}
        >
          {CartGoodsList({ cartItems: cart.items })}

          {/* 底部安全距离 */}
          <View className="h-4" />
        </ScrollView>
      </View>

      {/* 选择地址 */}
      <AddressSelect visible={addressVisible} setVisible={setAddressVisible} selected={handleAddressSelect} />
      {/* 底部结算栏 - 使用 flex-shrink-0 固定在底部 */}
      <SettleBar className="flex-shrink-0"
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