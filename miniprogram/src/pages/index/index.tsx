import React, { useEffect, useState } from 'react';
import { useLoad } from '@tarojs/taro'
import {
  Image,
  View,
  Text,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
  Button,
} from '@tarojs/components';
import QuickEnter from '../../components/QuickEnter'
import { Price, SearchBar, Sticky, Swiper, InfiniteLoading } from '@nutui/nutui-react-taro';
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

  useLoad(() => {
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
  });

  const loadMoreData = async () => {
    if (recommendPageInfo.current_page >= recommendPageInfo.last_page) return;

    var res = await api.getRecommendGoods({
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
  };

  const refresh = async () => {
    setRecommendGoods([]);
    setRecommendPageInfo({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      lists: [],
    });

    var res = await api.getRecommendGoods({
      page: 1,
      size: 10,
      type: GoodsType.RECOMMEND,
    });
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
  };
  
  const goToDetail = (item: GoodsItem) => {
    Taro.navigateTo({
      url: '/pages/product/index?id=' + item.id,
    });
  };
  
  const renderToppingGoods = () => {
    if (!toppingGoods || toppingGoods.length === 0) return null;
    return <GoodsList
    key={GoodsType.TOPPING}
    type="topping"
    data={toppingGoods}
    onItemClick={goToDetail}
  
    title="精选置顶"
    subtitle="品质优选·限时推荐"
    titleIcon="🔥"
    bgClass="bg-cotton-candy"
  />
  };

  const renderRankingGoods = () => {
    if (!rankingGoods || rankingGoods.length === 0) return null;
    return <GoodsList
    key={GoodsType.RANKING}
    type="ranking"
    data={rankingGoods}
    onItemClick={goToDetail}
    title="热销排行"
    subtitle="人气爆款·销量保证"
    titleIcon="🏆"
  />
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
      {/* 网站业务 */}
        <View className="flex flex-row gap-1">
          {/* 软件开发 */}
          <View className="flex flex-col items-center justify-center flex-1 bg-white p-2 rounded-lg shadow-sm">
            <View className='text-md font-bold text-cloud-600'>
              软件定制开发
            </View>
            <Text className="text-xs text-cloud-400">价格合适，功能完善</Text>
            <Image 
              src={softwareImg}
              className="w-12 h-12 rounded-full mt-2 !bg-transparent"
            />
          </View>
          <View className='flex flex-col gap-1 flex-1'>
              {/* 软件列表 */}
              <View className='flex flex-row  items-center justify-between gap-1 bg-white p-2 rounded-lg shadow-sm'>
                <View className='flex flex-col'>
                  <Text className="text-md font-bold text-cloud-600">免费软件下载</Text>
                  <Text className="text-xs text-cloud-400">好用且开源的免费软件</Text>
                </View>
                <Image 
                  src={downloadImg}
                  className="w-12 h-12 rounded-full mt-2 !bg-transparent"
                />
              </View>
              {/* 联系客服 */}
              <Button className='!flex !flex-row  items-center justify-between gap-1 bg-white p-2 rounded-lg shadow-sm' open-type="contact" >
                <View className='flex flex-col'>
                  <Text className="text-md font-bold text-cloud-600">联系客服</Text>
                  <Text className="text-xs text-cloud-400">有问题？联系客服</Text>
                </View>
                <Image 
                  src={customerImg}
                  className="w-12 h-12 rounded-full mt-2 !bg-transparent"
                />
              </Button>
            </View>
        </View>
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
          <InfiniteLoading
            hasMore={recommendPageInfo.current_page < recommendPageInfo.last_page}
            onLoadMore={loadMoreData}
            onRefresh={refresh}
          >
            <View className="product-feed px-4 grid grid-cols-2 gap-3 min-h-[200px]"> {/* grid-cols-2 模拟 col=2 */}
              {recommendGoods.map((item: any) => (
                <GoodsItem
                  key={item.id}
                  item={item}
                  type="recommend"
                  onClick={goToDetail}
                />
              ))}
            </View>
          </InfiniteLoading>
        </View>
      )}
    </View>
  );
}

export default Index;