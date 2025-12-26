import request from "@/utils/request";

const seoApi = {
	// ==================== 百度SEO ====================
	/**
	 * 百度SEO配置详情
	 */
	baiduDetail(): Promise<any> {
		return request.get({
			url: "/setting/seo/baidu/detail",
		});
	},

	/**
	 * 百度SEO配置保存
	 */
	baiduSave(params: any): Promise<any> {
		return request.post({
			url: "/setting/seo/baidu/save",
			params,
		});
	},

	/**
	 * 提交URL到百度
	 */
	baiduSubmit(params: any): Promise<any> {
		return request.post({
			url: "/setting/seo/baidu/submit",
			params,
		});
	},

	// ==================== Bing SEO ====================
	/**
	 * Bing SEO配置详情
	 */
	bingDetail(): Promise<any> {
		return request.get({
			url: "/setting/seo/bing/detail",
		});
	},

	/**
	 * Bing SEO配置保存
	 */
	bingSave(params: any): Promise<any> {
		return request.post({
			url: "/setting/seo/bing/save",
			params,
		});
	},

	/**
	 * 提交URL到Bing
	 */
	bingSubmit(params: any): Promise<any> {
		return request.post({
			url: "/setting/seo/bing/submit",
			params,
		});
	},
};

export default seoApi;
