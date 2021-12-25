import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import Page from "@/domain/Page";
import PasswordGroup from "@/domain/PasswordGroup";
import axios from "axios";
import {URL_PASSWORD_GROUP} from "@/constants/UrlApiPassword";

export default class PasswordGroupService{
    static async page(keywords: string, pageable: Pageable): Promise<Page<PasswordGroup>>{
        return await axios.get(URL_PASSWORD_GROUP, {
            params: {keywords, ...pageable2RequestParameters(pageable)},
        });
    }

    static async add(passwordGroup: PasswordGroup): Promise<PasswordGroup>{
        return await axios.post(URL_PASSWORD_GROUP, passwordGroup);
    }

    static async update(passwordGroup: PasswordGroup): Promise<PasswordGroup>{
        return await axios.put(URL_PASSWORD_GROUP, passwordGroup);
    }

    static async delete(id: string|number): Promise<void>{
        return await axios.delete(URL_PASSWORD_GROUP + "/" + id);
    }
}
