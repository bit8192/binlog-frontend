import ArticleClass from "@/domain/ArticleClass";
import axios from "axios";
import {URL_ARTICLE_CLASS, URL_ARTICLE_CLASS_SEARCH_BY_PARENT} from "@/constants/UrlApiArticleClass";

export default class ArticleClassService{
    static async searchByParent(id?: number): Promise<Array<ArticleClass>>{
        return await axios.get<Array<ArticleClass>, Array<ArticleClass>>(URL_ARTICLE_CLASS_SEARCH_BY_PARENT,{
            params: {id}
        })
    }

    /**
     * 获取
     * @param id
     */
    static async get(id: number): Promise<ArticleClass>{
        return await axios.get<ArticleClass, ArticleClass>(URL_ARTICLE_CLASS + "/" + id)
    }

    /**
     * 新增
     * @param articleClass
     */
    static async post(articleClass: ArticleClass): Promise<ArticleClass>{
        const data = {
            title: articleClass.title,
            visible: articleClass.visible,
            orderNum: articleClass.orderNum,
            parentId: articleClass.parent?.id
        }
        return await axios.post<ArticleClass, ArticleClass>(URL_ARTICLE_CLASS, data)
    }

    /**
     * 修改
     * @param articleClass
     */
    static async put(articleClass: ArticleClass): Promise<ArticleClass>{
        return await axios.put<ArticleClass, ArticleClass>(URL_ARTICLE_CLASS, articleClass)
    }

    /**
     * 删除
     * @param articleClass
     */
    static async delete(articleClass: ArticleClass): Promise<void>{
        return await axios.delete(URL_ARTICLE_CLASS + "/" + articleClass.id);
    }
}