import PasswordInfo from "@/domain/PasswordInfo";
import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import axios from "axios";
import {URL_PASSWORD_INFO, URL_PASSWORD_INFO_UPDATE_USE_TIMES} from "@/constants/UrlApiPassword";
import Page from "@/domain/Page";
import PasswordInfoDto from "@/domain/PasswordInfoDto";
import {MyAxiosRequestConfig} from "@/config/config-axios";

export default class PasswordInfoService{
    static async page(groupId: number, keywords: string, pageable: Pageable): Promise<Page<PasswordInfo>>{
        return await axios.get(URL_PASSWORD_INFO, {
            params: {groupId, keywords, ...pageable2RequestParameters(pageable)}
        });
    }

    static async add(passwordInfo: PasswordInfoDto): Promise<PasswordInfo>{
        return await axios.post(URL_PASSWORD_INFO, passwordInfo);
    }

    static async update(passwordInfo: PasswordInfoDto): Promise<PasswordInfo>{
        return await axios.put(URL_PASSWORD_INFO, passwordInfo);
    }

    static async delete(id: string|number): Promise<void>{
        return await axios.delete(URL_PASSWORD_INFO + "/" + id);
    }

    static async updateUseTimes(id: number): Promise<void>{
        return await axios.patch(URL_PASSWORD_INFO_UPDATE_USE_TIMES, {}, {pathVariables: {id}} as MyAxiosRequestConfig);
    }
}
