import axios from "axios";
import {
    URL_MESSAGE_AGREE,
    URL_MESSAGE_ARTICLE_COMMENT, URL_MESSAGE_LEFT_MESSAGE,
    URL_MESSAGE_MENTION,
    URL_MESSAGE_REPLY, URL_MESSAGE_SET_READ, URL_MESSAGE_SYSTEM,
    URL_MESSAGE_UNREAD_COUNT
} from "@/constants/UrlApiMessage";
import Page from "@/domain/Page";
import Message from "@/domain/Message";
import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import CommentMessage from "@/domain/CommentMessage";
import ValueVo from "@/domain/ValueVo";
import {MyAxiosRequestConfig} from "@/config/config-axios";

export default class MessageService{
    /**
     * 获取未读消息统计
     */
    static unreadCount(): Promise<{[key:string]: number}>{
        return axios.get(URL_MESSAGE_UNREAD_COUNT, {ignoreNotifyOnStatus: 401} as MyAxiosRequestConfig);
    }

    /**
     * 获取文章评论消息
     */
    static getArticleCommentMessagePage(pageable: Pageable): Promise<Page<CommentMessage>>{
        return axios.get(URL_MESSAGE_ARTICLE_COMMENT, {params: pageable2RequestParameters(pageable)})
    }

    /**
     * 获取留言消息
     */
    static getLeftMessagePage(pageable: Pageable): Promise<Page<CommentMessage>>{
        return axios.get(URL_MESSAGE_LEFT_MESSAGE, {params: pageable2RequestParameters(pageable)})
    }

    /**
     * 获取回复消息
     */
    static getReplyMessagePage(pageable: Pageable): Promise<Page<CommentMessage>>{
        return axios.get(URL_MESSAGE_REPLY, {params: pageable2RequestParameters(pageable)})
    }

    /**
     * 获取@我的消息
     */
    static getMentionMessagePage(pageable: Pageable): Promise<Page<CommentMessage>>{
        return axios.get(URL_MESSAGE_MENTION, {params: pageable2RequestParameters(pageable)})
    }

    /**
     * 获取收到的赞消息
     */
    static getAgreeMessagePage(pageable: Pageable): Promise<Page<Message>>{
        return axios.get(URL_MESSAGE_AGREE, {params: pageable2RequestParameters(pageable)})
    }

    /**
     * 获取系统消息
     */
    static getSystemMessagePage(pageable: Pageable): Promise<Page<Message>>{
        return axios.get(URL_MESSAGE_SYSTEM, {params: pageable2RequestParameters(pageable)})
    }

    /**
     * 设置已读
     * @param unreadIds
     */
    static async setRead(unreadIds: Array<string | number>): Promise<ValueVo<boolean>> {
        return axios.post(URL_MESSAGE_SET_READ, unreadIds)
    }
}
