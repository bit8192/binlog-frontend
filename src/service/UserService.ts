import ValueVo from "@/domain/ValueVo";
import axios from "axios";
import {
    URL_USER_BLOGGERS, URL_USERS,
    URL_USERS_ALL,
    URL_USERS_CHANGE_HEAD_IMG,
    URL_USERS_USERNAME_OCCUPIED
} from "@/constants/UrlApiUser";
import UserInfo from "@/domain/UserInfo";
import UserDetail from "@/domain/UserDetail";
import UserDto from "@/domain/UserDto";
import SuccessMsg from "@/domain/SuccessMsg";

export default class UserService{
    /**
     * 修改头像
     * @param url
     */
    static async changeHeadImg(url: string): Promise<ValueVo<boolean>>{
        return axios.patch(URL_USERS_CHANGE_HEAD_IMG, {value: url})
    }

    /**
     * 博主列表
     */
    static async getBloggers(): Promise<Array<UserDetail>>{
        return axios.get(URL_USER_BLOGGERS)
    }

    /**
     * 获取所有用户列表
     */
    static async getAllUserList(): Promise<UserInfo[]>{
        return await axios.get(URL_USERS_ALL)
    }

    /**
     * 用户名是否被占用
     * @param username
     */
    static async usernameOccupied(username: string): Promise<ValueVo<boolean>>{
        return await axios.get(URL_USERS_USERNAME_OCCUPIED, {params: {username}});
    }

    /**
     * 注册用户
     * @param user
     * @param verifyCodeParam
     */
    static async register(user: UserDto, verifyCodeParam: unknown) :Promise<ValueVo<boolean> & SuccessMsg>{
        return await axios.post(URL_USERS, user, {params: verifyCodeParam});
    }
}
