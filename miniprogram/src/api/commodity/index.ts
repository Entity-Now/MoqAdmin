import Taro from "@tarojs/taro";
import request from "../../utils/request";
import type {
  CommodityCategory,
  CommodityListsResponse,
  CommodityDetailResponse,
  CommodityPagesResponse,
  CommodityResultResponse,
} from "./types";
import { useUserStore } from "../../store/useUser";

/**
 * 商品相关API接口
 */
const commodityApi = {
  /**
   * 获取商品页面数据
   * @returns Promise<CommodityPagesResponse>
   */
  pages(): Promise<CommodityPagesResponse> {
    return request<CommodityPagesResponse>({
      url: "commodity/pages",
      showLoading: true,
      loadingText: "加载中...",
    });
  },

  /**
   * 获取商品分类列表
   * @returns Promise<CommodityCategory[]>
   */
  categories(): Promise<CommodityCategory[]> {
    return request<CommodityCategory[]>({
      url: "commodity/category",
    });
  },

  /**
   * 获取商品列表
   * @param params 查询参数
   * @param params.page 当前页码
   * @param params.categoryId 分类ID
   * @param params.keyword 搜索关键词
   * @param params.minPrice 最低价格
   * @param params.maxPrice 最高价格
   * @returns Promise<CommodityListsResponse>
   */
  lists(params: {
    page?: number;
    categoryId?: number | null;
    keyword?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
  }): Promise<CommodityListsResponse> {
    return request<CommodityListsResponse>({
      url: "commodity/lists",
      params,
      showLoading: true,
      loadingText: "加载商品列表...",
    });
  },

  /**
   * 获取商品详情
   * @param id 商品ID
   * @returns Promise<CommodityDetailResponse>
   */
  detail(id: number): Promise<CommodityDetailResponse> {
    return request<CommodityDetailResponse>({
      url: "commodity/detail",
      params: { id },
      showLoading: true,
      loadingText: "加载商品详情...",
    });
  },

  /**
   * 获取相关商品
   * @param id 商品ID
   * @returns Promise<CommodityListsResponse[]>
   */
  related(id: number): Promise<CommodityListsResponse[]> {
    return request<CommodityListsResponse[]>({
      url: "commodity/related",
      params: { id },
    });
  },

  /**
   * 商品收藏/取消收藏
   * @param id 商品ID
   * @returns Promise<any>
   */
  collect(id: number): Promise<any> {
    return request({
      url: "commodity/collect",
      params: { id },
      showLoading: true,
      loadingText: "处理中...",
    });
  },

  /**
   * 以图搜商品
   * @param filePath 图片文件路径
   * @returns Promise<CommodityListsResponse>
   */
  searchImage(filePath: string): Promise<CommodityResultResponse> {
    return new Promise((resolve, reject) => {
      // get token dynamically
      const token = useUserStore.getState().token;

      Taro.uploadFile({
        url:
          (process.env.TARO_APP_API || "http://localhost:8100") +
          "/api/commodity/search_image",
        filePath: filePath,
        name: "file",
        header: {
          Authorization: token ? `Bearer ${token}` : "",
          terminal: 1,
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if (data && data.code == 0) {
              resolve(data.data);
            } else {
              reject(new Error(data.msg || "上传失败"));
            }
          } catch (e) {
            reject(new Error("解析响应失败"));
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
};

export default commodityApi;
