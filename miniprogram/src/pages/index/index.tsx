import React, { useState, useCallback } from 'react';
import { useLoad, useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import {
  Image,
  View,
  Text,
  Button,
} from '@tarojs/components';
import QuickEnter from '../../components/QuickEnter'
import { Swiper, Loading, Empty, InfiniteLoading } from '@nutui/nutui-react-taro';
import * as api from '../../api/home';
import Taro from '@tarojs/taro';
import TopBar from '../../components/TopBar';
import { GoodsList, GoodsItem } from '../../components/Good'
import softwareImg from '../../images/software.png'
import customerImg from '../../images/customer.png'
import downloadImg from '../../images/download.png'

// 商品类型枚举
enum GoodsType {
  RECOMMEND = 'recommend',
  TOPPING = 'topping',
  RANKING = 'ranking',
}

// 页面信息接口
interface PageInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  lists: any[];
}

// 商品项接口
interface GoodsItem {
  id: string;
  imgUrl: string;
  name: string;
  price: number;
  tag: string;
  label: string;
}
function Index() {

  const [recommendPageInfo, setRecommendPageInfo] = useState<PageInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    lists: [],
  });
  const [recommendGoods, setRecommendGoods] = useState<GoodsItem[]>([]);
  const [toppingGoods, setToppingGoods] = useState<GoodsItem[]>([]);
  const [rankingGoods, setRankingGoods] = useState<GoodsItem[]>([]);
  const [banner, setBanner] = useState<any>([]);
  const [quickEnter, setQuickEnter] = useState<any>([]);

  // 新增状态管理
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

  const transformGoodsData = (lists: any[]): GoodsItem[] => {
    return lists.map((it) => ({
      id: it.id || '',
      imgUrl: it.image?.[0] || '',
      name: it.title || '',
      price: it.price || 0,
      tag: it.category || '',
      label: '厂家直发',
    }));
  };

  // 加载首页数据
  const loadHomeData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [homeRes, recommendRes, toppingRes, rankingRes] = await Promise.all([
        api.getMiniHomePages(),
        api.getRecommendGoods({
          page: 1,
          size: 10,
          type: GoodsType.RECOMMEND,
        }),
        api.getRecommendGoods({
          page: 1,
          size: 6,
          type: GoodsType.TOPPING,
        }),
        api.getRecommendGoods({
          page: 1,
          size: 10,
          type: GoodsType.RANKING,
        }),
      ]);

      // 处理首页数据
      const { banner, quickEnter } = homeRes || {};
      setBanner(banner || []);
      setRecommendGoods(transformGoodsData(recommendRes.lists || []));
      setRecommendPageInfo({
        total: recommendRes.total || 0,
        current_page: recommendRes.current_page || 1,
        last_page: recommendRes.last_page || 1,
        per_page: recommendRes.per_page || 10,
        lists: recommendRes.lists || [],
      });
      // 重置 hasMore 状态
      setHasMore((recommendRes.current_page || 1) < (recommendRes.last_page || 1));
      setQuickEnter(
        quickEnter.map((it) => ({
          displayName: it.title,
          imageUrl: it.image || '',
        })) || []
      );

      // 处理置顶商品
      setToppingGoods(transformGoodsData(toppingRes?.lists || []));

      // 处理排行商品
      setRankingGoods(transformGoodsData(rankingRes?.lists || []));

      if (isRefresh) {
        Taro.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1500,
        });
      }
    } catch (err: any) {
      console.error('Load home data error:', err);
      setError(err.message || '加载失败,请重试');
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useLoad(() => {
    loadHomeData();
  });

  useDidShow(() => {
    // 页面显示时可以选择性刷新数据
    // loadHomeData(true);
  });

  // 设置分享页
  useShareAppMessage(() => {
    return {
      title: '莫欺客优选-莆田鞋图册大全分享',
      path: '/pages/index/index',
    }
  })
  useShareTimeline(() => {
    return {
      title: '莫欺客优选-莆田鞋图册大全分享',
      path: '/pages/index/index',
    }
  })


  const loadMoreData = async (done?: () => void) => {
    console.log('loadMoreData', isInfiniteLoading, hasMore);
    // 防止重复加载
    if (isInfiniteLoading || !hasMore) {
      done?.();
      return;
    }

    try {
      setIsInfiniteLoading(true);
      const res = await api.getRecommendGoods({
        page: recommendPageInfo.current_page + 1,
        size: recommendPageInfo.per_page,
        type: GoodsType.RECOMMEND,
      });
      const { lists, current_page, last_page, per_page, total } = res || {};
      const transformedGoods = transformGoodsData(lists || []);
      setRecommendGoods((prevGoods) => [...prevGoods, ...transformedGoods]);
      setRecommendPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: [...recommendPageInfo.lists, ...(lists || [])],
      });

      // 更新是否还有更多数据
      const hasMoreData = (current_page || 1) < (last_page || 1);
      setHasMore(hasMoreData);
    } catch (err: any) {
      console.error('Load more error:', err);
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
      });
    } finally {
      setIsInfiniteLoading(false);
      done?.();
    }
  };

  const handleRefresh = useCallback(async () => {
    await loadHomeData(true);
  }, [loadHomeData]);

  const goToDetail = (item: GoodsItem) => {
    Taro.navigateTo({
      url: '/pages/product/index?id=' + item.id,
    });
  };

  const renderToppingGoods = () => {
    if (!toppingGoods || toppingGoods.length === 0) return null;
    return (
      <View className="mx-3 mt-2">
        <GoodsList
          key={GoodsType.TOPPING}
          type="topping"
          data={toppingGoods}
          onItemClick={goToDetail}
          title="精选置顶"
          subtitle="品质优选·限时推荐"
          titleIcon="🔥"
          bgClass="bg-cotton-candy"
        />
      </View>
    );
  };

  const renderRankingGoods = () => {
    if (!rankingGoods || rankingGoods.length === 0) return null;
    return (
      <View className="mx-3 mt-2">
        <GoodsList
          key={GoodsType.RANKING}
          type="ranking"
          data={rankingGoods}
          onItemClick={goToDetail}
          title="热销排行"
          subtitle="人气爆款·销量保证"
          titleIcon="🏆"
        />
      </View>
    );
  };

  // 加载状态
  if (loading && !refreshing) {
    return (
      <View className="relative container-index min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <TopBar title="首页" showSearch />
        <View className="flex flex-col items-center justify-center pt-32">
          <Loading type="spinner" />
          <Text className="text-sm text-gray-400 mt-4">加载中...</Text>
        </View>
      </View>
    );
  }

  // 错误状态
  if (error && !refreshing) {
    return (
      <View className="relative container-index min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <TopBar title="首页" showSearch />
        <View className="flex flex-col items-center justify-center pt-32 px-4">
          <Empty description={error} />
          <Button
            className="mt-6 !bg-blue-500 !text-white !rounded-full !px-8 !py-2 transition-transform duration-200 active:scale-95"
            onClick={() => loadHomeData()}
          >
            重新加载
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View id="scroll" className="p-0 overflow-y-auto relative container-index h-[100vh] bg-gradient-to-b from-gray-50 to-white">
      <InfiniteLoading
        target='scroll'
        hasMore={hasMore}
        onLoadMore={loadMoreData}
        loadingText="加载中..."
        loadMoreText="没有更多了"
      >

        {/* 搜索框 */}
        <TopBar title="首页" showSearch />

        {/* Banner 广告 - 紧凑版 */}
        {banner && banner.length > 0 && (
          <View className="px-3 pt-1">
            <Swiper
              className="banner w-full h-[160px] rounded-xl overflow-hidden shadow-md"
              autoplay
              indicator
              loop
              duration={500}
            >
              {banner.map((item, index) => (
                <Swiper.Item key={index}>
                  <View className="relative w-full h-full">
                    <Image
                      style={{ width: '100%', height: '100%' }}
                      onClick={() => {
                        if (item.link) {
                          Taro.navigateTo({ url: item.link });
                        }
                      }}
                      src={item.image || ''}
                      mode="aspectFill"
                    />
                    <View className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </View>
                </Swiper.Item>
              ))}
            </Swiper>
          </View>
        )}

        {/* 网站业务 - 紧凑版 */}
        <View className="px-3 mt-2">
          <View className="flex flex-row gap-2">
            {/* 软件开发卡片 */}
            <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm overflow-hidden border border-blue-100 transition-all duration-300 active:scale-95">
              <View className="p-2.5 flex flex-col items-center">
                <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-1.5">
                  <Image
                    src={softwareImg}
                    className="w-9 h-9 !bg-transparent"
                  />
                </View>
                <Text className="text-sm font-bold text-gray-800 mb-0.5">
                  软件定制开发
                </Text>
                <Text className="text-xs text-gray-500 text-center">
                  价格合适·功能完善
                </Text>
              </View>
            </View>

            {/* 右侧两个小卡片 */}
            <View className="flex-1 flex flex-col gap-2">
              {/* 免费软件下载 */}
              <View className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm overflow-hidden border border-green-100 transition-all duration-300 active:scale-95">
                <View className="p-2 flex flex-row items-center justify-between h-full">
                  <View className="flex flex-col flex-1">
                    <Text className="text-sm font-bold text-gray-800 mb-0.5">
                      免费软件下载
                    </Text>
                    <Text className="text-xs text-gray-500">
                      开源免费软件
                    </Text>
                  </View>
                  <View className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm ml-1.5">
                    <Image
                      src={downloadImg}
                      className="w-7 h-7 !bg-transparent"
                    />
                  </View>
                </View>
              </View>

              {/* 联系客服 */}
              <Button
                className="!flex-1 !bg-gradient-to-br !from-orange-50 !to-amber-50 !rounded-xl !shadow-sm !overflow-hidden !border !border-orange-100 !m-0 !p-0 transition-all duration-300 active:scale-95"
                open-type="contact"
              >
                <View className="p-2 flex flex-row items-center justify-between h-full w-full">
                  <View className="flex flex-col flex-1">
                    <Text className="text-sm font-bold text-gray-800 mb-0.5">
                      联系客服
                    </Text>
                    <Text className="text-xs text-gray-500">
                      有问题?联系我们
                    </Text>
                  </View>
                  <View className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm ml-1.5">
                    <Image
                      src={customerImg}
                      className="w-7 h-7 !bg-transparent"
                    />
                  </View>
                </View>
              </Button>
            </View>
          </View>
        </View>

        {/* 快速入口 - 紧凑版 */}
        {quickEnter && quickEnter.length > 0 && (
          <View className="mx-3 mt-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <View className="px-3 pt-2.5 pb-1">
              <View className="flex flex-row items-center mb-1">
                <View className="w-1 h-3.5 bg-blue-500 rounded-full mr-1.5" />
                <Text className="text-sm font-bold text-gray-800">快速入口</Text>
              </View>
            </View>
            <QuickEnter columns={4} data={quickEnter} />
          </View>
        )}

        {/* 置顶商品区域 */}
        {renderToppingGoods()}

        {/* 排行商品区域 */}
        {renderRankingGoods()}

        {/* 推荐商品流 - 紧凑版 */}
        {recommendGoods && recommendGoods.length > 0 && (
          <View className="mx-3 mt-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <View className="section-header px-3 pt-3 pb-2">
              <View className="header-title flex items-center mb-0.5">
                <View className="w-7 h-7 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mr-1.5">
                  <Text className="text-base">💎</Text>
                </View>
                <View className="title-text text-base font-bold text-gray-800">为你推荐</View>
              </View>
              <View className="header-subtitle text-xs text-gray-500 ml-8.5">
                猜你喜欢·更多精彩
              </View>
            </View>

            {/* 商品列表 */}
            <View className="product-feed px-3 pb-3 grid grid-cols-2 gap-2">
              {recommendGoods.map((item: any) => (
                <GoodsItem
                  key={item.id}
                  item={item}
                  type="recommend"
                  onClick={goToDetail}
                />
              ))}
            </View>

            {/* 没有更多数据提示 */}
            {!hasMore && recommendGoods.length > 0 && (
              <View className="text-center py-2 text-xs text-gray-400">
                没有更多了
              </View>
            )}
          </View>
        )}
      </InfiniteLoading>
    </View>
  );
}

export default Index;