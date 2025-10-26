// store/user.js
import Taro from "@tarojs/taro";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import taroStorage from "../utils/taroStore";

// 带持久化的用户状态管理
const useUserStore = create<any, any>(
  persist(
    (set) => ({
        token: null,
      userInfo: null,
      setToken: (token) => set({ token }),
      setUserInfo: (info) => set({ userInfo: info }),
      logout: () => set({ userInfo: null, token: null }),
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
