import Taro from '@tarojs/taro';
import { useLoad } from '@tarojs/taro'
import { useState, useCallback } from 'react';
import { View } from '@tarojs/components';
import { Search, DropdownMenu, Stepper, List, Button, Empty } from '@taroify/core';
import * as api from '../../api/home';
import commodityApi from '../../api/commodity';
import TopBar from '../../components/TopBar/index';
import './index.scss'; // 引入Tailwind CSS
import { GoodsItem } from '../../components/Good';
import { Photograph } from '@nutui/icons-react-taro';
import SearchByImage from '../../components/SearchByImage';

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
  const routerParams = Taro.getCurrentInstance()?.router?.params || {};

  const [filter, setFilter] = useState<any>({
    min_price: Number(routerParams.min_price) || 0,
    max_price: Number(routerParams.max_price) || 100000,
    keyword: routerParams.keyword || '',
    cid: routerParams.cid || '',
    categoryName: routerParams.categoryName || '',
    sort: Number(routerParams.sort) || 0,
  });

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
    lists: [],
  });
  const [searchResults, setSearchResults] = useState<GoodsItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [openCamera, setOpenCamera] = useState(false);

  const transformGoodsData = (lists: any[]): GoodsItem[] => {
    return lists.map((it) => ({
      id: it.id || '',
      imgUrl: it.main_image || it.image,
      name: it.title || '',
      price: it.price || 0,
      tag: it.category || '',
      label: '厂家直发',
    }));
  };

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const performSearch = useCallback(
    debounce(() => {
      if ((!filter.keyword?.trim() && !filter.cid) || filter.min_price > filter.max_price) {
        Taro.showToast({
          title: '请输入搜索关键词或选择分类',
          icon: 'none',
        });
        return;
      };

      setIsSearching(true);
      setHasSearched(true);
      setSearchResults([]);
      setPageInfo({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        lists: [],
      });

      api.searchGoods({
        page: 1,
        size: 10,
        min_price: filter.min_price,
        max_price: filter.max_price,
        keyword: filter.keyword?.trim(),
        cid: filter.cid ? Number(filter.cid) : undefined,
        sort: filter.sort,
      })
        .then((res) => {
          const { lists, current_page, last_page, per_page, total } = res || {};
          const transformedGoods = transformGoodsData(lists || []);

          setSearchResults(transformedGoods);
          setPageInfo({
            current_page: current_page || 1,
            last_page: last_page || 1,
            per_page: per_page || 10,
            total: total || 0,
            lists: lists || [],
          });
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300),
    [filter]
  );

  const loadMoreData = async (done?: () => void) => {
    if (pageInfo.current_page >= pageInfo.last_page || isSearching) {
      done?.();
      return;
    }

    try {
      setIsSearching(true);

      const res = await api.searchGoods({
        page: pageInfo.current_page + 1,
        size: pageInfo.per_page,
        keyword: filter.keyword?.trim(),
        cid: filter.cid ? Number(filter.cid) : undefined,
        sort: filter.sort,
      });
      const { lists, current_page, last_page, per_page, total } = res || {};
      const transformedGoods = transformGoodsData(lists || []);

      setSearchResults((prevResults) => [...prevResults, ...transformedGoods]);
      setPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: [...pageInfo.lists, ...(lists || [])],
      });
    } catch (err: any) {
      console.error('Load more error:', err);
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
      });
    } finally {
      setIsSearching(false);
      done?.();
    }
  };

  const handleImageSearch = async (filePath: string) => {
    try {
      setIsSearching(true);
      setHasSearched(true);
      const res = await commodityApi.searchImage(filePath);

      const { lists, current_page, last_page, per_page, total } = res || {};
      // Assuming the response structure for searchImage is similar to lists/searchGoods
      // If the API returns a different structure, we might need adjustment. 
      // Based on user request "返回值和searchGoods接口一致", we can assume compatibility.

      const transformedGoods = transformGoodsData(lists || []);

      setSearchResults(transformedGoods);
      setPageInfo({
        current_page: current_page || 1,
        last_page: last_page || 1,
        per_page: per_page || 10,
        total: total || 0,
        lists: lists || [],
      });

    } catch (error: any) {
      console.error("Image search failed:", error);
      Taro.showToast({ title: error.message || '搜索失败', icon: 'none' });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const setCurrentCategory = (cid: string, categoryName: string) => {
    const updatedFilter = { ...filter, cid, categoryName };
    setFilter(updatedFilter);
    Taro.redirectTo({
      url: `/pages/search/index?keyword=${encodeURIComponent(updatedFilter.keyword?.trim() || '')}&cid=${cid}&categoryName=${encodeURIComponent(categoryName)}&min_price=${updatedFilter.min_price}&max_price=${updatedFilter.max_price}&sort=${updatedFilter.sort}`,
    });
  };

  const handleFilterChange = (newFilter: Partial<typeof filter>) => {
    setFilter({ ...filter, ...newFilter });
  };

  const goToDetail = (item: GoodsItem) => {

    Taro.navigateTo({
      url: '/pages/product/index?id=' + item.id,
    });
  };

  useLoad(() => {
    performSearch();
    if (searchResults.length === 0) {
      api.guessCategories(10).then((res) => {
        setCategoryList(res || []);
      });
    }
  });

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <Empty className="!bg-cloud-50">
          <View className="text-4xl mb-2">🔍</View>
          <Empty.Description className="text-cloud-600 font-medium">请输入关键词搜索商品</Empty.Description>
          <View className="text-sm text-cloud-400 mt-1">试试搜索"手机"、"笔记本"等</View>
        </Empty>
      );
    }

    if (isSearching) {
      return (
        <Empty className="!bg-cloud-50">
          <View className="text-4xl mb-2">⏳</View>
          <Empty.Description className="text-cloud-600 font-medium">正在搜索中...</Empty.Description>
        </Empty>
      );
    }

    return (
      <Empty className="!bg-cloud-50">
        <View className="text-4xl mb-2">📭</View>
        <Empty.Description className="text-cloud-600 font-medium">未找到相关商品</Empty.Description>
        <View className="text-sm text-cloud-400 mt-1">换个关键词试试吧</View>
      </Empty>
    );
  };

  const renderGuessCategories = () => {
    if (!categoryList || categoryList.length === 0) return null;

    return (
      <View className="w-full px-4 py-5 bg-white rounded-lg shadow-sm mt-4">
        <View className="flex items-center mb-4">
          <View className="text-lg font-semibold text-cloud-600">💡 猜你想搜</View>
        </View>
        <View className="grid grid-cols-2 gap-2.5">
          {categoryList.map((item) => (
            <View
              key={item.value}
              className="bg-sakura-50 p-3.5 rounded-lg border border-sakura-200 active:scale-95 transition-transform cursor-pointer"
              onClick={() => setCurrentCategory(item.value, item.name)}
            >
              <View className="text-sm font-medium text-cloud-600 text-center">{item.name}</View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View id="scroll" className="p-0 overflow-y-auto max-h-[100vh] h-[100vh] flex flex-col bg-cloud-50">

      {/* 搜索结果列表 */}
      <List
        loading={isSearching}
        hasMore={pageInfo.current_page < pageInfo.last_page && searchResults.length > 0}
        onLoad={loadMoreData}
      >
        {/* 搜索头部区域 */}
        <TopBar title="搜索" showBack icon={(
          <>
            <Photograph size={20} className='text-gray-100' color='white' onClick={() => setOpenCamera(true)} />
            <SearchByImage open={openCamera} onClose={() => setOpenCamera(false)} submit={handleImageSearch} />
          </>
        )}>
          <Search
            placeholder="请输入关键词搜索"
            value={filter.keyword}
            onChange={(e) => handleFilterChange({ keyword: e.detail.value })}
            onSearch={performSearch}
            onClear={() => {
              handleFilterChange({ keyword: '' });
              performSearch();
            }}
            shape="round"
            clearable
            className="search-input-custom !bg-white !rounded-full !shadow-sm"
          />
        </TopBar>

        {/* 筛选栏 */}
        <DropdownMenu className="filter-menu-custom !bg-transparent !my-0 h-[35px]">
          <DropdownMenu.Item
            key="sort"
            title={
              <View className="flex items-center justify-center space-x-1">
                <View className="text-sm text-cloud-600">
                  {filter.sort === 0 ? '默认排序' : '销量排序'}
                </View>
                <View className="text-xs text-sakura-500">▼</View>
              </View>
            }
            value={filter.sort}
            options={[
              { title: '默认排序', value: 0 },
              { title: '销量排序', value: 1 },
            ]}
            onChange={(value) => {
              handleFilterChange({ sort: value });
              performSearch();
            }}
          />
          <DropdownMenu.Item
            key="filter"
            title={
              <View className="flex items-center justify-center space-x-1">
                <View className="text-sm text-cloud-600">价格筛选</View>
                <View className="text-xs text-sakura-500">▼</View>
              </View>
            }
          >
            <View className="p-4 bg-white">
              <View className="text-base font-semibold text-cloud-600 mb-3">
                设置价格区间
              </View>
              <View className="flex items-center justify-between space-x-3 mb-4">
                <View className="flex-1 bg-cloud-50 rounded-lg p-2">
                  <View className="text-xs text-cloud-500 mb-1">最低价</View>
                  <Stepper
                    value={filter.min_price}
                    onChange={(value) => handleFilterChange({ min_price: Number(value) })}
                    min={0}
                    max={100000}
                    step={100}
                    className="w-full"
                  />
                </View>
                <View className="text-cloud-400 font-bold">-</View>
                <View className="flex-1 bg-cloud-50 rounded-lg p-2">
                  <View className="text-xs text-cloud-500 mb-1">最高价</View>
                  <Stepper
                    value={filter.max_price}
                    onChange={(value) => handleFilterChange({ max_price: Number(value) })}
                    min={0}
                    max={100000}
                    step={100}
                    className="w-full"
                  />
                </View>
              </View>
              <Button
                color="primary"
                className="w-full bg-sakura-400 text-white font-medium py-1 rounded-lg shadow-md active:shadow-sm transition-all hover:bg-sakura-500"
                onClick={performSearch}
              >
                确定筛选
              </Button>
            </View>
          </DropdownMenu.Item>
        </DropdownMenu>

        {/* 搜索结果统计 */}
        {hasSearched && !isSearching && searchResults.length > 0 && (
          <View className="text-center px-3 py-1 bg-opacity-20 rounded-full text-gray-700 text-xs">
            找到 <text className="mx-1 font-bold">{pageInfo.total}</text> 个相关商品
          </View>
        )}
        {searchResults.length > 0 ? (
          <View className="search-results">
            <View className="product-feed px-4 grid grid-cols-2 gap-3 min-h-[200px] pb-4">
              {searchResults.map((item: any) => (
                <GoodsItem
                  key={item.id}
                  item={item}
                  type="recommend"
                  onClick={goToDetail}
                />
              ))}
            </View>
          </View>
        ) : (
          <View className="px-4">
            {renderEmptyState()}
            {renderGuessCategories()}
          </View>
        )}
        <List.Placeholder>
          {isSearching ? "加载中..." : (pageInfo.current_page >= pageInfo.last_page && searchResults.length > 0 ? "没有更多了" : "")}
        </List.Placeholder>
      </List>
    </View>
  );
}

export default Index;