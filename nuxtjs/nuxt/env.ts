import { useRuntimeConfig } from '#app'
import { config } from 'dotenv'

// config()

// utils/config.ts
type ConfigScope = 'public' | 'private'

/**
 * 获取 runtimeConfig 中的值
 * @param scope - 'public' | 'private'
 * @param key - 支持点语法，如 'api.baseUrl'
 * @param defaultValue - 可选默认值
 * @returns 配置值
 */
export function getConfig<T = any>(
  scope: ConfigScope,
  key: string,
  defaultValue?: T
): T {
  if (!import.meta.server && scope === 'private') {
    console.warn(`[getConfig] Cannot access private config '${key}' on client side.`)
    return defaultValue as T
  }

  const config = useRuntimeConfig()
  const target = scope === 'public' ? config.public : config

  // 支持点路径：api.baseUrl → { api: { baseUrl: '...' } }
  const value = key.split('.').reduce((obj, k) => (obj as any)?.[k], target as any)

  return value !== undefined ? value : defaultValue as T
}

// 打印关键环境变量信息，用于调试和确认配置是否正确加载
console.log('NODE_ENV:', process?.env?.NODE_ENV)
console.log('NUXT_SSR:', getConfig('public', 'ssr'))
console.log('NUXT_API_URL:', getConfig('public', 'apiUrl'))
