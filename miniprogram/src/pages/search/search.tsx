import Taro from '@tarojs/taro';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Button } from '@tarojs/components';
import { SearchBar, Price, Menu, InputNumber } from '@nutui/nutui-react-taro';
import { ProductFeed } from '@nutui/nutui-biz';
import * as api from '../../api/home';
import './search.scss'; // 引入Tailwind CSS

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
    per_page: 10,
    total: 0,
    lists: [],
  });
  const [searchResults, setSearchResults] = useState<GoodsItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);

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

  const loadMoreData = () => {
    if (pageInfo.current_page >= pageInfo.last_page || isSearching) return;

    setIsSearching(true);

    api.searchGoods({
      page: pageInfo.current_page + 1,
      size: pageInfo.per_page,
      keyword: filter.keyword?.trim(),
      cid: filter.cid ? Number(filter.cid) : undefined,
      sort: filter.sort,
    })
      .then((res) => {
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
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const refresh = () => {
    if ((!filter.keyword?.trim() && !filter.cid) || isSearching) return;
    performSearch();
  };

  const setCurrentCategory = (cid: string, categoryName: string) => {
    const updatedFilter = { ...filter, cid, categoryName };
    setFilter(updatedFilter);
    Taro.redirectTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(updatedFilter.keyword?.trim() || '')}&cid=${cid}&categoryName=${encodeURIComponent(categoryName)}&min_price=${updatedFilter.min_price}&max_price=${updatedFilter.max_price}&sort=${updatedFilter.sort}`,
    });
  };

  const handleFilterChange = (newFilter: Partial<typeof filter>) => {
    setFilter({ ...filter, ...newFilter });
  };

  const handleGoBack = () => {
    Taro.navigateBack();
  };

  useEffect(() => {
    performSearch();
    if (searchResults.length === 0) {
      api.guessCategories(10).then((res) => {
        setCategoryList(res || []);
      });
    }
  }, []);

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

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View className="empty-container flex flex-col items-center justify-center py-10 text-cloud-600">
          <View className="empty-icon text-4xl mb-2">🔍</View>
          <View className="empty-text text-base font-medium">请输入关键词搜索商品</View>
          <View className="empty-hint text-sm text-cloud-400">试试搜索"手机"、"笔记本"等</View>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View className="empty-container flex flex-col items-center justify-center py-10 text-cloud-600">
          <View className="loading-icon text-4xl mb-2">⏳</View>
          <View className="empty-text text-base font-medium">正在搜索中...</View>
        </View>
      );
    }

    return (
      <View className="empty-container flex flex-col items-center justify-center py-10 text-cloud-600">
        <View className="empty-icon text-4xl mb-2">📭</View>
        <View className="empty-text text-base font-medium">未找到相关商品</View>
        <View className="empty-hint text-sm text-cloud-400">换个关键词试试吧</View>
      </View>
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
    <View className="min-h-screen flex flex-col bg-cloud-50">
      {/* 搜索头部区域 */}
      <View className="sticky top-0 z-50 bg-cotton-candy shadow-lg">
        <View className="flex items-center px-4 py-3 space-x-3">
          {/* 返回按钮 */}
          <View
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-white bg-opacity-20 rounded-full active:bg-opacity-30 transition-all cursor-pointer"
            onClick={handleGoBack}
          >
            <View className="text-white text-xl font-bold">←</View>
          </View>

          {/* 搜索框 */}
          <View className="flex-1">
            <SearchBar
              placeholder="请输入关键词搜索"
              value={filter.keyword}
              onChange={(value) => handleFilterChange({ keyword: value })}
              onSearch={performSearch}
              onClear={() => {
                handleFilterChange({ keyword: '' });
                performSearch();
              }}
              shape="round"
              clearable
              className="search-input-custom !bg-white !rounded-full !shadow-sm"
            />
          </View>
        </View>

        {/* 搜索结果统计 */}
        {hasSearched && !isSearching && searchResults.length > 0 && (
          <View className="px-4 pb-3 text-center">
            <View className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs">
              找到 <text className="mx-1 font-bold">{pageInfo.total}</text> 个相关商品
            </View>
          </View>
        )}
      </View>

      {/* 筛选栏 */}
      <Menu className="filter-menu-custom !bg-transparent" >
        <Menu.Item
          key="sort"
          title={
            <View className="flex items-center justify-center space-x-1">
              <View className="text-sm text-cloud-600">
                {filter.sort === 0 ? '默认排序' : '销量排序'}
              </View>
              <View className="text-xs text-sakura-500">▼</View>
            </View>
          }
          defaultValue={filter.sort}
          options={[
            { text: '默认排序', value: 0 },
            { text: '销量排序', value: 1 },
          ]}
          onChange={(value) => {
            handleFilterChange({ sort: value });
            performSearch();
          }}
        />
        <Menu.Item
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
                <InputNumber
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
                <InputNumber
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
              className="w-full bg-sakura-400 text-white font-medium py-1 rounded-lg shadow-md active:shadow-sm transition-all hover:bg-sakura-500"
              onClick={performSearch}
            >
              确定筛选
            </Button>
          </View>
        </Menu.Item>
      </Menu>

      {/* 搜索结果列表 */}
      <View className="flex-1 overflow-y-auto">
        {searchResults.length > 0 ? (
          <View className="search-results px-4 py-3">
            <View className="product-feed">
              <ProductFeed
                data={searchResults}
                infiniteloadingProps={{
                  hasMore: pageInfo.current_page < pageInfo.last_page,
                  isOpenRefresh: true,
                  onLoadMore: loadMoreData,
                  onRefresh: refresh,
                }}
                imgWidth="100%"
                imgHeight='80%'
                customProduct={customProductDouble}
                imgUrl="imgUrl"
                col={2}
              />
            </View>
          </View>
        ) : (
          <View className="px-4">
            {renderEmptyState()}
            {renderGuessCategories()}
          </View>
        )}
      </View>
    </View>
  );
}

export default Index;