import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import Page from "@/domain/Page";
import ArchiveVo from "@/domain/ArchiveVo";
import {URL_ARCHIVE} from "@/constants/UrlApiArchive";
import axios from "axios";

export default class ArchiveService{
    /**
     * 归档分页
     * @param pageable
     */
    static async page(pageable: Pageable): Promise<Page<ArchiveVo>>{
        return await axios.get(URL_ARCHIVE, {
            params: pageable2RequestParameters(pageable)
        })
    }
}
