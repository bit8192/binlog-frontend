import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import {Comment} from "@/domain/Comment";
import axios from "axios";
import {URL_LEFT_MESSAGE} from "@/constants/UrlApiLeftMessage";
import Page from "@/domain/Page";

export default class LeftMessageService{
    /**
     * 分页
     * @param pageable
     */
    static page(pageable: Pageable): Promise<Page<Comment>>{
        return axios.get(URL_LEFT_MESSAGE, {
            params: pageable2RequestParameters(pageable)
        });
    }

    /**
     * 提交留言
     * @param content
     * @param isAnonymous
     */
    static leavingMessage(content: string, isAnonymous: boolean): Promise<Comment>{
        return axios.post(URL_LEFT_MESSAGE, {content, isAnonymous});
    }
}
