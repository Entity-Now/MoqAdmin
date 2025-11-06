/// <reference types="node" />
// 导入 dotenv 模块，用于加载环境变量
import dotenv from 'dotenv'

// 根据当前环境（NODE_ENV）加载对应的 .env 文件
// 例如：当 NODE_ENV=production 时，加载 .env.production 文件
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// 打印关键环境变量信息，用于调试和确认配置是否正确加载
console.log('NODE_ENV:', process?.env.NODE_ENV)
console.log('NUXT_SSR:', process?.env.NUXT_SSR)
console.log('NUXT_API_URL:', import.meta.env.VITE_API_URL)

/**
 * 将 NUXT_ 前缀的环境变量转换为驼峰命名对象
 * 直接读取 process.env，适用于服务端、插件、middleware 等场景
 */
export const getEnvConfig = <
  T extends Record<string, string | boolean | number> = Record<string, string>
>(): T => {
  const prefix = 'NUXT_'
  const config = {} as Record<string, string | boolean | number>

  for (const key in import.meta.env) {
    if (key.startsWith(prefix)) {
      const rawValue = import.meta.env[key]
      const cleanKey = key.slice(prefix.length) // 移除 NUXT_

      // 驼峰化：API_URL → apiUrl
      const camelKey = cleanKey
        .toLowerCase()
        .replace(/_+(\w)/g, (_, letter) => letter.toUpperCase())

      // 自动类型转换（可选增强）
      let value: string | boolean | number = rawValue ?? ''

      if (value === 'true') value = true
      if (value === 'false') value = false
      if (!isNaN(Number(value)) && value !== '') value = Number(value)

      config[camelKey] = value
    }
  }

  return config as T
}

/**
 * 示例类型（可选）：为 IDE 提供完整提示
 */
export type EnvConfig = ReturnType<typeof getEnvConfig>