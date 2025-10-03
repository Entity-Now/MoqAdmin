import type { AddressAddIn } from '@/api/address/types.d'

/**
 * 地址工具类
 * 
 * @author WaitAdmin Team
 * @link https://www.waitadmin.cn
 */
export const addressUtil = {
    /**
     * 将地址JSON数据转换为树形结构
     * 
     * @param {Record<string, Record<string, string>>} addressData - 地址数据
     * @returns {Array<{label: string, value: string, children?: Array<{label: string, value: string, children?: Array<{label: string, value: string}>}>}>} 树形结构地址数据
     */
    addressForm(addressData: Record<string, Record<string, string>>): Array<{label: string, value: string, children?: any[]}> {
        const result: any[] = []
        
        // 检查是否存在省份数据
        if (!addressData['00']) {
            return result
        }
        
        // 获取所有省份
        const provinces = addressData['00']
        
        // 遍历省份
        for (const [provinceId, provinceName] of Object.entries(provinces)) {
            const provinceItem = {
                label: provinceName,
                value: provinceName,
                children: [] as any[]
            }
            
            // 获取当前省份的城市数据
            const citiesData = addressData[provinceId]
            if (citiesData) {
                // 遍历城市
                for (const [cityId, cityName] of Object.entries(citiesData)) {
                    const cityItem = {
                        label: cityName,
                        value: cityName,
                        children: [] as any[]
                    }
                    
                    // 注意：这个地址JSON数据似乎只有省市两级，没有区县数据
                    // 如果需要区县级别，可以在这里添加相关逻辑
                    
                    provinceItem.children.push(cityItem)
                }
            }
            
            result.push(provinceItem)
        }
        
        return result
    },

    /**
     * 解析剪贴板地址为AddressAddIn格式
     * 
     * @param {string} text - 剪贴板文本
     * @returns {AddressAddIn | null} 解析后的地址对象，解析失败返回null
     */
    parseAddressFromClipboard(text: string): AddressAddIn | null {
        if (!text || typeof text !== 'string') {
            return null
        }
        
        // 格式1: 收件人: xxx\n手机号码: 1xxxx474\n所在地区: 江苏省苏州市常熟市常福街道\n详细地址: xxxxxx1
        if (text.includes('收件人:') && text.includes('手机号码:')) {
            const nameMatch = text.match(/收件人:\s*(.+)/)
            const phoneMatch = text.match(/手机号码:\s*(\d{11})/)
            const regionMatch = text.match(/所在地区:\s*(.+)/)
            const addressMatch = text.match(/详细地址:\s*(.+)/)
            
            if (nameMatch && phoneMatch && regionMatch && addressMatch) {
                // 解析区域信息
                const [province, city, district] = this.parseRegion(regionMatch[1])
                
                return {
                    name: nameMatch[1].trim(),
                    phone: phoneMatch[1].trim(),
                    province: province || '',
                    city: city || '',
                    district: district || '',
                    address: addressMatch[1].trim(),
                    is_default: 0
                }
            }
        }
        
        // 格式2: xxx 138xxxxxxxxx 地址
        const format2Match = text.match(/^([^\d]+)\s+(1[3-9]\d{9})\s+(.+)$/)
        if (format2Match) {
            const [, name, phone, address] = format2Match
            
            // 尝试从详细地址中提取地区信息
            const [province, city, district] = this.parseRegion(address)
            
            return {
                name: name.trim(),
                phone: phone.trim(),
                province: province || '',
                city: city || '',
                district: district || '',
                address: address.trim(),
                is_default: 0
            }
        }
        
        return null
    },

    /**
     * 解析区域信息
     * 
     * @param {string} regionText - 区域文本
     * @returns {[string, string, string]} [省份, 城市, 区县]
     */
    parseRegion(regionText: string): [string, string, string] {
        // 这里实现简单的区域解析逻辑
        // 实际应用中可能需要更复杂的解析规则或地址数据库支持
        let province = ''
        let city = ''
        let district = ''
        
        // 示例省份列表
        const provinces = ['北京市', '上海市', '天津市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '内蒙古自治区', '台湾省', '香港特别行政区', '澳门特别行政区']
        
        // 查找省份
        for (const p of provinces) {
            if (regionText.includes(p)) {
                province = p
                regionText = regionText.replace(p, '')
                break
            }
        }
        
        // 简单查找城市和区县（实际应用中需要更复杂的逻辑）
        const cityRegex = /([^市]*市|[^州]*州|[^盟]*盟|[^地区]*地区|[^区]*区)/
        const cityMatch = regionText.match(cityRegex)
        if (cityMatch) {
            city = cityMatch[1]
            regionText = regionText.replace(city, '')
        }
        
        // 查找区县
        const districtRegex = /([^区]*区|[^县]*县|[^市]*市|[^旗]*旗|[^镇]*镇|[^街道]*街道)/
        const districtMatch = regionText.match(districtRegex)
        if (districtMatch) {
            district = districtMatch[1]
        }
        
        return [province, city, district]
    },

    /**
     * 将AddressAddIn转换为格式化字符串
     * 
     * @param {AddressAddIn} address - 地址对象
     * @returns {string} 格式化的地址字符串
     */
    formatAddressToString(address: AddressAddIn): string {
        if (!address) {
            return ''
        }
        
        // 构建所在地区
        const regionParts = [address.province, address.city, address.district]
        const region = regionParts.filter(Boolean).join('')
        
        return `收件人: ${address.name}\n手机号码: ${address.phone}\n所在地区: ${region}\n详细地址: ${address.address}`
    }
}

export default addressUtil