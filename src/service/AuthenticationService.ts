import UserInfo from "@/domain/UserInfo";
import axios from "axios";
import {MyAxiosRequestConfig} from "@/config/config-axios";
import SuccessMsg from "@/domain/SuccessMsg";
import Synchronized from "@/decorators/Synchronized";
import {URL_AUTHENTICATION, URL_LOGOUT, URL_SELF_INFO} from "@/constants/UrlApiAuthentication";

export default class AuthenticationService{
    /**
     * 获取用户信息
     * 当没有登录时会抛出异常
     */
    @Synchronized()
    static async getSelfInfo(): Promise<UserInfo>{
        return await axios.get<UserInfo,UserInfo>(URL_SELF_INFO, {ignoreNotifyOnStatus: 401} as MyAxiosRequestConfig)
    }

    /**
     * 登录验证
     * @param username
     * @param password
     * @param verifyCode
     */
    static async authentication(username: string, password: string, verifyCode: unknown): Promise<boolean>{
        const result = await axios.post<SuccessMsg, SuccessMsg>(
            URL_AUTHENTICATION,
            `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: verifyCode,

            }
        )
        return result.success
    }

    /**
     * 注销登录
     */
    static async logout(): Promise<boolean>{
        const result = await axios.post<SuccessMsg, SuccessMsg>(URL_LOGOUT)
        return result.success
    }
}