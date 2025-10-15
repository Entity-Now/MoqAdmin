import request from '../../utils/request';
import { PagingResult } from '../../../types/result';

// 猜你想搜分类类型
export interface GuessCategoryVo {
  name: string; // 分类名称
  value: number; // 分类ID
}

// 商品列表项类型
export interface CommodityListsVo {
  id: number; // 商品ID
  category: string; // 所属类目
  image: string[]; // 商品图片
  title: string; // 商品标题
  intro: string; // 商品简介
  price: number; // 商品价格
  original_price?: number; // 原价
  fee?: number; // 运费
  stock: number; // 库存数量
  sales: number; // 销量
  browse: number; // 浏览量
  collect: number; // 收藏量
  config?: Record<string, any>; // 动态配置
  sku?: Record<string, any>; // 规格
  is_recommend: number; // 是否推荐: [0=否, 1=是]
  is_topping: number; // 是否置顶: [0=否, 1=是]
  create_time: string; // 创建时间
  update_time: string; // 更新时间
}

// 轮播图数据类型
export interface BannerListVo {
  title: string; // 轮播标题
  image: string; // 轮播图片
  target: string; // 跳转方式
  url?: string; // 跳转链接
  button?: string; // 按钮文字
  desc?: string; // 轮播描述
}

// MiniHome页面数据响应类型
export interface MiniHomePagesVo {
  banner: BannerListVo[]; // 轮播图数据
  goods: PagingResult<CommodityListsVo>; // 推荐商品数据
  quickEnter: BannerListVo[]; // 快速入口数据
}

// 推荐商品列表请求参数类型
export interface GoodsListIn {
  page?: number; // 页码
  size?: number; // 每页条数
  type?: string; // 推荐类型: [recommend=推荐, topping=置顶, ranking=排行]
  sort?: number; // 排序: [0=默认, 1=销量]
  keyword?: string; // 搜索关键词
  cid?: number; // 分类ID
  min_price?: number; // 最低价格
  max_price?: number; // 最高价格
}


// MiniHome页面数据接口
export const getMiniHomePages = async () => {
  return request<MiniHomePagesVo>({
    url: 'minihome/pages',
    method: 'GET',
  });
};

// 推荐商品列表接口
export const getRecommendGoods = async (params: GoodsListIn) => {
  // 构建查询字符串
  const queryParams = new URLSearchParams();
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.type !== undefined) queryParams.append('type', params.type.toString());

  return request<PagingResult<CommodityListsVo>>({
    url: `minihome/goods?${queryParams.toString()}`,
    method: 'GET',
  });
};

// 搜索商品接口
export const searchGoods = async (params: GoodsListIn) => {
  // 构建查询字符串
  const queryParams = new URLSearchParams();
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.keyword !== undefined) queryParams.append('keyword', params.keyword);
  if (params.cid !== undefined) queryParams.append('cid', params.cid.toString());
  if (params.min_price !== undefined) queryParams.append('min_price', params.min_price.toString());
  if (params.max_price !== undefined) queryParams.append('max_price', params.max_price.toString());

  return request<PagingResult<CommodityListsVo>>({
    url: `minihome/search?${queryParams.toString()}`,
    method: 'GET',
  });
};

// 猜你想搜分类列表接口
export const guessCategories = async (limit: number = 10) => {
  return request<GuessCategoryVo[]>({
    url: `minihome/guess-categories?limit=${limit}`,
    method: 'GET',
  });
};