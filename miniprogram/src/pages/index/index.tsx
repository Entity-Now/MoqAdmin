import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
} from '@tarojs/components';
import { QuickEnter, ProductFeed } from '@nutui/nutui-biz';
import { Price, SearchBar, Sticky, Swiper } from '@nutui/nutui-react-taro';
import * as api from '../../api/home';
import Taro from '@tarojs/taro';
import TopBar from '../../components/TopBar';

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

  useEffect(() => {
    api.getMiniHomePages().then((res) => {
      const { banner, goods, quickEnter } = res || {};
      setBanner(banner || []);
      setRecommendGoods(transformGoodsData(goods.lists || []));
      setRecommendPageInfo({
        total: goods.total || 0,
        current_page: goods.current_page || 1,
        last_page: goods.last_page || 1,
        per_page: goods.per_page || 10,
        lists: goods.lists || [],
      });
      setQuickEnter(
        quickEnter.map((it) => ({
          displayName: it.title,
          imageUrl: it.image || '',
        })) || []
      );
    });

    api.getRecommendGoods({
      page: 1,
      size: 6,
      type: GoodsType.TOPPING,
    }).then((res) => {
      const { lists } = res || {};
      setToppingGoods(transformGoodsData(lists || []));
    });

    api.getRecommendGoods({
      page: 1,
      size: 10,
      type: GoodsType.RANKING,
    }).then((res) => {
      const { lists } = res || {};
      setRankingGoods(transformGoodsData(lists || []));
    });
  }, []);

  const loadMoreData = () => {
    if (recommendPageInfo.current_page >= recommendPageInfo.last_page) return;

    api.getRecommendGoods({
      page: recommendPageInfo.current_page + 1,
      size: recommendPageInfo.per_page,
      type: GoodsType.RECOMMEND,
    }).then((res) => {
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
    });
  };

  const refresh = () => {
    setRecommendGoods([]);
    setRecommendPageInfo({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      lists: [],
    });

    api.getRecommendGoods({
      page: 1,
      size: 10,
      type: GoodsType.RECOMMEND,
    }).then((res) => {
      const { lists, current_page, last_page, per_page, total } = res || {};
      const transformedGoods = transformGoodsData(lists || []);
      setRecommendGoods(transformedGoods);
      setRecommendPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: lists || [],
      });
    });
  };
  
  const goToDetail = (item: GoodsItem) => {
    Taro.navigateTo({
      url: '/pages/product/index?id=' + item.id,
    });
  };
  
  const customProductDouble = (item: GoodsItem) => {
    return (
      <View className="product-card bg-white rounded-lg overflow-hidden mb-3 shadow-sm transition-transform duration-300 active:scale-[0.98]">
        <View className="product-card-content p-2">
          <View className="name-box text-sm text-cloud-600 line-clamp-2 leading-tight">{item.name}</View>
          {item.tag && (
            <View className="tag-box mb-2">
              <View className="tag-label inline-block bg-lemon-100 text-lemon-600 px-2 py-0.5 rounded text-[11px] font-medium">
                {item.tag}
              </View>
            </View>
          )}
          <View className="bottom flex items-end justify-between">
            <View className="price-box">
              <Price
                price={item.price}
                size="normal"
                symbol="¥"
                className="text-sakura-500 font-bold"
              />
            </View>
            {item.label && (
              <View className="label-box">
                <View className="label-tag bg-mermaid-wave text-white px-2 py-0.5 rounded text-[10px] font-medium">
                  {item.label}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderToppingGoods = () => {
    if (!toppingGoods || toppingGoods.length === 0) return null;

    return (
      <View className="topping-section bg-cotton-candy mt-2.5 pb-4 rounded-lg">
        <View className="section-header px-4 pt-5 pb-3">
          <View className="header-title flex items-center mb-1">
            <View className="title-icon text-xl mr-1.5 text-white">🔥</View>
            <View className="title-text text-lg font-bold text-white">精选置顶</View>
          </View>
          <View className="header-subtitle text-xs text-white/80 ml-[26px]">
            品质优选·限时推荐
          </View>
        </View>
        <View className="topping-scroll flex overflow-x-auto px-4 gap-3 scrollbar-none">
          {toppingGoods.map((item) => (
            <View
              key={item.id}
              onClick={() => goToDetail(item)}
              className="topping-card relative flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <View className="topping-badge absolute top-2.5 left-2.5 bg-sunset-glow text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
                置顶
              </View>
              <Image
                className="topping-image w-full h-[200px] object-cover"
                src={item.imgUrl}
                mode="aspectFill"
              />
              <View className="topping-info p-3">
                <View className="topping-name text-sm font-medium text-cloud-600 line-clamp-2 mb-1.5">
                  {item.name}
                </View>
                {item.tag && (
                  <View className="topping-tag inline-block bg-mint-100 text-mint-600 px-2 py-0.5 rounded text-[11px] mb-2">
                    {item.tag}
                  </View>
                )}
                <View className="topping-bottom flex items-center justify-between">
                  <View className="topping-price">
                    <Price
                      price={item.price}
                      size="large"
                      symbol="¥"
                      className="text-sakura-500 font-bold"
                    />
                  </View>
                  <View className="topping-label bg-mermaid-wave text-white px-2 py-0.5 rounded text-[10px]">
                    {item.label}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRankingGoods = () => {
    if (!rankingGoods || rankingGoods.length === 0) return null;

    return (
      <View className="ranking-section bg-white mt-2.5 pb-4 rounded-lg shadow-sm">
        <View className="section-header px-4 pt-5 pb-3">
          <View className="header-title flex items-center mb-1">
            <View className="title-icon text-xl mr-1.5 text-sakura-500">🏆</View>
            <View className="title-text text-lg font-bold text-cloud-600">热销排行</View>
          </View>
          <View className="header-subtitle text-xs text-cloud-400 ml-[26px]">
            人气爆款·销量保证
          </View>
        </View>
        <View className="ranking-list px-4">
          {rankingGoods.map((item, index) => (
            <View
              key={item.id}
              onClick={() => goToDetail(item)}
              className="ranking-item flex items-center py-3 border-b border-cloud-200 last:border-b-0"
            >
              <View
                className={`ranking-number w-10 h-10 flex items-center justify-center flex-shrink-0 mr-3 ${
                  index < 3 ? 'top-three' : ''
                }`}
              >
                {index < 3 ? (
                  <View className="medal-icon text-2xl">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                  </View>
                ) : (
                  <View className="number-text text-base font-bold text-cloud-400">
                    {index + 1}
                  </View>
                )}
              </View>
              <Image
                className="ranking-image w-20 h-20 rounded-lg flex-shrink-0 mr-3"
                src={item.imgUrl}
                mode="aspectFill"
              />
              <View className="ranking-info flex-1 min-w-0">
                <View className="ranking-name text-sm font-medium text-cloud-600 line-clamp-2 leading-tight mb-1">
                  {item.name}
                </View>
                {item.tag && (
                  <View className="ranking-tag inline-block bg-lemon-100 text-lemon-600 px-1.5 py-0.5 rounded text-[10px] mb-1.5">
                    {item.tag}
                  </View>
                )}
                <View className="ranking-bottom flex items-center justify-between">
                  <View className="ranking-price">
                    <Price
                      price={item.price}
                      size="normal"
                      symbol="¥"
                      className="text-sakura-500 font-bold"
                    />
                  </View>
                  <View className="ranking-label bg-cloud-100 text-cloud-600 px-1.5 py-0.5 rounded text-[10px]">
                    {item.label}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View className="relative container-index min-h-screen bg-cloud-50 pb-5">
      {/* 搜索框 */}
      <TopBar title="首页" showSearch>
      </TopBar>

      {/* banner 广告 */}
      <Swiper className="banner w-full h-[180px] bg-sakura-dream rounded-lg" autoplay indicator>
        {banner.map((item, index) => (
          <Swiper.Item key={index}>
            <Image
              style={{ width: '100%', height: '100%' }}
              onClick={() => console.log(index)}
              src={item.image || ''}
            />
          </Swiper.Item>
        ))}
      </Swiper>

      {/* 快速入口 */}
      {quickEnter && quickEnter.length > 0 && (
        <View className="quick-enter bg-white mt-2.5 pt-2.5 rounded-lg shadow-sm">
          <QuickEnter columns={4} data={quickEnter} />
        </View>
      )}

      {/* 置顶商品区域 */}
      {renderToppingGoods()}

      {/* 排行商品区域 */}
      {renderRankingGoods()}

      {/* 推荐商品流 */}
      {recommendGoods && recommendGoods.length > 0 && (
        <View className="recommend-section bg-white mt-2.5 pb-4 rounded-lg shadow-sm">
          <View className="section-header px-4 pt-5 pb-3">
            <View className="header-title flex items-center mb-1">
              <View className="title-icon text-xl mr-1.5 text-sakura-500">💎</View>
              <View className="title-text text-lg font-bold text-cloud-600">为你推荐</View>
            </View>
            <View className="header-subtitle text-xs text-cloud-400 ml-[26px]">
              猜你喜欢·更多精彩
            </View>
          </View>
          <View className="product-feed px-4">
            <ProductFeed
              data={recommendGoods}
              infiniteloadingProps={{
                hasMore: recommendPageInfo.current_page < recommendPageInfo.last_page,
                isOpenRefresh: true,
                onLoadMore: loadMoreData,
                onRefresh: refresh,
              }}
              imgWidth="100%"
              imgHeight='80%'
              customProduct={customProductDouble}
              imgUrl="imgUrl"
                onClick={goToDetail}
                onImageClick={goToDetail}
              col={2}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default Index;