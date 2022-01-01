import Article from "@/domain/Article";
import axios from "axios";
import {
    URL_ARTICLE,
    URL_ARTICLE_COMMENTS,
    URL_ARTICLE_SEARCH_CLASS,
    URL_ARTICLE_SEARCH_TAG
} from "@/constants/UrlApiArticle";
import Page from "@/domain/Page";
import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import ValueVo from "@/domain/ValueVo";
import {Comment} from "@/domain/Comment";
import {MyAxiosRequestConfig} from "@/config/config-axios";

export default class ArticleService{
    public static async add(article: Article): Promise<Article>{
        return await axios.post(URL_ARTICLE, article);
    }

    public static async update(article: Article): Promise<Article>{
        return await axios.put(URL_ARTICLE, article);
    }

    public static async getDetail(id: number | string): Promise<Article>{
        return await axios.get(URL_ARTICLE + "/" + id);
    }

    public static async pageAll(keywords: string, articleClassId: number, tagIds: number[], pageable: Pageable): Promise<Page<Article>>{
        return await axios.get(URL_ARTICLE, {
            params: Object.assign({keywords, articleClassId, tagIds},pageable2RequestParameters(pageable))
        })
    }

    public static async view(articleId: number | string): Promise<void>{
        return await axios.post(URL_ARTICLE + "/" + articleId + "/view")
    }

    /**
     * 通过分类分页查找
     * @param id
     * @param pageable
     */
    public static async pageByArticleClass(id: number | string, pageable: Pageable): Promise<Page<Article>> {
        return await axios.get(URL_ARTICLE_SEARCH_CLASS + "/" + id, {
            params: pageable2RequestParameters(pageable)
        })
    }

    /**
     * 通过标签查找
     * @param tagId
     * @param pageable
     */
    static async pageByTag(tagId: number | string, pageable: Pageable): Promise<Page<Article>> {
        return await axios.get(URL_ARTICLE_SEARCH_TAG + "/" + tagId, {
            params: pageable2RequestParameters(pageable)
        })
    }

    /**
     * 切换点赞
     * @param id 文章id
     */
    static async toggleAgree(id: number): Promise<ValueVo<boolean>> {
        return axios.post(URL_ARTICLE + "/" + id + "/toggle-agree");
    }

    /**
     * 评论分页
     */
    static async getCommentPage(articleId: number|string, pageable: Pageable): Promise<Page<Comment>>{
        return await axios.get(
            URL_ARTICLE_COMMENTS,
            {
                params: pageable2RequestParameters(pageable),
                pathVariables: {articleId}
            } as MyAxiosRequestConfig
        )
    }

    /**
     * 提交评论
     * @param articleId
     * @param content
     */
    static async commenting(articleId: number|string, content: string): Promise<Comment>{
        return await axios.post(
            URL_ARTICLE_COMMENTS,
            {content},
            {
                pathVariables: {articleId}
            } as MyAxiosRequestConfig
        );
    }

    /**
     * 删除文章
     */
    static async delete(articleId: number): Promise<void>{
        await axios.delete(URL_ARTICLE + "/" + articleId)
    }
}
