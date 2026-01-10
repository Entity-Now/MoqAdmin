import request from "../../utils/request";

export const weixinApi = {
  trace_waybill: (params) =>
    request({
      url: "weixin/trace_waybill",
      method: "POST",
      params: params,
    }),
};
export default weixinApi;
