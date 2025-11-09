/**
 * 添加地址参数接口
 */
export interface AddressAddIn {
  name: string;           // 收货人姓名
  phone: string;          // 收货人手机号
  province: string;       // 省份
  city: string;           // 城市
  district: string;       // 区县
  address: string;        // 详细地址
  is_default: number;     // 是否默认地址(0:否,1:是)
}

/**
 * 编辑地址参数接口
 */
export interface AddressEditIn {
  id: number;             // 地址ID
  name: string;           // 收货人姓名
  phone: string;          // 收货人手机号
  province: string;       // 省份
  city: string;           // 城市
  district: string;       // 区县
  address: string;        // 详细地址
  is_default: number;     // 是否默认地址(0:否,1:是)
}

/**
 * 地址列表项接口
 */
export interface AddressItem {
  id?: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address?: string;
  full_address?: string;
  is_default: number;
}

/**
 * 地址ID参数接口
 */
export interface AddressIdParam {
  id: number;             // 地址ID
}