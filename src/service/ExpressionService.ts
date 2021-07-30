import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import ExpressionVo from "@/domain/ExpressionVo";
import Page from "@/domain/Page";
import axios from "axios";
import {URL_EXPRESSION, URL_EXPRESSION_TAG} from "@/constants/UrlApiExpression";
import ExpressionDto from "@/domain/ExpressionDto";
import ExpressionTag from "@/domain/ExpressionTag";
import {MyAxiosRequestConfig} from "@/config/config-axios";
import ValueVo from "@/domain/ValueVo";

export default class ExpressionService{
    static getExpressionPage(keywords: string, tagIds: Array<string|number>, pageable: Pageable): Promise<Page<ExpressionVo>>{
        return axios.get(URL_EXPRESSION, {
            params: Object.assign({keywords, tagIds}, pageable2RequestParameters(pageable)),
        })
    }

    static upload(fileMap: {[k:string]: File}, expressionInfos: ExpressionDto[]): Promise<Array<ExpressionVo>>{
        const formData = new FormData()
        for (const fileName in fileMap) {
            formData.append(fileName, fileMap[fileName])
        }
        formData.append("expressionInfos", new Blob([JSON.stringify(expressionInfos)], {type: "application/json"}))
        return axios.post(URL_EXPRESSION, formData)
    }

    static async getAllTags() :Promise<Array<ExpressionTag>>{
        return await axios.get(URL_EXPRESSION_TAG);
    }

    static async getExpression(title: string) : Promise<ExpressionVo>{
        return await axios.get(URL_EXPRESSION + "/" + title, {ignoreNotifyOnStatus: 404} as MyAxiosRequestConfig)
    }

    static async toggleAgree(id: number) :Promise<ValueVo<boolean>>{
        return await axios.post(URL_EXPRESSION + "/" + id + "/toggle-agree");
    }
}
