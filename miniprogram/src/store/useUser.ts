// store/user.js
import Taro from "@tarojs/taro";
import { create } from "zustand";
import api from "../api/login";
import userApi from "../api/user";
import { persist, createJSONStorage } from "zustand/middleware";
import taroStorage from "../utils/taroStore";
import taroHelper from "../utils/taroHelper";

// 带持久化的用户状态管理
const useUserStore = create<any, any>(
  persist(
    (set, get) => ({
      token: null,
      loginInfo: {
        username: "",
        password: "",
        phoneEmail: "",
        code: "",
      },
      userInfo: null,
      isLogin: () => !!get().token,
      goLogin: (redirect) => {
        Taro.navigateTo({
          url: `/pages/login/index?redirect=${encodeURIComponent(redirect)}`,
        });
      },
      setToken: (token) => set({ token }),
      setLoginInfo: (key, value) =>
        set((state) => ({
          loginInfo: {
            ...state.loginInfo,
            [key]: value,
          },
        })),
      setUserInfo: (info) => set({ userInfo: info }),
      getUserInfo: async () => {
        try {
          const res = await userApi.center();
          if (res) {
            set({ userInfo: res });
          }
          return res;
        } catch {
          set({ userInfo: null, token: null });
          return null;
        }
      },
      mobileLogin: async (mobile, code) => {
        const res = await api.login({
          scene: "mobile",
          mobile,
          code,
        });
        if (res) {
          set({ token: res.token });
          return true;
        }
        return false;
      },
      accountLogin: async (account, password) => {
        const res = await api.login({
          scene: "account",
          account,
          password,
        });
        if (res) {
          set({ token: res.token });
          return true;
        }
        return false;
      },
      miniLogin: async () => {
        var code = await taroHelper.login();
        var loginRes = await api.miniLogin({ code });
        if (loginRes.token) {
          set({ token: loginRes.token });
          return true;
        }
        return false;
      },
      scanLogin: async (state: string) => {
        try {
          // 1. 获取小程序自身的登录 code (js_code)
          const js_code = await taroHelper.login();
          // 2. 调用扫码登录接口，将扫码获得的 state 和自身的 code 传给后端
          const loginRes = await api.miniQrCodeLogin({ state, code: js_code });
          if (loginRes.token) {
            set({ token: loginRes.token });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Scan login error:", error);
          return false;
        }
      },
      logout: () => {
        api.logout().then(() => {
          set({ userInfo: null, token: null });
        });
      },
    }),
    {
      name: "user-storage", // 存储的 key
      storage: createJSONStorage(() => taroStorage), // 使用自定义 Taro storage
      // 可选：只持久化部分状态
      // partialize: (state) => ({ count: state.count }),
      // 可选：版本控制，升级时清空旧数据
      // version: 1,
    }
  )
);

export default useUserStore;
export { useUserStore };
