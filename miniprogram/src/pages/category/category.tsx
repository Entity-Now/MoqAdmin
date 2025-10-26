import Taro from '@tarojs/taro'
import React, { useState, useEffect } from 'react'
import { View } from '@tarojs/components'
import { NavBar, SearchBar } from '@nutui/nutui-react-taro'
import { Share } from '@nutui/icons-react-taro'
import { Category } from '@nutui/nutui-biz';
import { categories } from '../../api/home';
import './category.scss'
function Index() {
  const [category, setCategory] = useState<any[]>([]);
  
  const searchGoods = () => {
    Taro.navigateTo({
      url: '/pages/search/search',
    });
  };

  useEffect(() => {
    categories().then(res => {
      setCategory(res || []);
    });
  }, []);
  
  return <>
  <View className="flex flex-col h-full">
    <NavBar right={<Share />}>
      <SearchBar placeholder='请输入搜索内容' className='search-input-custom' onFocus={searchGoods} />
    </NavBar>
    <View className='w-full h-full flex-1'>
      <Category style={{height: '100%'}} category={category}/>
    </View>
  </View>
  </>
}

export default Index
