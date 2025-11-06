// https://nuxt.com/docs/api/configuration/nuxt-config
import { getEnvConfig } from "./nuxt/env";

const envConfig: Record<string, any> = getEnvConfig();

export default defineNuxtConfig({
	devtools: { enabled: true },
	// ssr: !!envConfig.ssr,
	ssr: true,
	spaLoadingTemplate: false,
	css: ["@/assets/styles/index.scss"],

	modules: [
		"nuxt-icons",
		"@pinia/nuxt",
		"@nuxt/eslint",
		"@nuxtjs/tailwindcss",
		"@element-plus/nuxt",
		"motion-v/nuxt",
		'@pinia/nuxt',
		"pinia-plugin-persistedstate/nuxt",
	],

	elementPlus: {
		defaultLocale: "zh-cn",
	},

	eslint: {
		checker: false,
	},

	app: {
		baseURL: envConfig.baseUrl,
	},

	runtimeConfig: {
		public: {
			...envConfig,
			// 显式将 VITE_API_URL 放入公共配置
			apiUrl: import.meta.env.VITE_API_URL
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
	},
	compatibilityDate: "2024-09-19",
});
    