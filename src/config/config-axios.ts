import axios, {AxiosError, AxiosRequestConfig} from "axios"
import NetworkError from "@/error/NetworkError";
import qs from "qs";
import {ElMessage} from "element-plus";

interface AxiosConfig {
    baseURL?: string
}
export interface MyAxiosRequestConfig extends AxiosRequestConfig{
    /**
     * 忽略状态提示
     */
    ignoreNotifyOnStatus?: number | number[],
    /**
     * 请求路径参数
     */
    pathVariables?: {[k:string]: string | number}
}
export default function configAxios(axiosConfig: AxiosConfig): void{
    axios.defaults.baseURL = axiosConfig.baseURL
    axios.defaults.headers.common.Accept = "application/json, text/plain, */*"

    axios.defaults.paramsSerializer = params => qs.stringify(params, {arrayFormat: "repeat"})

    axios.interceptors.request.use((request:MyAxiosRequestConfig)=>{
        if(request.pathVariables){
            for (const key in request.pathVariables) {
                request.url = request.url.replace("{" + key + "}", request.pathVariables[key].toString())
            }
        }
        return request
    })

    axios.interceptors.response.use(
        function(response){
            if(!response) throw new Error()
            if(response.data?.msg){
                ElMessage.success(response.data?.msg);
            }
            return response.data ? response.data : response;
        },
        (error: AxiosError) => {
            const response = error.response
            const config = error.config as MyAxiosRequestConfig
            let msg = response ? response.data?.msg : "未知错误，这可能是由于前端的逻辑错误导致的"
            if(!msg && response){
                switch (response.status){
                    case 200:
                        break;
                    case 400:
                        msg = "无效请求";
                        break;
                    case 401:
                        msg = "未登陆"
                        break;
                    case 403:
                        msg = "没有权限"
                        break;
                    case 404:
                        msg = "资源不存在"
                        break;
                    case 500:
                        msg = "服务器异常"
                        break;
                    default:
                        msg = "请求失败"
                }
            }
            if(needNotify(config ? config.ignoreNotifyOnStatus : undefined, response ? response.status : undefined)) {
                ElMessage.error({
                    message: msg,
                    showClose: true,
                    duration: 10000
                })
            }
            return Promise.reject(new NetworkError(error))
        }
    )
}

/**
 * 判断是否忽略状态通知
 * @param ignoreNotifyOnStatus
 * @param status
 */
function needNotify(ignoreNotifyOnStatus: number | undefined | number[], status: number | undefined){
    if(!ignoreNotifyOnStatus) return true
    if(typeof ignoreNotifyOnStatus === "number") return status !== ignoreNotifyOnStatus
    if(Array.isArray(ignoreNotifyOnStatus)) return !ignoreNotifyOnStatus.some(i=>i === status)
    return true
}
