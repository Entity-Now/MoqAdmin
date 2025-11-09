const url = import.meta.env.NUXT_PUBLIC_API_URL
const ssr = import.meta.env.NUXT_PUBLIC_SSR
console.log('ssr', ssr)
console.log('url', url)
console.log(process.env, import.meta.env);

const config: any = {
    // 版本编号
    version: '1.1.1',
    // 请求域名
    baseUrl: url || 'https://www.moqistar.com',
    // 来源终端
    terminal: 4,
    // 请求前缀
    urlPrefix: '/api',
    // 请求重试
    reqRetry: 2,
    // 请求超时
    timeout: 10 * 1000
}

export default config
