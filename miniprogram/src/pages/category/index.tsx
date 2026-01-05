import Taro from '@tarojs/taro';
import { useLoad } from '@tarojs/taro'
import React, { useState, useCallback } from 'react';
import { View, Image, ScrollView } from '@tarojs/components';
import { Sidebar } from '@taroify/core';
import { categories } from '../../api/home';
import TopBar from '../../components/TopBar';
import './index.scss';
const Index: React.FC = () => {
  const [category, setCategory] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState(0);

  // 加载分类数据
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await categories();
      setCategory(res || []);
    } catch (err) {
      setError('加载分类失败，请稍后重试');
      console.error('Fetch categories error:', err);
      Taro.showToast({
        title: '加载失败',
        icon: 'error',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useLoad(() => {
    fetchCategories();
  });


  // 分类跳转
  const handleCategoryClick = useCallback((item: any) => {
    Taro.navigateTo({
      url: `/pages/search/index?cid=${item.catId}&categoryName=${encodeURIComponent(item.catName)}`,
    });
  }, []);

  // 渲染加载状态
  if (loading) {
    return (
      <View className="flex flex-col min-h-screen h-full items-center justify-center">
        <View className="text-center text-gray-500">加载中...</View>
      </View>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <View className="flex flex-col min-h-screen h-full items-center justify-center">
        <View className="text-center text-red-500 mb-4">{error}</View>
        <View
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={fetchCategories}
        >
          重新加载
        </View>
      </View>
    );
  }

  const currentCategory = category[activeKey];

  return (
    <View className="flex flex-col h-screen">
      {/* 导航栏 */}
      <TopBar title="分类" showSearch />

      {/* 分类侧边栏 */}
      <View className="w-full h-full flex-1 overflow-hidden flex flex-row">
        <ScrollView scrollY className="w-auto h-full bg-gray-50">
          <Sidebar value={activeKey} onChange={setActiveKey} className="w-full">
            {category.map((item, index) => (
              <Sidebar.Tab key={item.catId || index}>
                {item.catName}
              </Sidebar.Tab>
            ))}
          </Sidebar>
        </ScrollView>
        <ScrollView scrollY className="flex-1 h-full bg-white p-3">
          {currentCategory && currentCategory.children.map((child, childIndex) => (
            <View key={childIndex} className="mb-4 last:mb-0">
              {/* 子分类标题 */}
              <View className="text-sm text-gray-900 mb-2 font-bold">
                {child.catName}
              </View>

              {/* 孙分类网格 */}
              <View className="grid grid-cols-2 gap-3">
                {child.children.map((grandchild, grandchildIndex) => (
                  <View
                    key={grandchild.catId || grandchildIndex}
                    className="flex flex-col items-center cursor-pointer hover:bg-gray-50 rounded transition-colors"
                    onClick={() => handleCategoryClick(grandchild)}
                  >
                    {/* 16:9 图片容器 */}
                    <View className="relative w-full rounded mb-1 aspect-video bg-gray-100 overflow-hidden">
                      <Image
                        src={grandchild.backImg}
                        mode="aspectFill"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        lazyLoad
                      />
                    </View>
                    <View className="text-xs text-gray-800 text-center line-clamp-2">
                      {grandchild.catName}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Index;