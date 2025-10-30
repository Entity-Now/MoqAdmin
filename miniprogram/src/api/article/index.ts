import request from '../../utils/request';
import type {
  _AppHomingAdv,
  ArticlePagesResponse,
  Categories,
  ArticleListsResponse,
  ArticleDetailResponse
} from './types';

const articleApi = {
  /**
   * 轮播海报
   */
  banner(): Promise<_AppHomingAdv[]> {
    return request<_AppHomingAdv[]>({
      url: 'article/banner',
      method: 'GET'
    });
  },
  
  /**
   * 文章页面
   */
  pages(): Promise<ArticlePagesResponse> {
    return request<ArticlePagesResponse>({
      url: 'article/pages',
      method: 'GET'
    });
  },
  
  /**
   * 获取分类列表
   */
  categories(): Promise<Categories[]> {
    return request<Categories[]>({
      url: 'article/category',
      method: 'GET'
    });
  },
  
  /**
   * 文章列表
   * 
   * @param {Object} params
   * @param {number} params.page - 当前页码
   * @param {number} params.cid - 所属类目
   * @param {string} params.keyword - 文章标题
   * @returns {Promise<ArticleListsResponse>}
   */
  lists(params: {
    page?: number;
    cid?: number;
    keyword?: string;
  }): Promise<ArticleListsResponse> {
    return request<ArticleListsResponse>({
      url: 'article/lists',
      method: 'GET',
      data: params
    });
  },
  
  /**
   * 文章详情
   * 
   * @param {number} id - 文章ID
   * @returns {Promise<ArticleDetailResponse>}
   */
  detail(id: number): Promise<ArticleDetailResponse> {
    return request<ArticleDetailResponse>({
      url: 'article/detail',
      method: 'GET',
      data: { id }
    });
  },
  
  /**
   * 文章收藏
   * 
   * @param {number} id - 文章ID
   * @returns {Promise<any>}
   */
  collect(id: number): Promise<any> {
    return request({
      url: 'article/collect',
      method: 'POST',
      data: { id }
    });
  }
};

export default articleApi;