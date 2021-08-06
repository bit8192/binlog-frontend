import axios from "axios";
import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import Page from "@/domain/Page";
import ValueVo from "@/domain/ValueVo";
import {Comment} from "@/domain/Comment";
import {
    URL_COMMENT_REMOVE,
    URL_COMMENT_REPLIES,
    URL_COMMENT_REPLY_REMOVE,
    URL_COMMENT_REPLY_TOGGLE_AGREE, URL_COMMENT_REPLY_TOGGLE_TREAD,
    URL_COMMENT_SUB_REPLY,
    URL_COMMENT_TOGGLE_AGREE,
    URL_COMMENT_TOGGLE_TREAD
} from "@/constants/UrlApiComment";
import {MyAxiosRequestConfig} from "@/config/config-axios";

export default class CommentService{
    /**
     * 提交评论回复
     */
    static replyComment(commentId: number, content: string): Promise<Comment>{
        return axios.post(
            URL_COMMENT_REPLIES,
            {content},
            {
                pathVariables: {commentId}
            } as MyAxiosRequestConfig
        );
    }

    /**
     * 提交子评论回复
     */
    static replySubComment(replyId: number, content: string): Promise<Comment>{
        return axios.post(
            URL_COMMENT_SUB_REPLY,
            {content},
            {
                pathVariables: {replyId}
            } as MyAxiosRequestConfig
        )
    }

    /**
     * 删除评论
     * @param commentId
     */
    static removeComment(commentId: number|string): Promise<void>{
        return axios.delete(URL_COMMENT_REMOVE, {pathVariables: {commentId}} as MyAxiosRequestConfig)
    }

    /**
     * 切换评论点赞状态
     * @param commentId
     */
    static toggleCommentAgree(commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_COMMENT_TOGGLE_AGREE, null, {pathVariables: {commentId}} as MyAxiosRequestConfig);
    }

    /**
     * 切换点踩状态
     * @param commentId
     */
    static toggleCommentTread(commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_COMMENT_TOGGLE_TREAD, null, {pathVariables: {commentId}} as MyAxiosRequestConfig);
    }

    /**
     * 删除子评论
     * @param replyId
     */
    static removeReply(replyId: number|string): Promise<void>{
        return axios.delete(URL_COMMENT_REPLY_REMOVE, {pathVariables: {replyId}} as MyAxiosRequestConfig);
    }

    /**
     * 切换子评论点赞
     * @param replyId
     */
    static toggleReplyAgree(replyId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_COMMENT_REPLY_TOGGLE_AGREE, null, {pathVariables: {replyId}} as MyAxiosRequestConfig);
    }

    /**
     * 切换子评论点踩
     * @param replyId
     */
    static toggleReplyTread(replyId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_COMMENT_REPLY_TOGGLE_TREAD, null, {pathVariables: {replyId}} as MyAxiosRequestConfig);
    }

    /**
     * 获取评论回复分页
     * @param commentId
     * @param pageable
     */
    static async getReplyPage(commentId: number, pageable: Pageable): Promise<Page<Comment>> {
        return axios.get(
            URL_COMMENT_REPLIES,
            {
                params: pageable2RequestParameters(pageable),
                pathVariables: { commentId }
            } as MyAxiosRequestConfig
        );
    }
}
