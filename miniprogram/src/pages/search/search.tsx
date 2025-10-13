import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { SearchBar, Price } from '@nutui/nutui-react-taro'
import { ProductFeed } from '@nutui/nutui-biz'
import * as api from '../../api/home'
import './search.scss'

// 商品项接口
interface GoodsItem {
  id: string;
  imgUrl: string;
  name: string;
  price: number;
  tag: string;
  label: string;
}

// 页面信息接口
interface PageInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  lists: any[];
}

function Index() {
  // 搜索关键词状态
  const [keyword, setKeyword] = useState('')
  // 搜索结果的分页信息和数据
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    lists: []
  })
  const [searchResults, setSearchResults] = useState<GoodsItem[]>([])
  // 搜索状态
  const [isSearching, setIsSearching] = useState(false)
  // 是否已经执行过搜索
  const [hasSearched, setHasSearched] = useState(false)

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

  // 执行搜索
  const performSearch = () => {
    if (!keyword.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    setSearchResults([])
    setPageInfo({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      lists: []
    })
    
    api.searchGoods({
      page: 1,
      size: 10,
      keyword: keyword.trim()
    }).then((res) => {
      const { lists, current_page, last_page, per_page, total } = res || {}
      const transformedGoods = transformGoodsData(lists || [])
      
      setSearchResults(transformedGoods)
      setPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: lists || []
      })
    }).finally(() => {
      setIsSearching(false)
    })
  }

  // 加载更多搜索结果
  const loadMoreData = () => {
    if (pageInfo.current_page >= pageInfo.last_page || isSearching) return
    
    setIsSearching(true)
    
    api.searchGoods({
      page: pageInfo.current_page + 1,
      size: pageInfo.per_page,
      keyword: keyword.trim()
    }).then((res) => {
      const { lists, current_page, last_page, per_page, total } = res || {}
      const transformedGoods = transformGoodsData(lists || [])
      
      setSearchResults((prevResults) => [...prevResults, ...transformedGoods])
      setPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: [...pageInfo.lists, ...(lists || [])]
      })
    }).finally(() => {
      setIsSearching(false)
    })
  }

  // 刷新搜索结果
  const refresh = () => {
    if (!keyword.trim() || isSearching) return
    performSearch()
  }

  // 搜索商品自定义渲染 - 双列卡片样式
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

  // 渲染空状态
  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View className='empty-container'>
          <View className='empty-icon'>🔍</View>
          <View className='empty-text'>请输入关键词搜索商品</View>
          <View className='empty-hint'>试试搜索"手机"、"笔记本"等</View>
        </View>
      )
    }
    
    if (isSearching) {
      return (
        <View className='empty-container'>
          <View className='loading-icon'>⏳</View>
          <View className='empty-text'>正在搜索中...</View>
        </View>
      )
    }
    
    return (
      <View className='empty-container'>
        <View className='empty-icon'>📭</View>
        <View className='empty-text'>未找到相关商品</View>
        <View className='empty-hint'>换个关键词试试吧</View>
      </View>
    )
  }

  return (
    <View className='search-page'>
      {/* 搜索框 */}
      <View className='search-header'>
        <SearchBar
          placeholder="请输入关键词搜索"
          value={keyword}
          onChange={(value) => setKeyword(value)}
          onSearch={performSearch}
          onClear={() => {
            setKeyword('')
            setSearchResults([])
            setHasSearched(false)
            setPageInfo({
              current_page: 1,
              last_page: 1,
              per_page: 10,
              total: 0,
              lists: []
            })
          }}
          shape="round"
          clearable
        />
        {/* 搜索结果统计 */}
        {hasSearched && !isSearching && searchResults.length > 0 && (
          <View className='search-stats'>
            找到 <text className='stats-number'>{pageInfo.total}</text> 个相关商品
          </View>
        )}
      </View>
      
      {/* 搜索结果列表 */}
      <View className='search-results'>
        {searchResults.length > 0 ? (
          <View className="product-feed">
            <ProductFeed
              data={searchResults}
              infiniteloadingProps={{
                hasMore: pageInfo.current_page < pageInfo.last_page,
                isOpenRefresh: true,
                onLoadMore: loadMoreData,
                onRefresh: refresh
              }}
              imgWidth='100%'
              customProduct={customProductDouble}
              imgUrl="imgUrl"
              col={2}
            />
          </View>
        ) : (
          renderEmptyState()
        )}
      </View>
    </View>
  )
}

export default Index