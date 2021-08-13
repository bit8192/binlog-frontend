import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import Page from "@/domain/Page";
import {RequestLog} from "@/domain/RequestLog";
import axios from "axios";
import {URL_REQUEST_LOG} from "@/constants/UrlApiRequestLog";
import DateUtils from "@/utils/DateUtils";

export default class RequestLogService{
    static async page(
        ip: string,
        address: string,
        host: string,
        referer: string,
        userAgent: string,
        method: string,
        requestUri: string,
        sessionId: string,
        clientId: string,
        userId: number,
        excludeMe: boolean,
        start: Date,
        end: Date,
        pageable: Pageable
    ): Promise<Page<RequestLog>>{
        return axios.get(URL_REQUEST_LOG, {
            params: Object.assign({
                ip, address, host, referer, userAgent, method, requestUri, sessionId, clientId, userId, excludeMe,
                start: start && end ? DateUtils.format(start, "yyyy/MM/dd") : undefined,
                end: start && end ? DateUtils.format(end, "yyyy/MM/dd") : undefined
            },pageable2RequestParameters(pageable))
        })
    }
}
