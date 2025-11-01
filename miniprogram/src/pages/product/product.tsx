import Taro from '@tarojs/taro';
import React, { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { Price, Swiper, Tabs, InputNumber, pxTransform } from '@nutui/nutui-react-taro';
import commodityApi from '../../api/commodity';
import shoppingCartApi from '../../api/shopping_cart';
import type { CommodityDetailResponse } from '../../api/commodity/types';
import './product.scss';

function CommodityDetail() {
  // 获取路由参数中的商品ID
  const routerParams = Taro.getCurrentInstance()?.router?.params || {};
  const commodityId = Number(routerParams.id);

  // 商品详情状态
  const [commodity, setCommodity] = useState<CommodityDetailResponse | null>(null);
  // 当前选中的规格（与 nuxt sku 结构保持一致：Record<string, string>）
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string }>({});
  // 商品数量
  const [quantity, setQuantity] = useState(1);
  // 当前活动标签页
  const [activeTab, setActiveTab] = useState('0');
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 加载商品详情
  useEffect(() => {
    if (commodityId) {
      loadCommodityDetail();
    }
  }, [commodityId]);

  // 加载商品详情数据
  const loadCommodityDetail = async () => {
    try {
      setIsLoading(true);
      const res = await commodityApi.detail(commodityId);
      const commodityData = res || ({} as CommodityDetailResponse);
      setCommodity(commodityData);

      // 初始化规格选择：若 sku 为 Record<string, string[]>，则为每个规格选择第一个选项
      const skuOptions = commodityData?.sku || {};
      if (skuOptions && typeof skuOptions === 'object') {
        const defaultSpecs: { [key: string]: string } = {};
        Object.entries(skuOptions as Record<string, string[]>).forEach(([name, values]) => {
          if (Array.isArray(values) && values.length > 0) {
            defaultSpecs[name] = values[0];
          }
        });
        setSelectedSpecs(defaultSpecs);
      }
    } catch (error) {
      console.error('加载商品详情失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理规格选择，仅更新选中项
  const handleSpecChange = (specName: string, specValue: string) => {
    const newSpecs = { ...selectedSpecs, [specName]: specValue };
    setSelectedSpecs(newSpecs);
  };

  // 返回上一页
  const handleGoBack = () => {
    Taro.navigateBack().catch(()=>{
      Taro.switchTab({
        url: '/pages/index/index',
      });
    });
  };

  // 处理收藏
  const handleCollect = async () => {
    if (!commodity) return;
    try {
      await commodityApi.collect(commodity.id);
      // 重新加载商品详情以更新收藏状态
      await loadCommodityDetail();
      Taro.showToast({
        title: commodity.is_collect ? '已取消收藏' : '收藏成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('收藏操作失败:', error);
      Taro.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  };

  // 是否规格已全部选择（当存在 sku 时）
  const isSpecsCompleted = () => {
    if (!commodity || !commodity.sku) return true;
    const skuOptions = commodity.sku as Record<string, string[]>;
    const keys = Object.keys(skuOptions);
    if (keys.length === 0) return true;
    return keys.every((k) => selectedSpecs[k]);
  };

  // 加入购物车
  const handleAddToCart = () => {
    if (!commodity) return;

    // 如果存在规格但未选择完整
    if (!isSpecsCompleted()) {
      Taro.showToast({
        title: '请选择规格',
        icon: 'none'
      });
      return;
    }

    // 检查库存（基于商品库存）
    const stock = commodity.stock || 0;
    if (stock < quantity) {
      Taro.showToast({
        title: '库存不足',
        icon: 'none'
      });
      return;
    }

    shoppingCartApi.add({
      commodity_id: commodity.id,
      quantity,
      sku: selectedSpecs
    }).then(res => {
      if (res.success) {
        Taro.showToast({
          title: '已加入购物车',
          icon: 'success'
        });
      } else {
        Taro.showToast({
          title: res.msg || '加入购物车失败',
          icon: 'none'
        });
      }
    });
  };

  // 立即购买
  const handleBuyNow = () => {
    if (!commodity) return;

    if (!isSpecsCompleted()) {
      Taro.showToast({
        title: '请选择规格',
        icon: 'none'
      });
      return;
    }

    const stock = commodity.stock || 0;
    if (stock < quantity) {
      Taro.showToast({
        title: '库存不足',
        icon: 'none'
      });
      return;
    }

    // 跳转到订单确认页面，传递商品ID与选择的规格
    const params = new URLSearchParams({
      commodityId: String(commodity.id),
      quantity: String(quantity),
      specs: encodeURIComponent(JSON.stringify(selectedSpecs || {}))
    });
    Taro.navigateTo({
      url: `/pages/order/confirm?${params.toString()}`
    });
  };

  // 处理数量变化
  const handleQuantityChange = (value: string | number) => {
    const num = typeof value === 'string' ? parseInt(value) : value;
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    }
  };

  // 加载中状态
  if (isLoading && !commodity) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 rounded-lg bg-white shadow-lg">
          <View className="text-4xl mb-4 animate-pulse">⏳</View>
          <View className="text-gray-600 font-medium">加载中...</View>
        </View>
      </View>
    );
  }

  // 商品不存在
  if (!commodity) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 rounded-lg bg-white shadow-lg">
          <View className="text-4xl mb-4">📭</View>
          <View className="text-gray-600 font-medium">商品不存在</View>
        </View>
      </View>
    );
  }

  // 获取图片列表（兼容逗号分隔字符串）
  const imageList = (() => {
    const img = commodity.image;
    if (!img) return [] as string[];
    if (Array.isArray(img)) return img as unknown as string[];
    if (typeof img === 'string') {
      return img.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [] as string[];
  })();

  // 当前价格与库存
  const currentPrice = commodity.price;
  const currentStock = commodity.stock || 0;

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <View className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <View className="flex items-center justify-between px-4 py-3">
          <View
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={handleGoBack}
          >
            <View className="text-gray-600 text-xl">←</View>
          </View>
          <View className="text-base font-semibold text-gray-900">商品详情</View>
          <View
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors relative"
            onClick={handleCollect}
          >
            <View className={`text-xl ${commodity.is_collect ? 'text-red-500' : 'text-gray-500'}`}>
              {commodity.is_collect ? '♥' : '♡'}
            </View>
          </View>
        </View>
      </View>

      {/* 商品图片轮播 */}
      <View className="mt-12 relative h-[50vh] mx-4 rounded-lg overflow-hidden bg-white shadow-md">
        {imageList.length > 0 ? (
          <Swiper
            className="h-full"
            height={'100%'}
            defaultValue={0}
            autoPlay
            indicator
          >
            {imageList.map((image, index) => (
              <Swiper.Item key={index}>
                <Image
                  src={image}
                  mode="aspectFill"
                  className="w-full h-full"
                />
              </Swiper.Item>
            ))}
          </Swiper>
        ) : (
          <View className="flex items-center justify-center h-full bg-gray-100">
            <View className="text-center text-gray-400">
              <View className="text-4xl mb-2">📷</View>
              <View className="text-sm">暂无图片</View>
            </View>
          </View>
        )}
        {imageList.length > 1 && (
          <View className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {imageList.length > 0 ? `${1} / ${imageList.length}` : ''}
          </View>
        )}
      </View>

      {/* 商品基本信息 */}
      <View className="mx-4 mt-4 bg-white rounded-lg px-4 py-4 shadow-sm border border-gray-200">
        {/* 价格 */}
        <View className="mb-3">
          <Price
            price={currentPrice}
            size="large"
            symbol="¥"
            thousands
            className="text-red-500"
          />
        </View>

        {/* 标签：推荐/置顶 */}
        <View className="flex items-center mb-3 space-x-2">
          {commodity.is_recommend === 1 && (
            <View className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              推荐
            </View>
          )}
          {commodity.is_topping === 1 && (
            <View className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              置顶
            </View>
          )}
        </View>

        {/* 商品标题 */}
        <View className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {commodity.title}
        </View>

        {/* 销量、分类、库存 - 优化为单行紧凑布局 */}
        <View className="flex items-center justify-between text-sm text-gray-600">
          <View className="flex items-center space-x-2">
            <View>已售 {commodity.sales || 0} 件</View>
            <View>|</View>
            <View>分类：{commodity.category || '未分类'}</View>
            <View>|</View>
            <View>库存：{currentStock}</View>
          </View>
        </View>
      </View>

      {/* 规格选择 */}
      {commodity.sku && Object.keys(commodity.sku as Record<string, string[]>).length > 0 && (
        <View className="mx-4 mt-4 bg-white rounded-lg px-4 py-4 shadow-sm border border-gray-200">
          <View className="text-base font-semibold text-gray-900 mb-3">选择规格</View>
          {Object.entries(commodity.sku as Record<string, string[]>).map(([name, values]) => (
            <View key={name} className="mb-4">
              <View className="text-sm text-gray-600 mb-2 font-medium">{name}</View>
              <View className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <View
                    key={value}
                    className={`px-3 py-2 rounded border text-sm transition-colors ${
                      selectedSpecs[name] === value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleSpecChange(name, value)}
                  >
                    {value}
                  </View>
                ))}
              </View>
            </View>
          ))}
          {!isSpecsCompleted() && (
            <View className="text-xs text-red-500 mt-2">请选择完整规格</View>
          )}
        </View>
      )}

      {/* 商品数量选择 */}
      <View className="mx-4 mt-4 bg-white rounded-lg px-4 py-4 shadow-sm border border-gray-200">
        <View className="flex items-center justify-between">
          <View className="text-base font-semibold text-gray-900">数量</View>
          <View className="flex items-center space-x-3">
            <InputNumber
              value={quantity}
              min={1}
              max={currentStock > 0 ? currentStock : 999}
              onChange={handleQuantityChange}
            />
          </View>
        </View>
      </View>

      {/* 商品详情标签页 */}
      <View className="mx-4 mt-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
          <Tabs.TabPane title="商品详情">
            <View className="p-4">
              {commodity.intro && (
                <View className="text-sm text-gray-600 leading-relaxed mb-4"dangerouslySetInnerHTML={{ __html: commodity.intro }}>
                </View>
              )}
              {commodity.content && (
                <View className="prose prose-sm max-w-none text-gray-700">
                  <View dangerouslySetInnerHTML={{ __html: commodity.content }} />
                </View>
              )}
              {!commodity.intro && !commodity.content && (
                <View className="text-center py-8 text-gray-400">
                  <View className="text-sm">暂无商品详情</View>
                </View>
              )}
            </View>
          </Tabs.TabPane>
          
          <Tabs.TabPane title="规格参数">
            <View className="p-4 space-y-3 text-sm text-gray-700">
              <View className="flex justify-between">
                <View className="text-gray-500 w-20">商品编号</View>
                <View>{commodity.id}</View>
              </View>
              <View className="flex justify-between">
                <View className="text-gray-500 w-20">分类</View>
                <View>{commodity.category || '未分类'}</View>
              </View>
              <View className="flex justify-between">
                <View className="text-gray-500 w-20">发货方式</View>
                <View>{commodity.deliveryType || '默认'}</View>
              </View>
              <View className="flex justify-between">
                <View className="text-gray-500 w-20">上架时间</View>
                <View>{commodity.create_time}</View>
              </View>
              <View className="flex justify-between">
                <View className="text-gray-500 w-20">更新时间</View>
                <View>{commodity.update_time}</View>
              </View>
            </View>
          </Tabs.TabPane>
        </Tabs>
      </View>

      {/* 底部操作栏 */}
      <View className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex items-center justify-between h-12">
          <View className="flex-1 pr-2">
            <View
              className="w-full h-full bg-gray-100 border border-gray-200 rounded text-center flex items-center justify-center text-sm font-medium text-gray-600 active:bg-gray-200 transition-colors"
              onClick={handleAddToCart}
            >
              加入购物车
            </View>
          </View>
          <View className="flex-1 ml-2">
            <View
              className="w-full h-full bg-red-500 text-white rounded text-center flex items-center justify-center text-sm font-semibold active:bg-red-600 transition-colors"
              onClick={handleBuyNow}
            >
              立即购买
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CommodityDetail;