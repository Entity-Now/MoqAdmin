/** ------ [个人中心] ------ */
export interface UserCenterResponse {
    id: number;
    sn: string;
    account: string;
    nickname: string;
    avatar: string;
    mobile: string;
    email: string;
    collect: number;
    balance: number;
    gender: number;
    is_wechat: number;
    is_password: number;
    create_time: string;
    last_login_time: string;
}

/** ------ [我的收藏] ------ */
export interface UserCollectResponse {
    id: number;
    image: string;
    title: string;
    browse: number;
    collect: number;
    create_time: string;
}

/** ------ [入参类型] ------ */
export interface UserCollectIn {
  page?: number; // 当前页码
}

export interface UserEditIn {
  field: string; // 要修改字段
  value: number | string; // 要修改的值
}

export interface UserForgetPwdIn {
  account: string; // 账号
  code: string; // 验证码
  password: string; // 新的密码
}

export interface UserChangePwdIn {
  new_pwd: string; // 新的密码
  old_pwd: string; // 旧的密码
}

export interface UserBindEmailIn {
  scene: string; // 场景值[change=修改,bind=绑定]
  email: string; // 邮箱号
  code: string; // 验证码
}

export interface UserBindMobileIn {
  scene: string; // 场景值[change=修改,bind=绑定]
  mobile: string; // 手机号
  code: string; // 验证码
}

export interface UserBindWechatIn {
  state: string; // 验证密钥
  code: string; // 微信code
}
