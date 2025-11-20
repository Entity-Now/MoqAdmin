const ssr = !!process.env.NUXT_PUBLIC_SSR
const title = process.env.NUXT_PUBLIC_TITLE || "moqistar.com"
const apiUrl = process.env.NUXT_PUBLIC_API_URL || "http://localhost:8100"

console.log('ssr', ssr)
console.log('url', apiUrl)
console.log('title', title)


export default defineNuxtConfig({
	devtools: { enabled: true },
	ssr: true,
	spaLoadingTemplate: false,
	css: ["@/assets/styles/index.scss"],

	modules: [
		"@nuxtjs/seo",
		"nuxt-icons",
		"@pinia/nuxt",
		"@nuxt/eslint",
		"@nuxtjs/tailwindcss",
		"@element-plus/nuxt",
		"motion-v/nuxt",
		"@pinia/nuxt",
		"pinia-plugin-persistedstate/nuxt",
	],

	elementPlus: {
		defaultLocale: "zh-cn",
	},

	eslint: {
		checker: false,
	},

	app: {
		baseURL: '/',
	},

	runtimeConfig: {
		ofetch: {
			rejectUnauthorized: false // 禁用证书验证
		},
		public: {
			apiUrl: apiUrl,
			ssr: ssr,
			title: title,
		},
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler",
				},
			},
		},
		envPrefix: 'NUXT_PUBLIC_',
	},
	compatibilityDate: "2024-09-19",
	// 由于用的seo模块，所以需要放在seo下
	seo: {
		site: {
			url: apiUrl,
			name: title,
		},
		sitemap: {
			// 排除不需要加入站点地图的路由
			exclude: ["/admin/**", "/user/**", "/api/**", "/spi/**", '/article/_components/**'],
			// 站点地图索引文件（适用于大型网站）
			index: true,
			// 生成的站点地图路径（默认为 /sitemap.xml）
			path: "/sitemap.xml",
		},
		robots: {
			// 禁止非搜索引擎爬虫访问
			blockNonSeoBots: true,
			// 允许所有爬虫访问（默认值）
			allow: "/",

			// 禁止爬虫访问的路径
			disallow: ["/admin/", "/private/", "/api/", "/spi/", "/user/"],
		},
	},
});
