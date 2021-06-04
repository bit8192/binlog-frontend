import Article from "@/domain/Article";
import axios from "axios";
import {URL_ARTICLE} from "@/constants/UrlApiArticle";

export default class ArticleService{
    public static add(article: Article): Promise<Article>{
        return axios.post(URL_ARTICLE, article);
    }

    public static getDetail(id: number | string): Promise<Article>{
        return axios.get(URL_ARTICLE + "/" + id);
    }
}