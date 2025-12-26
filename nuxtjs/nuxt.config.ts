const ssr = !!process.env.NUXT_PUBLIC_SSR;
const title = process.env.NUXT_PUBLIC_TITLE;
const apiUrl = process.env.NUXT_PUBLIC_API_URL;

console.log("nuxt.config.ts", "ssr", ssr, "url", apiUrl, "title", title);

export default defineNuxtConfig({
	devtools: { enabled: true },
	ssr: true,
	spaLoadingTemplate: false,
	css: [
		"@/assets/styles/main.css",
		"@/assets/styles/element.scss",
		"@/assets/styles/variables.scss",
		"@/assets/styles/theme.scss",
		"@/assets/styles/public.scss",
	],

	modules: [
		"@nuxtjs/seo",
		"nuxt-icons",
		"@pinia/nuxt",
		"@nuxt/eslint",
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
		baseURL: "/",
	},

	runtimeConfig: {
		ofetch: {
			rejectUnauthorized: false, // 禁用证书验证
		},
		public: {
			apiUrl: process.env.NUXT_PUBLIC_API_URL,
			ssr: !!process.env.NUXT_PUBLIC_SSR,
			title: process.env.NUXT_PUBLIC_TITLE,
			isDev: process.env.NODE_ENV === "development",
		},
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler",
				},
			},
			postcss: {
				plugins: [require("@tailwindcss/postcss")],
			},
		},
		envPrefix: "NUXT_PUBLIC_",
	},
	compatibilityDate: "2024-09-19",
	// 由于用的seo模块，所以需要放在seo下
	sitemap: {
		cacheMaxAgeSeconds: 6 * 60 * 60, //6小时缓存
		autoLastmod: true, // 用于爬虫抓取
		// 排除不需要加入站点地图的路由
		exclude: [
			"/admin/**",
			"/user/**",
			"/spi/**",
			"/article/_components/**",
			"/commodity/_components/**",
			"/login/**",
		],
		sources: [
			`${process.env.NUXT_PUBLIC_API_URL}/api/seo/get_sitemap_file`,
		],
	},
	robots: {
		// 禁止非搜索引擎爬虫访问
		blockNonSeoBots: true,
		// 允许所有爬虫访问（默认值）
		allow: "/",

		// 禁止爬虫访问的路径
		disallow: ["/admin/", "/private/", "/spi/", "/user/"],
	},
	site: {
		url: process.env.NUXT_PUBLIC_API_URL,
		name: process.env.NUXT_PUBLIC_TITLE,
	},
});
