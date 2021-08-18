import UserInfo from "@/domain/UserInfo";
import axios from "axios";
import {URL_OAUTH2_GITHUB_CHECK_NOTICE, URL_OAUTH2_QQ_CHECK_NOTICE} from "@/constants/UrlApiOauth2Authorize";
import SuccessMsg from "@/domain/SuccessMsg";

export default class Oauth2AuthorizeService{
    static async checkNoticeQQ(): Promise<SuccessMsg | UserInfo>{
        return await axios.get(URL_OAUTH2_QQ_CHECK_NOTICE);
    }

    static async checkNoticeGithub(): Promise<SuccessMsg | UserInfo>{
        return await axios.get(URL_OAUTH2_GITHUB_CHECK_NOTICE);
    }
}
