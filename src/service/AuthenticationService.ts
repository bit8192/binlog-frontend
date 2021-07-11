import axios from "axios";
import {MyAxiosRequestConfig} from "@/config/config-axios";
import SuccessMsg from "@/domain/SuccessMsg";
import {URL_AUTHORIZE, URL_CHANGE_PASSWORD, URL_LOGOUT, URL_SELF_INFO} from "@/constants/UrlApiAuthentication";
import Cached, {clearCache} from "@/decorators/Cached";
import UserDetail from "@/domain/UserDetail";
import ValueVo from "@/domain/ValueVo";

export default class AuthenticationService{
    /**
     * 获取用户信息
     * 当没有登录时会抛出异常
     */
    @Cached()
    static async getSelfInfo(): Promise<UserDetail>{
        return await axios.get(URL_SELF_INFO, {ignoreNotifyOnStatus: 401} as MyAxiosRequestConfig)
    }

    /**
     * 登录验证
     * @param username
     * @param password
     * @param verifyCode
     * @param rememberMe
     */
    static async authentication(username: string, password: string, verifyCode: unknown, rememberMe = false): Promise<boolean>{
        const result = await axios.post<SuccessMsg, SuccessMsg>(
            URL_AUTHORIZE,
            `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: rememberMe ? Object.assign(verifyCode, {'remember-me':rememberMe}) : verifyCode,

            }
        )
        return result.success
    }

    /**
     * 注销登录
     */
    static async logout(): Promise<void>{
        await axios.post<SuccessMsg, SuccessMsg>(URL_LOGOUT)
        //清除缓存
        clearCache(this.getSelfInfo)
    }

    /**
     * 改密码
     */
    static async changePassword(password: string): Promise<ValueVo<boolean>>{
        return await axios.patch<ValueVo<boolean>, ValueVo<boolean>>(URL_CHANGE_PASSWORD, {value: password});
    }
}