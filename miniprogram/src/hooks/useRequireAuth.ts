import { useEffect, useCallback } from "react";
import Taro from "@tarojs/taro";
import useUserStore from "../store/useUser";

/**
 * 登录认证 Hook 配置选项
 */
interface UseRequireAuthOptions {
  /**
   * 是否在页面加载时自动检查并跳转到登录页
   * @default false
   */
  autoRedirect?: boolean;

  /**
   * 自定义跳转后的返回地址
   * 如果不提供，将使用当前页面路径
   */
  redirectUrl?: string;

  /**
   * 未登录时的提示消息
   * @default '请先登录'
   */
  message?: string;

  /**
   * 是否显示提示消息
   * @default true
   */
  showMessage?: boolean;
}

/**
 * 登录认证 Hook 返回值
 */
interface UseRequireAuthReturn {
  /**
   * 当前登录状态
   */
  isLogin: boolean;

  /**
   * 包装需要登录的操作
   * @param action 需要执行的操作
   * @returns 是否执行了操作（true 表示已登录并执行，false 表示未登录）
   */
  requireAuth: (action: () => void | Promise<void>) => boolean;

  /**
   * 手动检查登录状态并跳转
   */
  checkAndRedirect: () => void;
}

/**
 * 登录认证 Hook
 *
 * 提供统一的登录状态检查和跳转逻辑
 *
 * @example
 * // 自动跳转模式（页面必须登录才能访问）
 * const { isLogin } = useRequireAuth({ autoRedirect: true });
 *
 * @example
 * // 手动检查模式（允许浏览，操作时要求登录）
 * const { requireAuth } = useRequireAuth();
 *
 * const handleCollect = () => {
 *   requireAuth(async () => {
 *     // 执行收藏操作
 *     await collectApi();
 *   });
 * };
 */
export function useRequireAuth(
  options: UseRequireAuthOptions = {}
): UseRequireAuthReturn {
  const {
    autoRedirect = false,
    redirectUrl,
    message = "请先登录",
    showMessage = true,
  } = options;

  const { isLogin, goLogin } = useUserStore();
  const loginStatus = isLogin();

  /**
   * 获取当前页面完整路径（包含参数）
   */
  const getCurrentPageUrl = useCallback((): string => {
    if (redirectUrl) {
      return redirectUrl;
    }

    const router = Taro.getCurrentInstance().router;
    if (!router) {
      return "";
    }

    const path = router.path || "";
    const params = router.params || {};
    // 确保params的值都是字符串，以避免URLSearchParams的类型错误
    const stringifiedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    const queryString = new URLSearchParams(stringifiedParams).toString();

    return queryString ? `${path}?${queryString}` : path;
  }, [redirectUrl]);

  /**
   * 跳转到登录页
   */
  const navigateToLogin = useCallback(() => {
    const currentUrl = getCurrentPageUrl();
    goLogin(currentUrl);
  }, [getCurrentPageUrl, goLogin]);

  /**
   * 检查登录状态并跳转
   */
  const checkAndRedirect = useCallback(() => {
    if (!loginStatus) {
      if (showMessage) {
        Taro.showToast({
          title: message,
          icon: "none",
          duration: 2000,
        });
      }

      setTimeout(
        () => {
          navigateToLogin();
        },
        showMessage ? 500 : 0
      );
    }
  }, [loginStatus, showMessage, message, navigateToLogin]);

  /**
   * 包装需要登录的操作
   */
  const requireAuth = useCallback(
    (action: () => void | Promise<void>): boolean => {
      if (!loginStatus) {
        Taro.showModal({
          title: "需要登录",
          content: "此操作需要登录，是否前往登录页面？",
          confirmText: "去登录",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              navigateToLogin();
            }
          },
        });
        return false;
      }

      // 执行操作
      const result = action();
      if (result instanceof Promise) {
        result.catch((error) => {
          console.error("操作执行失败:", error);
        });
      }

      return true;
    },
    [loginStatus, navigateToLogin]
  );

  /**
   * 自动跳转模式：页面加载时检查登录状态
   */
  useEffect(() => {
    if (autoRedirect && !loginStatus) {
      checkAndRedirect();
    }
  }, [autoRedirect, loginStatus, checkAndRedirect]);

  return {
    isLogin: loginStatus,
    requireAuth,
    checkAndRedirect,
  };
}

export default useRequireAuth;
