import React, { useEffect, useState } from 'react'
import {
  Image,
  View,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
} from '@tarojs/components'
import { QuickEnter, ProductFeed } from "@nutui/nutui-biz";
import { Price, SearchBar, Sticky, Swiper } from '@nutui/nutui-react-taro'
import * as api from '../../api/home'
import './index.scss'

// 商品类型枚举
enum GoodsType {
  RECOMMEND = 'recommend',
  TOPPING = 'topping',
  RANKING = 'ranking'
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
  // 推荐商品的分页信息和数据
  const [recommendPageInfo, setRecommendPageInfo] = useState<PageInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    lists: []
  })
  const [recommendGoods, setRecommendGoods] = useState<GoodsItem[]>([])

  // 置顶商品的分页信息和数据
  const [toppingGoods, setToppingGoods] = useState<GoodsItem[]>([])

  // 排行商品的分页信息和数据
  const [rankingGoods, setRankingGoods] = useState<GoodsItem[]>([])

  // 其他状态
  const [banner, setBanner] = useState<any>([])
  const [quickEnter, setQuickEnter] = useState<any>([])

  // 数据转换函数
  const transformGoodsData = (lists: any[]): GoodsItem[] => {
    return lists.map(it => ({
      id: it.id || '',
      imgUrl: it.image?.[0] || '',
      name: it.title || '',
      price: it.price || 0,
      tag: it.category || '',
      label: '厂家直发'
    }))
  }

  // 初始化页面数据
  useEffect(() => {
    api.getMiniHomePages().then((res) => {
      const { banner, goods, quickEnter } = res || {}
      
      // 设置 banner
      setBanner(banner || [])
      
      // 设置推荐商品
      setRecommendGoods(transformGoodsData(goods.lists || []))
      setRecommendPageInfo({
        total: goods.total || 0,
        current_page: goods.current_page || 1,
        last_page: goods.last_page || 1,
        per_page: goods.per_page || 10,
        lists: goods.lists || []
      })
      
      // 设置快速入口
      setQuickEnter(quickEnter.map(it => ({
        displayName: it.title,
        imageUrl: it.image || '',
      })) || [])
    })

    // 加载置顶数据
    api.getRecommendGoods({
      page: 1,
      size: 6,
      type: GoodsType.TOPPING,
    }).then((res) => {
      const { lists } = res || {}
      setToppingGoods(transformGoodsData(lists || []))
    })

    // 加载排行数据
    api.getRecommendGoods({
      page: 1,
      size: 10,
      type: GoodsType.RANKING,
    }).then((res) => {
      const { lists } = res || {}
      setRankingGoods(transformGoodsData(lists || []))
    })
  }, [])

  // 加载更多推荐商品
  const loadMoreData = () => {
    if (recommendPageInfo.current_page >= recommendPageInfo.last_page) return

    api.getRecommendGoods({
      page: recommendPageInfo.current_page + 1,
      size: recommendPageInfo.per_page,
      type: GoodsType.RECOMMEND,
    }).then((res) => {
      const { lists, current_page, last_page, per_page, total } = res || {}
      const transformedGoods = transformGoodsData(lists || [])
      
      setRecommendGoods((prevGoods) => [...prevGoods, ...transformedGoods])
      setRecommendPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: [...recommendPageInfo.lists, ...(lists || [])]
      })
    })
  }

  // 刷新推荐商品
  const refresh = () => {
    setRecommendGoods([])
    setRecommendPageInfo({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      lists: []
    })

    api.getRecommendGoods({
      page: 1,
      size: 10,
      type: GoodsType.RECOMMEND,
    }).then((res) => {
      const { lists, current_page, last_page, per_page, total } = res || {}
      const transformedGoods = transformGoodsData(lists || [])
      
      setRecommendGoods(transformedGoods)
      setRecommendPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: lists || []
      })
    })
  }

  // 推荐商品自定义渲染 - 双列卡片样式
  const customProductDouble = (item: GoodsItem) => {
    return (
      <View className="product-card">
        <View className="product-card-content">
          <View className="name-box">{item.name}</View>
          {item.tag && (
            <View className="tag-box">
              <View className="tag-label">{item.tag}</View>
            </View>
          )}
          <View className="bottom">
            <View className="price-box">
              <Price 
                price={item.price} 
                size="normal"
                symbol="¥"
              />
            </View>
            {item.label && (
              <View className="label-box">
                <View className="label-tag">{item.label}</View>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  // 置顶商品单独渲染 - 大卡片横向滚动
  const renderToppingGoods = () => {
    if (!toppingGoods || toppingGoods.length === 0) return null

    return (
      <View className="topping-section">
        <View className="section-header">
          <View className="header-title">
            <View className="title-icon">🔥</View>
            <View className="title-text">精选置顶</View>
          </View>
          <View className="header-subtitle">品质优选·限时推荐</View>
        </View>
        <View className="topping-scroll">
          {toppingGoods.map((item, index) => (
            <View key={item.id} className="topping-card">
              <View className="topping-badge">置顶</View>
              <Image 
                className="topping-image" 
                src={item.imgUrl} 
                mode="aspectFill"
              />
              <View className="topping-info">
                <View className="topping-name">{item.name}</View>
                {item.tag && <View className="topping-tag">{item.tag}</View>}
                <View className="topping-bottom">
                  <View className="topping-price">
                    <Price price={item.price} size="large" symbol="¥" />
                  </View>
                  <View className="topping-label">{item.label}</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }

  // 排行商品渲染 - 带排名的列表样式
  const renderRankingGoods = () => {
    if (!rankingGoods || rankingGoods.length === 0) return null

    return (
      <View className="ranking-section">
        <View className="section-header">
          <View className="header-title">
            <View className="title-icon">🏆</View>
            <View className="title-text">热销排行</View>
          </View>
          <View className="header-subtitle">人气爆款·销量保证</View>
        </View>
        <View className="ranking-list">
          {rankingGoods.map((item, index) => (
            <View key={item.id} className="ranking-item">
              <View className={`ranking-number ${index < 3 ? 'top-three' : ''}`}>
                {index < 3 ? (
                  <View className="medal-icon">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                  </View>
                ) : (
                  <View className="number-text">{index + 1}</View>
                )}
              </View>
              <Image 
                className="ranking-image" 
                src={item.imgUrl} 
                mode="aspectFill"
              />
              <View className="ranking-info">
                <View className="ranking-name">{item.name}</View>
                {item.tag && <View className="ranking-tag">{item.tag}</View>}
                <View className="ranking-bottom">
                  <View className="ranking-price">
                    <Price price={item.price} size="normal" symbol="¥" />
                  </View>
                  <View className="ranking-label">{item.label}</View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View className="container-index">
      {/* 搜索框 */}
      <Sticky>
        <SearchBar className="search-bar" shape="round" placeholder="请输入搜索内容" />
      </Sticky>

      {/* banner 广告 */}
      <Swiper className="banner" autoplay indicator>
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
        <View className="quick-enter">
          <QuickEnter columns={4} data={quickEnter} />
        </View>
      )}

      {/* 置顶商品区域 */}
      {renderToppingGoods()}

      {/* 排行商品区域 */}
      {renderRankingGoods()}

      {/* 推荐商品流 */}
      {recommendGoods && recommendGoods.length > 0 && (
        <View className="recommend-section">
          <View className="section-header">
            <View className="header-title">
              <View className="title-icon">💎</View>
              <View className="title-text">为你推荐</View>
            </View>
            <View className="header-subtitle">猜你喜欢·更多精彩</View>
          </View>
          <View className="product-feed">
            <ProductFeed 
              data={recommendGoods}
              infiniteloadingProps={{
                hasMore: recommendPageInfo.current_page < recommendPageInfo.last_page,
                isOpenRefresh: true,
                onLoadMore: loadMoreData,
                onRefresh: refresh
              }}
              customProduct={customProductDouble}
              imgUrl="imgUrl"
              col={2} 
            />
          </View>
        </View>
      )}
    </View>
  )
}

export default Index