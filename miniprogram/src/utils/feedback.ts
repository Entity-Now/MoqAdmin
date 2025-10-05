import Taro from '@tarojs/taro';

// loading实例
let loadingInstance: any = null;

class Feedback {
  /**
   * 普通消息
   * @param {string} msg - 消息内容
   * @param {object} options - 可选配置
   * @returns {void}
   */
  msg(msg: string, options: any = {}): void {
    Taro.showToast({
      title: msg,
      icon: 'none',
      image: options.image || '',
      duration: options.duration || 2000,
      ...options
    });
  }

  /**
   * 错误消息
   * @param {string} msg - 错误内容
   * @param {object} options - 可选配置
   * @returns {void}
   */
  msgError(msg: string, options: any = {}): void {
    Taro.showToast({
      title: msg,
      icon: 'none',
      image: options.image || '',
      duration: options.duration || 2000,
      ...options
    });
  }

  /**
   * 成功消息
   * @param {string} msg - 成功内容
   * @param {object} options - 可选配置
   * @returns {void}
   */
  msgSuccess(msg: string, options: any = {}): void {
    Taro.showToast({
      title: msg,
      icon: 'success',
      duration: options.duration || 2000,
      ...options
    });
  }

  /**
   * 警告消息
   * @param {string} msg - 警告内容
   * @param {object} options - 可选配置
   * @returns {void}
   */
  msgWarning(msg: string, options: any = {}): void {
    Taro.showToast({
      title: msg,
      icon: 'none',
      image: options.image || '',
      duration: options.duration || 2000,
      ...options
    });
  }

  /**
   * 系统提示弹窗
   * @param {string} title - 标题
   * @param {string} message - 内容
   * @param {object} options - 可选配置
   * @returns {Promise<any>}
   */
  alert(title: string, message: string, options: any = {}): Promise<any> {
    return new Promise((resolve) => {
      Taro.showModal({
        title,
        content: message,
        showCancel: false,
        confirmText: '确定',
        ...options,
        success: (res) => {
          if (res.confirm) {
            resolve(res);
          }
        }
      });
    });
  }

  /**
   * 错误提示弹窗
   * @param {string} message - 错误内容
   * @param {object} options - 可选配置
   * @returns {Promise<any>}
   */
  alertError(message: string, options: any = {}): Promise<any> {
    return this.alert('错误', message, {
      confirmText: '确定',
      ...options
    });
  }

  /**
   * 成功提示弹窗
   * @param {string} message - 成功内容
   * @param {object} options - 可选配置
   * @returns {Promise<any>}
   */
  alertSuccess(message: string, options: any = {}): Promise<any> {
    return this.alert('成功', message, {
      confirmText: '确定',
      ...options
    });
  }

  /**
   * 警告提示弹窗
   * @param {string} message - 警告内容
   * @param {object} options - 可选配置
   * @returns {Promise<any>}
   */
  alertWarning(message: string, options: any = {}): Promise<any> {
    return this.alert('警告', message, {
      confirmText: '确定',
      ...options
    });
  }

  /**
   * 确认框
   * @param {string} title - 标题
   * @param {string} message - 内容
   * @param {object} options - 可选配置
   * @returns {Promise<any>}
   */
  confirm(title: string, message: string, options: any = {}): Promise<any> {
    return new Promise((resolve) => {
      Taro.showModal({
        title,
        content: message,
        confirmText: '确定',
        cancelText: '取消',
        ...options,
        success: (res) => {
          resolve(res);
        }
      });
    });
  }

  /**
   * 显示操作菜单
   * @param {Array} itemList - 菜单选项
   * @param {object} options - 可选配置
   * @returns {Promise<any>}
   */
  showActionSheet(itemList: string[], options: any = {}): Promise<any> {
    return new Promise((resolve) => {
      Taro.showActionSheet({
        itemList,
        ...options,
        success: (res) => {
          resolve(res);
        }
      });
    });
  }

  /**
   * 全局加载
   * @param {string} text - 加载文本
   * @param {object} options - 可选配置
   * @returns {void}
   */
  loading(text: string = '加载中...', options: any = {}): void {
    if (loadingInstance) {
      this.closeLoading();
    }
    loadingInstance = Taro.showLoading({
      title: text,
      ...options
    });
  }

  /**
   * 关闭全局加载
   * @returns {void}
   */
  closeLoading(): void {
    if (loadingInstance) {
      Taro.hideLoading();
      loadingInstance = null;
    }
  }
}

// 导出单例
const feedback = new Feedback();
export default feedback;