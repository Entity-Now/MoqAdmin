/**
 * 扫码登录状态枚举
 */
export enum ScanCodeStatus {
	/** 等待扫码 */
	WAITING = 0,
	/** 二维码已过期 */
	EXPIRED = 1,
	/** 已扫码,等待确认 */
	SCANNED = 2,
	/** 扫码成功 */
	SUCCESS = 3,
}
