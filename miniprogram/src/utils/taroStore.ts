import Taro from "@tarojs/taro";

// 自定义 Storage Adapter（兼容 Taro 多端）
 const taroStorage = {
  getItem: (name) => {
    try {
      const value = Taro.getStorageSync(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Get storage error:', error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      Taro.setStorageSync(name, JSON.stringify(value));
    } catch (error) {
      console.error('Set storage error:', error);
    }
  },
  removeItem: (name) => {
    try {
      Taro.removeStorageSync(name);
    } catch (error) {
      console.error('Remove storage error:', error);
    }
  },
};

export default taroStorage;