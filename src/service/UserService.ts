import ValueVo from "@/domain/ValueVo";
import axios from "axios";
import {URL_USER_BLOGGERS, URL_USERS_ALL, URL_USERS_CHANGE_HEAD_IMG} from "@/constants/UrlApiUser";
import UserInfo from "@/domain/UserInfo";
import UserDetail from "@/domain/UserDetail";

export default class UserService{
    /**
     * 修改头像
     * @param url
     */
    static changeHeadImg(url: string): Promise<ValueVo<boolean>>{
        return axios.patch(URL_USERS_CHANGE_HEAD_IMG, {value: url})
    }

    /**
     * 博主列表
     */
    static getBloggers(): Promise<Array<UserDetail>>{
        return axios.get(URL_USER_BLOGGERS)
    }

    /**
     * 获取所有用户列表
     */
    static getAllUserList(): Promise<UserInfo[]>{
        return axios.get(URL_USERS_ALL)
    }
}
