import request from '../../utils/request';
import type {
  UserCenterResponse,
  UserCollectResponse,
  UserCollectIn,
  UserEditIn,
  UserForgetPwdIn,
  UserChangePwdIn,
  UserBindEmailIn,
  UserBindMobileIn,
  UserBindWechatIn,
} from './types';
import type { PagingResult } from '../../../types/result';

const userApi = {
  /**
   * 个人中心
   */
  center(): Promise<UserCenterResponse> {
    return request<UserCenterResponse>({
      url: 'user/center',
      method: 'GET',
    });
  },

  /**
   * 我的收藏
   */
  collect(params: UserCollectIn = {}): Promise<PagingResult<UserCollectResponse>> {
    return request<PagingResult<UserCollectResponse>>({
      url: 'user/collect',
      method: 'GET',
      data: params
    });
  },

  /**
   * 编辑资料
   */
  edit(params: UserEditIn): Promise<any> {
    return request({
      url: 'user/edit',
      method: 'POST',
      data: {
        field: String(params.field),
        value: String(params.value),
      },
    });
  },

  /**
   * 找回密码
   */
  forgetPwd(params: UserForgetPwdIn): Promise<any> {
    return request({
      url: 'user/forget_pwd',
      method: 'POST',
      data: params
    });
  },

  /**
   * 修改密码
   */
  changePwd(params: UserChangePwdIn): Promise<any> {
    return request({
      url: 'user/change_pwd',
      method: 'POST',
      data: params
    });
  },

  /**
   * 绑定邮箱
   */
  bindEmail(params: UserBindEmailIn): Promise<any> {
    return request({
      url: 'user/bind_email',
      method: 'POST',
      data: params
    });
  },

  /**
   * 绑定手机
   */
  bindMobile(params: UserBindMobileIn): Promise<any> {
    return request({
      url: 'user/bind_mobile',
      method: 'POST',
      data: params
    });
  },

  /**
   * 绑定微信
   */
  bindWechat(params: UserBindWechatIn): Promise<any> {
    return request({
      url: 'user/bind_wechat',
      method: 'POST',
      data: params
    });
  },
};

export default userApi;