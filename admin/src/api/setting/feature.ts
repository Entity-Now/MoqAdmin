import request from "@/utils/request";

const FeatureApi = {
	sites(): Promise<any> {
		return request.get({
			url: "/setting/feature/sites",
		});
	},
	detail(id: number): Promise<any> {
		return request.get({
			url: "/setting/feature/detail",
			params: { id },
		});
	},
	lists(params: any): Promise<any> {
		return request.get({
			url: "/setting/feature/lists",
			params,
		});
	},
	add(params: any): Promise<any> {
		return request.post({
			url: "/setting/feature/add",
			params,
		});
	},
	edit(params: any): Promise<any> {
		return request.post({
			url: "/setting/feature/edit",
			params,
		});
	},
	delete(params: any): Promise<any> {
		return request.post({
			url: "/setting/feature/delete",
			params,
		});
	},
};

export default FeatureApi;
