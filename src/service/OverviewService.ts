import axios from "axios";
import {
    URL_BINLOG_STATUS,
    URL_STATISTICS_AREA, URL_STATISTICS_BROWSER,
    URL_STATISTICS_PLATFORM,
    URL_STATISTICS_VISIT
} from "@/constants/UrlApiOverview";
import BinlogStatus from "@/domain/BinlogStatus";
import Cached from "@/decorators/Cached";
import DateUtils from "@/utils/DateUtils";

export default class OverviewService{
    @Cached()
    static getBinlogStatus(): Promise<BinlogStatus>{
        return axios.get(URL_BINLOG_STATUS);
    }

    static getVisitStatistics(start: Date, end: Date): Promise<Array<{key: string, value: number}>>{
        return axios.get(URL_STATISTICS_VISIT, {params: {start: DateUtils.format(start, "yyyy/MM/dd"), end: DateUtils.format(end, "yyyy/MM/dd")}});
    }

    static getAreaStatistics(start: Date, end: Date): Promise<Array<{key: string, value: number}>>{
        return axios.get(URL_STATISTICS_AREA, {params: {start: DateUtils.format(start, "yyyy/MM/dd"), end: DateUtils.format(end, "yyyy/MM/dd")}});
    }

    static async getPlatformStatistics(start: Date, end: Date): Promise<Array<{key: string, value: number}>>{
        return axios.get(URL_STATISTICS_PLATFORM, {params: {start: DateUtils.format(start, "yyyy/MM/dd"), end: DateUtils.format(end, "yyyy/MM/dd")}});
    }

    static async getBrowserStatistics(start: Date, end: Date): Promise<Array<{key: string, value: number}>>{
        return axios.get(URL_STATISTICS_BROWSER, {params: {start: DateUtils.format(start, "yyyy/MM/dd"), end: DateUtils.format(end, "yyyy/MM/dd")}});
    }
}
