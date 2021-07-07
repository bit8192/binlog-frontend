import axios, {AxiosError, AxiosRequestConfig} from "axios"
import {Message} from 'element-ui'
import NetworkError from "@/error/NetworkError";

interface AxiosConfig {
    baseURL?: string
}
export interface MyAxiosRequestConfig extends AxiosRequestConfig{
    ignoreNotifyOnStatus?: number | number[]
}
export default function configAxios(axiosConfig: AxiosConfig): void{
    axios.defaults.baseURL = axiosConfig.baseURL
    axios.defaults.headers.common.Accept = "application/hal+json, text/plain, */*"

    axios.interceptors.response.use(
        function(response){
            if(!response) throw new Error()
            if(response.data?.msg){
                Message.success(response.data?.msg);
            }
            return response.data ? response.data : response;
        },
        (error: AxiosError) => {
            const response = error.response
            const config = error.config as MyAxiosRequestConfig
            let msg = response.data?.msg
            if(!msg){
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
            if(needNotify(config.ignoreNotifyOnStatus, response.status)) {
                Message.error({
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
function needNotify(ignoreNotifyOnStatus: number | number[], status: number){
    if(!ignoreNotifyOnStatus) return true
    if(typeof ignoreNotifyOnStatus === "number") return status !== ignoreNotifyOnStatus
    if(Array.isArray(ignoreNotifyOnStatus)) return !ignoreNotifyOnStatus.some(i=>i === status)
    return true
}