import React, { useEffect, useState } from 'react'
import {
  Image,
  View,
  CommonEventFunction,
  SwiperProps as TaroSwiperProps,
} from '@tarojs/components'
import { QuickEnter } from "@nutui/nutui-biz";
import { SearchBar, Sticky, Swiper } from '@nutui/nutui-react-taro'
import * as api from '../../api/home'
import './index.scss'
function Index() {
  const [goods, setGoods] = useState<any>([])
  const [banner, setBanner] = useState<any>([])
  const [quickEnter, setQuickEnter] = useState<any>([])

  useEffect(() => {
    api.getMiniHomePages().then((res) => {
      const { banner, goods, quickEnter } = res || {}
      setBanner(banner || [])
      setGoods(goods || [])
      setQuickEnter(quickEnter.map(it=> ({
        displayName: it.title,
        imageUrl: it.image || '',
      })) || [])
    })
  }, [])

  return (
    <View className="container-index">
      {/* 搜索框 */}
      <Sticky>
        <SearchBar className="search-bar" shape="round"  placeholder="请输入搜索内容" />
      </Sticky>
      {/* banner 广告 */}
      <Swiper className="banner" autoplay indicator>
        {banner.map((item, index) => (
          <Swiper.Item key={item}>
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
    </View>
  )
}

export default Index
