import Article from "@/domain/Article";
import axios from "axios";
import {URL_ARTICLE, URL_ARTICLE_SEARCH_CLASS, URL_ARTICLE_SEARCH_TAG} from "@/constants/UrlApiArticle";
import Page from "@/domain/Page";
import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import ValueVo from "@/domain/ValueVo";
import {Comment} from "@/domain/Comment";

export default class ArticleService{
    public static add(article: Article): Promise<Article>{
        return axios.post(URL_ARTICLE, article);
    }

    public static update(article: Article): Promise<Article>{
        return axios.put(URL_ARTICLE, article);
    }

    public static getDetail(id: number | string): Promise<Article>{
        return axios.get(URL_ARTICLE + "/" + id);
    }

    public static pageAll(pageable: Pageable): Promise<Page<Article>>{
        return axios.get(URL_ARTICLE, {
            params: pageable2RequestParameters(pageable)
        })
    }

    public static view(articleId: number | string): Promise<void>{
        return axios.post(URL_ARTICLE + "/" + articleId + "/view")
    }

    /**
     * 通过分类分页查找
     * @param id
     * @param pageable
     */
    public static pageByArticleClass(id: number | string, pageable: Pageable): Promise<Page<Article>> {
        return axios.get(URL_ARTICLE_SEARCH_CLASS + "/" + id, {
            params: pageable2RequestParameters(pageable)
        })
    }

    /**
     * 通过标签查找
     * @param tagId
     * @param pageable
     */
    static pageByTag(tagId: number | string, pageable: Pageable): Promise<Page<Article>> {
        return axios.get(URL_ARTICLE_SEARCH_TAG + "/" + tagId, {
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
     * 提交评论
     * @param articleId
     * @param content
     */
    static submitComment(articleId: number|string, content: string): Promise<Comment>{
        return axios.post(URL_ARTICLE + "/" + articleId + "/comment", {content});
    }
}