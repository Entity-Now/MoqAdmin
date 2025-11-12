/** ------[登录结果] ------ */
export interface LoginResultResponse {
  token: string; // 访问令牌
}

/** ------[注册入参] ------ */
export interface RegisterIn {
  scene: 'mobile' | 'email'; // 注册场景
  code: string; // 验证码
  account: string; // 账号（手机号/邮箱）
  password: string; // 密码
}

/** ------[登录入参] ------ */
export type LoginIn =
  | { scene: 'mobile'; mobile: string; code: string }
  | { scene: 'account'; account: string; password: string };

/** ------[公众号登录入参] ------ */
export interface OaLoginIn {
  state: string; // 验证密钥
  code: string; // 微信code
}

/** ------[公众号登录二维码] ------ */
export interface LoginQrcodeResponse {
  key: string;
  url: string;
  ticket: string;
  expire_seconds: number;
}

/** ------[微信小程序登录入参] ------ */
export interface MnpLoginIn {
  code: string; // 微信code
}

export interface LoginTokenVo {
  token: string; // 访问令牌
}
export type OaLoginEvent = 'login' | 'bind';

/** ------[扫码检测] ------ */
export interface LoginTicketResponse {
  status: number; // 状态码
  expire: number; // 剩余过期秒数
  token: string; // 授权令牌（扫码成功时返回）
}