import Taro from "@tarojs/taro";
import { errorEnum } from "../enums/errors";
import feedback from "./feedback";
import useUserStore from "../store/useUser";

// 创建请求实例
const requestInstance = Taro.request;

// 请求配置
const defaultConfig = {
  // 基础URL
  baseURL: process.env.TARO_APP_API || "http://localhost:8100",
  // api Prefix
  prefix: "/api",
  // 默认请求头
  header: {
    "Content-Type": "application/json",
    // 终端类型
    terminal: 1, // 1: 小程序端
  },
  // 请求超时时间
  timeout: 30000,
  // 是否显示加载状态
  showLoading: false,
  // 加载状态文字
  loadingText: "加载中...",
  // 是否显示错误信息
  showError: true,
  // 是否处理响应数据
  isTransformResponse: true,
};

// 创建请求方法
export interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
  data?: any;
  params?: any;
  headers?: any;
  showLoading?: boolean;
  loadingText?: string;
  showError?: boolean;
  isTransformResponse?: boolean;
  [key: string]: any;
}

export interface ResponseData<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 生成完整的API URL
 * @param url 请求地址
 * @param params 查询参数
 * @returns 完整的URL字符串
 */
const generateUrl = (url: string, params?: any): string => {
  // 如果是完整URL则直接返回
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // 构建基础URL
  const baseURL = defaultConfig.baseURL;
  const prefix = defaultConfig.prefix;

  // 合并基础URL和请求路径
  let fullUrl = "";
  if (url.startsWith("/")) {
    fullUrl = `${baseURL}${url}`;
  } else {
    fullUrl = `${baseURL}${prefix}/${url}`;
  }

  // 添加查询参数
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      fullUrl = `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  return fullUrl;
};

/**
 * 获取token
 * @returns token字符串或undefined
 */
const getToken = (): string | undefined => {
  try {
    const token = useUserStore.getState().token;
    return token || undefined;
  } catch (error) {
    console.error("获取token失败:", error);
    return undefined;
  }
};

const removeToken = () => {
  useUserStore.getState().setToken("");
};

/**
 * 处理请求参数
 * @param options 请求选项
 * @returns 处理后的请求选项
 */
const handleRequestOptions = (options: RequestOptions): RequestOptions => {
  const { url, params, header = {}, ...restOptions } = options;

  // 生成完整URL
  const fullUrl = generateUrl(url, params);

  // 合并请求头
  const token = getToken();
  const mergedHeaders = {
    ...defaultConfig.header,
    ...header,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return {
    url: fullUrl,
    header: mergedHeaders,
    timeout: defaultConfig.timeout,
    ...restOptions,
  };
};

/**
 * 处理响应数据
 * @param response 响应对象
 * @param isTransformResponse 是否处理响应数据
 * @returns 处理后的响应数据
 */
const handleResponse = <T = any>(
  response: any,
  isTransformResponse: boolean = defaultConfig.isTransformResponse
): T | ResponseData<T> => {
  if (isTransformResponse) {
    const { data } = response;
    if (data && typeof data === "object") {
      // 检查是否符合标准响应格式
      if ("code" in data && "msg" in data) {
        return data as ResponseData<T>;
      }
    }
    // 如果不符合标准格式，则包装成标准格式
    return {
      code: errorEnum.SUCCESS,
      msg: "success",
      data: response.data as T,
    } as ResponseData<T>;
  }
  return response.data as T;
};

/**
 * 处理请求错误
 * @param error 错误对象
 * @param showError 是否显示错误信息
 * @returns Promise
 */
const handleError = (
  error: any,
  showError: boolean = defaultConfig.showError
): Promise<never> => {
  let errorMessage = "请求失败，请稍后重试";

  if (error && error.errMsg) {
    if (error.errMsg.includes("request:fail timeout")) {
      errorMessage = "网络请求超时，请检查网络后重试";
    } else if (error.errMsg.includes("request:fail")) {
      errorMessage = "网络连接失败，请检查网络设置";
    } else {
      errorMessage = error.errMsg;
    }
  }

  if (showError) {
    feedback.msgError(errorMessage);
  }

  return Promise.reject(new Error(errorMessage));
};

/**
 * 处理响应错误
 * @param response 响应对象
 * @param showError 是否显示错误信息
 * @returns Promise
 */
const handleResponseError = (
  response: ResponseData<any>,
  showError: boolean = defaultConfig.showError
): Promise<never> => {
  const { code, msg } = response;
  let errorMessage = msg || "请求失败";

  // 定义不需要跳转登录的页面白名单
  const NO_AUTH_PAGES = ["/pages/login/index", "/pages/index/index"];

  // 根据错误码处理特定错误
  switch (code) {
    case errorEnum.TOKEN_EMPTY:
    case errorEnum.TOKEN_VALID:
      errorMessage = "登录已过期，请重新登录";
      // 清除无效token
      try {
        removeToken();

        // 获取当前路由信息
        const router = Taro.getCurrentInstance().router;
        const currentPath = router?.path || "";

        // 如果不在白名单中，则跳转登录页
        if (!NO_AUTH_PAGES.some((page) => currentPath.includes(page))) {
          // 构建完整的重定向URL（包含路径和参数）
          const params = router?.params || {};
          // 确保params的值都是字符串，以避免URLSearchParams的类型错误
          const stringifiedParams = Object.fromEntries(
            Object.entries(params).map(([key, value]) => [key, String(value)])
          );
          const queryString = new URLSearchParams(stringifiedParams).toString();
          const fullPath = queryString
            ? `${currentPath}?${queryString}`
            : currentPath;
          const redirectUrl = encodeURIComponent(fullPath);

          // Taro.showToast({
          //   title: errorMessage,
          //   icon: "none",
          //   duration: 2000,
          // });

          // 延迟跳转，让用户看到提示
          // setTimeout(() => {
          //   Taro.navigateTo({
          //     url: `/pages/login/index?redirect=${redirectUrl}`,
          //   }).catch((err) => {
          //     console.error("跳转登录页失败:", err);
          //   });
          // }, 500);
        }
      } catch (e) {
        console.error("清除token失败:", e);
      }
      break;
    case errorEnum.PERMISSIONS_ERROR:
      errorMessage = "无权限访问，请联系管理员";
      break;
    case errorEnum.REQUEST_404_ERROR:
      errorMessage = "请求的资源不存在";
      break;
    case errorEnum.SYSTEM_UNKNOWN_ERROR:
      errorMessage = "系统异常，请稍后重试";
      break;
    default:
      break;
  }

  if (showError) {
    feedback.msgError(errorMessage);
  }

  return Promise.reject(new Error(errorMessage));
};

/**
 * 统一请求方法
 * @param options 请求选项
 * @returns Promise<any>
 */
export default async function request<T = any>(
  options: RequestOptions
): Promise<T> {
  const {
    showLoading = defaultConfig.showLoading,
    loadingText = defaultConfig.loadingText,
    showError = defaultConfig.showError,
    isTransformResponse = defaultConfig.isTransformResponse,
    ...restOptions
  } = options;

  try {
    // 显示加载状态
    if (showLoading) {
      feedback.loading(loadingText);
    }

    // 处理请求选项
    const requestOptions = handleRequestOptions({
      ...restOptions,
      showError,
      isTransformResponse,
    });

    // 发送请求
    const response = await requestInstance(requestOptions);

    // 处理响应数据
    const result = handleResponse<T>(response, isTransformResponse);

    // 关闭加载状态
    if (showLoading) {
      feedback.closeLoading();
    }

    // 检查响应状态码
    if (isTransformResponse && typeof result === "object" && result !== null) {
      const responseData = result as ResponseData<T>;
      if (responseData.code !== errorEnum.SUCCESS) {
        return handleResponseError(responseData, showError);
      }
      return responseData.data as T;
    }

    return result as T;
  } catch (error) {
    // 关闭加载状态
    if (showLoading) {
      feedback.closeLoading();
    }

    // 处理请求错误
    return handleError(error, showError);
  }
}

// 创建常用请求方法的快捷方式
export const get = <T = any>(
  url: string,
  params?: any,
  options: Omit<RequestOptions, "url" | "method" | "params"> = {}
): Promise<T> => {
  return request<T>({
    url,
    method: "GET",
    params,
    ...options,
  });
};

export const post = <T = any>(
  url: string,
  data?: any,
  options: Omit<RequestOptions, "url" | "method" | "data"> = {}
): Promise<T> => {
  return request<T>({
    url,
    method: "POST",
    data,
    ...options,
  });
};

export const put = <T = any>(
  url: string,
  data?: any,
  options: Omit<RequestOptions, "url" | "method" | "data"> = {}
): Promise<T> => {
  return request<T>({
    url,
    method: "PUT",
    data,
    ...options,
  });
};

export const del = <T = any>(
  url: string,
  params?: any,
  options: Omit<RequestOptions, "url" | "method" | "params"> = {}
): Promise<T> => {
  return request<T>({
    url,
    method: "DELETE",
    params,
    ...options,
  });
};
