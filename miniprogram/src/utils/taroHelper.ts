import Taro from '@tarojs/taro'

// 小程序方法帮助对象（使用 object 封装）
const MiniProgramHelper = {
  // 登录封装：获取登录凭证 code
  async login(): Promise<any> {
    try {
      const res = await Taro.login();
      return res.code;
    } catch (error) {
      console.error('登录失败', error);
      throw error;
    }
  },

  // 获取用户信息（使用 getUserProfile，getUserInfo 已弃用）
  async getUserProfile(desc?: string): Promise<any> {
    try {
      const userProfile = await Taro.getUserProfile({
        desc: desc || '用于完善会员资料', // 用户授权弹窗提示
      });
      return userProfile;
    } catch (error) {
      console.error('获取用户信息失败', error);
      throw error;
    }
  },

  // 打开客服会话（使用 openCustomerServiceChat）
  async openCustomerServiceChat(params: any): Promise<void> {
    try {
      await Taro.openCustomerServiceChat({
        ...params, // 示例: { extInfo: { url: 'your_url' }, corpId: 'your_corp_id' }
        success: () => {
          console.log('打开客服成功');
        },
        fail: (err: any) => {
          console.error('打开客服失败', err);
          throw err;
        }
      });
    } catch (error) {
      console.error('打开客服异常', error);
      throw error;
    }
  },

  // 分享页面封装：显示分享菜单
  showShareMenu(withShareTicket?: boolean): void {
    Taro.showShareMenu({
      withShareTicket: withShareTicket || true,
      showShareItems: ['shareAppMessage', 'shareTimeline']
    }).then(() => {
      console.log('分享菜单已显示');
    }).catch((err: any) => {
      console.error('设置分享菜单失败', err);
    });
  },

  // 分享页面回调处理（需在页面组件中调用 onShareAppMessage）
  onShareAppMessage(title?: string, path?: string, imageUrl?: string): any {
    return {
      title: title || '默认分享标题',
      path: path || '/pages/index/index',
      imageUrl: imageUrl || ''
    };
  },

  // 获取手机号封装：使用 getPhoneNumber（推荐在 button 的 bindgetphonenumber 中调用）
  getPhoneNumber(e: any): any {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const { encryptedData, iv } = e.detail;
      console.log('手机号加密数据', { encryptedData, iv });
      // TODO: 调用后端解密接口
      return { encryptedData, iv };
    } else {
      console.warn('用户拒绝授权手机号');
      return null;
    }
  },

  // 调起支付封装
  async requestPayment(params: any): Promise<void> {
    try {
      await Taro.requestPayment({
        ...params, // 示例: { timeStamp: '', nonceStr: '', package: '', signType: 'MD5', paySign: '' }
        success: (res: any) => {
          console.log('支付成功', res);
        },
        fail: (err: any) => {
          console.error('支付失败', err);
          throw err;
        }
      });
    } catch (error) {
      console.error('调起支付异常', error);
      throw error;
    }
  },

  // 设置导航栏标题
  setNavigationBarTitle(title: string): void {
    Taro.setNavigationBarTitle({
      title
    }).catch((err: any) => {
      console.error('设置标题失败', err);
    });
  },

  // 显示加载提示
  showLoading(title?: string): void {
    Taro.showLoading({
      title: title || '加载中...',
      mask: true
    });
  },

  // 隐藏加载提示
  hideLoading(): void {
    Taro.hideLoading();
  },

  // 显示 Toast 提示（新增，根据用户提供链接）
  showToast(params: any): Promise<any> {
    return Taro.showToast({
      ...params, // 示例: { title: '成功', icon: 'success', duration: 2000 }
    });
  },

  // 显示模态弹窗
  showModal(options: any): Promise<any> {
    return new Promise((resolve) => {
      Taro.showModal({
        ...options,
        success: (res: any) => {
          resolve(res.confirm);
        }
      });
    });
  },

  // 获取系统信息
  async getSystemInfo(): Promise<any> {
    try {
      const systemInfo = await Taro.getSystemInfo();
      return systemInfo;
    } catch (error) {
      console.error('获取系统信息失败', error);
      throw error;
    }
  }
};

export default MiniProgramHelper;