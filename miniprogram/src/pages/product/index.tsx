import Taro from '@tarojs/taro';
import { useLoad, useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useState, useCallback, useRef } from 'react';
import { View, Image, Button } from '@tarojs/components';
import { Price, Swiper, Tabs, InputNumber } from '@nutui/nutui-react-taro';
import commodityApi from '../../api/commodity';
import shoppingCartApi from '../../api/shopping_cart';
import type { CommodityDetailResponse } from '../../api/commodity/types';
import './index.scss';
import orderApi from '../../api/order';
import Address from '../../components/Address'
import TopBar from '../../components/TopBar'
import { Fabulous, Service, Store } from '@nutui/icons-react-taro';
import { AddressItem } from 'src/api/address/types';
import useUserStore from '../../store/useUser';

function CommodityDetail() {
  // 获取路由参数中的商品ID
  const routerParams = Taro.getCurrentInstance()?.router?.params || {};
  const commodityId = Number(routerParams.id);

  // Store
  const { isLogin, goLogin } = useUserStore();

  // 选中的地址
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(null);
  // 商品详情状态
  const [commodity, setCommodity] = useState<CommodityDetailResponse | null>(null);
  // 当前选中的规格（与 nuxt sku 结构保持一致：Record<string, string>）
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string }>({});
  // 商品数量
  const [quantity, setQuantity] = useState(1);
  // 当前活动标签页
  const [activeTab, setActiveTab] = useState('0');
  // 当前的图片页码
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // 按钮加载状态
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  // 使用 ref 防止重复加载
  const isLoadingRef = useRef(false);

  // 加载商品详情
  useLoad(() => {
    if (commodityId) {
      loadCommodityDetail();
    }
  });

  useDidShow(() => {
    // 防止重复加载 - 使用 ref 而不是 state 避免竞态条件
    if (!isLoadingRef.current && commodityId) {
      loadCommodityDetail();
    }
  })
  // 分享设置
  useShareAppMessage(() => {
    return {
      title: commodity?.title || '',
      path: `/pages/product/index?id=${commodityId}`,
      imageUrl: commodity?.image?.[0] || '',
    }
  })
  useShareTimeline(() => {
    return {
      title: commodity?.title || '',
      query: `id=${commodityId}`,
      imageUrl: commodity?.image?.[0] || '',

    }
  })

  // 加载商品详情数据
  const loadCommodityDetail = async () => {
    // 防止重复请求
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
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
    } catch (error: any) {
      console.error('加载商品详情失败:', error);
      Taro.showToast({
        title: error?.message || '加载失败，请重试',
        icon: 'none'
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  // 处理规格选择，仅更新选中项
  const handleSpecChange = useCallback((specName: string, specValue: string) => {
    setSelectedSpecs(prev => ({ ...prev, [specName]: specValue }));
  }, []);

  // 检查是否需要登录
  const requireAuth = useCallback((action: () => void | Promise<void>) => {
    if (!isLogin()) {
      Taro.showModal({
        title: '需要登录',
        content: '此操作需要登录，是否前往登录页面？',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            const currentPage = Taro.getCurrentInstance().router?.path || '';
            const params = new URLSearchParams({ id: String(commodityId) }).toString();
            goLogin(`${currentPage}?${params}`);
          }
        }
      });
      return false;
    }
    action();
    return true;
  }, [isLogin, goLogin, commodityId]);

  // 处理收藏
  const handleCollect = useCallback(async () => {
    if (!commodity) return;

    requireAuth(async () => {
      if (isCollecting) return;

      try {
        setIsCollecting(true);
        await commodityApi.collect(commodity.id);

        // 更新本地状态而不是重新加载整个详情
        setCommodity(prev => prev ? {
          ...prev,
          is_collect: prev.is_collect === 1 ? 0 : 1
        } : null);

        Taro.showToast({
          title: commodity.is_collect === 1 ? '已取消收藏' : '收藏成功',
          icon: 'success',
          duration: 1500
        });
      } catch (error: any) {
        console.error('收藏操作失败:', error);
        Taro.showToast({
          title: error?.message || '操作失败，请重试',
          icon: 'none'
        });
      } finally {
        setIsCollecting(false);
      }
    });
  }, [commodity, isCollecting, requireAuth]);

  // 是否规格已全部选择（当存在 sku 时）
  const isSpecsCompleted = useCallback(() => {
    if (!commodity || !commodity.sku) return true;
    const skuOptions = commodity.sku as Record<string, string[]>;
    const keys = Object.keys(skuOptions);
    if (keys.length === 0) return true;
    return keys.every((k) => selectedSpecs[k]);
  }, [commodity, selectedSpecs]);

  // 验证商品信息
  const validateProduct = useCallback(() => {
    if (!commodity) {
      Taro.showToast({
        title: '商品信息加载中',
        icon: 'none'
      });
      return false;
    }

    // 如果存在规格但未选择完整
    if (!isSpecsCompleted()) {
      Taro.showToast({
        title: '请选择完整规格',
        icon: 'none'
      });
      return false;
    }

    // 检查库存
    const stock = commodity.stock || 0;
    if (stock < 1) {
      Taro.showToast({
        title: '商品已售罄',
        icon: 'none'
      });
      return false;
    }

    if (stock < quantity) {
      Taro.showToast({
        title: `库存不足，仅剩 ${stock} 件`,
        icon: 'none'
      });
      return false;
    }

    return true;
  }, [commodity, quantity, isSpecsCompleted]);

  // 加入购物车
  const handleAddToCart = useCallback(() => {
    if (!validateProduct()) return;

    requireAuth(async () => {
      if (isAddingToCart) return;

      try {
        setIsAddingToCart(true);

        const res = await shoppingCartApi.add({
          commodity_id: commodity!.id,
          quantity,
          sku: selectedSpecs
        });

        if (res?.success) {
          Taro.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 1500
          });
        } else {
          throw new Error(res?.msg || '加入购物车失败');
        }
      } catch (error: any) {
        console.error('加入购物车失败:', error);
        Taro.showToast({
          title: error?.message || '加入购物车失败，请重试',
          icon: 'none'
        });
      } finally {
        setIsAddingToCart(false);
      }
    });
  }, [commodity, quantity, selectedSpecs, validateProduct, requireAuth, isAddingToCart]);

  // 立即购买
  const handleBuyNow = useCallback(() => {
    if (!validateProduct()) return;

    requireAuth(async () => {
      if (isBuying) return;

      try {
        setIsBuying(true);

        const res = await orderApi.create({
          commodity_id: commodityId,
          quantity,
          sku: selectedSpecs,
          address_id: selectedAddress?.id || 0,
          is_from_cart: false,
        });

        if (res?.order_id) {
          Taro.showToast({
            title: '订单创建成功',
            icon: 'success',
            duration: 1500
          });

          // 延迟跳转，让用户看到成功提示
          setTimeout(() => {
            Taro.navigateTo({
              url: '/pages/payment/index?id=' + res.order_id
            });
          }, 500);
        } else {
          throw new Error('订单创建失败');
        }
      } catch (error: any) {
        console.error('下单失败:', error);
        Taro.showToast({
          title: error?.message || '下单失败，请重试',
          icon: 'none'
        });
      } finally {
        setIsBuying(false);
      }
    });
  }, [commodityId, quantity, selectedSpecs, selectedAddress, validateProduct, requireAuth, isBuying]);

  // 处理数量变化
  const handleQuantityChange = useCallback((value: string | number) => {
    const num = typeof value === 'string' ? parseInt(value) : value;
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    }
  }, []);

  // 加载中状态
  if (isLoading && !commodity) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <View className="text-5xl mb-4 animate-pulse">⏳</View>
          <View className="text-gray-600 font-medium">加载中...</View>
        </View>
      </View>
    );
  }

  // 商品不存在
  if (!commodity) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <View className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <View className="text-5xl mb-4">📭</View>
          <View className="text-gray-600 font-medium mb-4">商品不存在</View>
          <Button
            className="!bg-blue-500 !text-white !border-0 !rounded-lg"
            onClick={() => Taro.navigateBack()}
          >
            返回上一页
          </Button>
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
    <View className="min-h-screen bg-gray-50 pb-[70px]">
      <TopBar
        title="商品详情"
        showBack
        icon={
          <View className='flex flex-row gap-3'>
            <View onClick={handleCollect} className={isCollecting ? 'opacity-50' : ''}>
              <Fabulous
                size={24}
                color={commodity.is_collect === 1 ? '#ff6b6b' : 'white'}
              />
            </View>
          </View>
        }
      />

      {/* 商品图片轮播 */}
      <View className="relative h-[50vh] overflow-hidden bg-white shadow-md">
        {imageList.length > 0 ? (
          <Swiper
            className="h-full"
            height={'100%'}
            defaultValue={0}
            autoPlay={imageList.length > 1}
            indicator
            onChange={(e) => setCurrentImageIndex(e.detail.current)}
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
              <View className="text-5xl mb-2">📷</View>
              <View className="text-sm">暂无图片</View>
            </View>
          </View>
        )}
        {imageList.length > 1 && (
          <View className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
            {currentImageIndex + 1} / {imageList.length}
          </View>
        )}
      </View>

      {/* 商品基本信息 */}
      <View className="mt-4 bg-white px-4 py-4 shadow-sm">
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
        {(commodity.is_recommend === 1 || commodity.is_topping === 1) && (
          <View className="flex items-center mb-3 gap-2">
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
        )}

        {/* 商品标题 */}
        <View className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
          {commodity.title}
        </View>

        {/* 销量、分类、库存 */}
        <View className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
          <View>已售 {commodity.sales || 0} 件</View>
          <View>|</View>
          <View>分类：{commodity.category || '未分类'}</View>
          <View>|</View>
          <View className={currentStock < 10 ? 'text-red-500' : ''}>
            库存：{currentStock}
            {currentStock < 10 && currentStock > 0 && ' (即将售罄)'}
            {currentStock === 0 && ' (已售罄)'}
          </View>
        </View>
      </View>

      {/* 地址选择 */}
      <Address selected={setSelectedAddress} />

      {/* 规格选择 */}
      {commodity.sku && Object.keys(commodity.sku as Record<string, string[]>).length > 0 && (
        <View className="mt-4 bg-white px-4 py-3 shadow-sm">
          <View className="text-base font-semibold text-gray-900 mb-3">选择规格</View>
          {Object.entries(commodity.sku as Record<string, string[]>).map(([name, values]) => (
            <View key={name} className="mb-3 last:mb-0">
              <View className="text-sm text-gray-600 mb-2 font-medium">{name}</View>
              <View className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <View
                    key={value}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${selectedSpecs[name] === value
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 active:bg-gray-50'
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
            <View className="text-xs text-red-500 mt-2 flex items-center">
              <View className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></View>
              请选择完整规格
            </View>
          )}
        </View>
      )}

      {/* 商品数量选择 */}
      <View className="mt-4 bg-white px-4 py-3 shadow-sm">
        <View className="flex items-center justify-between">
          <View className="text-base font-semibold text-gray-900">购买数量</View>
          <View className="flex items-center gap-3">
            <InputNumber
              value={quantity}
              min={1}
              max={currentStock > 0 ? currentStock : 999}
              onChange={handleQuantityChange}
              className="w-24"
            />
            <View className="text-sm text-gray-500">剩余 {currentStock} 件</View>
          </View>
        </View>
      </View>

      {/* 商品详情标签页 */}
      <View className="mt-4 bg-white shadow-sm overflow-hidden">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
          <Tabs.TabPane title="商品详情" className='!p-1'>
            <View className="!p-0">
              {commodity.intro && (
                <View
                  className="text-sm text-gray-600 leading-relaxed mb-4 !p-0"
                  dangerouslySetInnerHTML={{ __html: commodity.intro }}
                />
              )}
              {commodity.content && (
                <View className="prose prose-sm max-w-none text-gray-700 !p-0">
                  <View dangerouslySetInnerHTML={{ __html: commodity.content }} />
                </View>
              )}
              {!commodity.intro && !commodity.content && (
                <View className="text-center py-12 text-gray-400">
                  <View className="text-4xl mb-2">📝</View>
                  <View className="text-sm">暂无商品详情</View>
                </View>
              )}
            </View>
          </Tabs.TabPane>

          <Tabs.TabPane title="规格参数">
            <View className="p-4 space-y-3 text-sm">
              <View className="flex justify-between py-2 border-b border-gray-100">
                <View className="text-gray-500">商品编号</View>
                <View className="text-gray-900">{commodity.id}</View>
              </View>
              <View className="flex justify-between py-2 border-b border-gray-100">
                <View className="text-gray-500">分类</View>
                <View className="text-gray-900">{commodity.category || '未分类'}</View>
              </View>
              <View className="flex justify-between py-2 border-b border-gray-100">
                <View className="text-gray-500">发货方式</View>
                <View className="text-gray-900">{commodity.deliveryType || '默认'}</View>
              </View>
              <View className="flex justify-between py-2 border-b border-gray-100">
                <View className="text-gray-500">上架时间</View>
                <View className="text-gray-900">{commodity.create_time}</View>
              </View>
              <View className="flex justify-between py-2">
                <View className="text-gray-500">更新时间</View>
                <View className="text-gray-900">{commodity.update_time}</View>
              </View>
            </View>
          </Tabs.TabPane>
        </Tabs>
      </View>

      {/* 底部操作栏 */}
      <View className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-3 py-2 safe-area-bottom">
        <View className="flex items-center justify-between h-[50px] gap-2">
          <Button
            className='h-full !m-0 !p-2 !shadow-none !flex items-center justify-center !border-0 !bg-transparent'
            onClick={() => Taro.navigateTo({ url: '/pages/category/index' })}
          >
            <View className="flex flex-col items-center gap-1">
              <Store size={24} />
              <View className="text-xs text-gray-600">分类</View>
            </View>
          </Button>

          <Button
            className='h-full !m-0 !p-2 !shadow-none !flex items-center justify-center !border-0 !bg-transparent'
            open-type="contact"
          >
            <View className="flex flex-col items-center gap-1">
              <Service size={24} />
              <View className="text-xs text-gray-600">客服</View>
            </View>
          </Button>

          <View className='ml-auto flex flex-row h-full gap-2'>
            <View
              className={`rounded-lg px-6 bg-orange-500 text-white flex items-center justify-center font-medium transition-opacity ${isAddingToCart || currentStock === 0 ? 'opacity-50' : 'active:opacity-80'
                }`}
              onClick={isAddingToCart || currentStock === 0 ? undefined : handleAddToCart}
            >
              {isAddingToCart ? '加入中...' : '加入购物车'}
            </View>
            <View
              className={`rounded-lg px-6 bg-red-500 text-white flex items-center justify-center font-medium transition-opacity ${isBuying || currentStock === 0 ? 'opacity-50' : 'active:opacity-80'
                }`}
              onClick={isBuying || currentStock === 0 ? undefined : handleBuyNow}
            >
              {isBuying ? '处理中...' : '立即购买'}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CommodityDetail;