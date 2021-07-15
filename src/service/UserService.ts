import ValueVo from "@/domain/ValueVo";
import axios from "axios";
import {URL_USERS_ALL, URL_USERS_CHANGE_HEAD_IMG} from "@/constants/UrlApiUser";
import UserInfo from "@/domain/UserInfo";

export default class UserService{
    /**
     * 修改头像
     * @param url
     */
    static changeHeadImg(url: string): Promise<ValueVo<boolean>>{
        return axios.patch(URL_USERS_CHANGE_HEAD_IMG, {value: url})
    }

    /**
     * 获取所有用户列表
     */
    static getAllUserList(): Promise<UserInfo[]>{
        return axios.get(URL_USERS_ALL)
    }
}