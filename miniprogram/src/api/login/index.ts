import request, { get, post } from '../../utils/request'
import type {
  LoginResultResponse,
  RegisterIn,
  LoginIn,
  OaLoginIn,
  LoginQrcodeResponse,
  OaLoginEvent,
  LoginTicketResponse,
  MnpLoginIn,
  LoginTokenVo,
} from './types'

const loginApi = {
  /** 注册账号 */
  register(params: RegisterIn): Promise<LoginResultResponse> {
    return post<LoginResultResponse>('login/register', params)
  },

  /** 登录系统 */
  login(params: LoginIn): Promise<LoginResultResponse> {
    if (params.scene === 'mobile') {
      return post<LoginResultResponse>('login/mobile_login', {
        scene: params.scene,
        mobile: params.mobile,
        code: params.code,
      })
    }
    return post<LoginResultResponse>('login/account_login', {
      scene: params.scene,
      account: (params as { scene: 'account'; account: string }).account,
      password: (params as { scene: 'account'; password: string }).password,
    })
  },

  /** 退出登录 */
  logout(): Promise<any> {
    return post('login/logout')
  },

  /** 公众号登录 */
  oaLogin(params: OaLoginIn): Promise<LoginResultResponse> {
    return post<LoginResultResponse>('login/oa_login', params)
  },

  /** 公众号登录二维码 */
  oaLoginQr(event: OaLoginEvent): Promise<LoginQrcodeResponse> {
    return get<LoginQrcodeResponse>('login/qrcode', { event })
  },

  /** 公众号登录的检测 */
  oaTicket(state: string): Promise<LoginTicketResponse> {
    return get<LoginTicketResponse>('login/ticket', { state })
  },
  /** 微信小程序登录 */
  miniLogin(params: MnpLoginIn): Promise<LoginTokenVo> {
    return post<LoginTokenVo>('login/mini_login', params)
  },
}

export default loginApi