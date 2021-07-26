import axios from "axios";
import {URL_ARTICLE} from "@/constants/UrlApiArticle";
import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import Page from "@/domain/Page";
import ValueVo from "@/domain/ValueVo";
import {Comment} from "@/domain/Comment";
import {URL_ARTICLE_COMMENT, URL_ARTICLE_SUB_COMMENT} from "@/constants/UrlApiComment";

export default class CommentService{
    /**
     * 获取评论分页数据
     * @param articleId
     * @param pageable
     */
    static async getArticleCommentPage(articleId: number|string, pageable: Pageable): Promise<Page<Comment>>{
        return await axios.get<Page<Comment>, Page<Comment>>(URL_ARTICLE + "/" + articleId + "/comments", {
            params: pageable2RequestParameters(pageable)
        })
    }

    /**
     * 提交评论
     * @param commentId
     * @param content
     */
    static async submitComment(commentId: number|string, content: string): Promise<Comment>{
        return await axios.post<Comment, Comment>(URL_ARTICLE_COMMENT, {commentId, content});
    }

    /**
     * 删除评论
     * @param articleId
     * @param commentId
     */
    static deleteComment(articleId: number|string, commentId: number|string): Promise<void>{
        return axios.delete(URL_ARTICLE_COMMENT + "/" + commentId)
    }

    /**
     * 切换评论点赞状态
     * @param commentId
     */
    static toggleCommentAgree(commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE_COMMENT + "/" + commentId + "/toggle-agree");
    }

    /**
     * 切换点踩状态
     * @param commentId
     */
    static toggleCommentTread(commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE_COMMENT + "/" + commentId + "/toggle-tread");
    }

    /**
     * 获取子评论数据
     * @param commentId
     * @param pageable
     */
    static async getArticleSubCommentPage(commentId: number|string, pageable: Pageable): Promise<Page<Comment>>{
        return await axios.get<Page<Comment>, Page<Comment>>(URL_ARTICLE_COMMENT + "/comments/" + commentId + "/sub-comments", {
            params: pageable2RequestParameters(pageable)
        });
    }

    /**
     * 提交子评论
     * @param commentId
     * @param content
     */
    static async submitSubComment(commentId: number|string, content: string): Promise<Comment>{
        return await axios.post<Comment, Comment>(URL_ARTICLE_SUB_COMMENT, {commentId, content});
    }

    /**
     * 删除子评论
     * @param commentId
     */
    static deleteSubComment(commentId: number|string): Promise<void>{
        return axios.delete(URL_ARTICLE_SUB_COMMENT + "/" + commentId);
    }

    /**
     * 切换子评论点赞
     * @param commentId
     */
    static toggleSubCommentAgree(commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE_SUB_COMMENT + "/sub-comments/" + commentId + "/toggle-agree");
    }

    /**
     * 切换子评论点踩
     * @param commentId
     */
    static toggleSubCommentTread(commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE_SUB_COMMENT + "/" + commentId + "/toggle-tread");
    }
}
