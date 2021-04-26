import SystemProfile from "@/domain/SystemProfile";
import axios from "axios";
import {URL_SYSTEM_PROFILE} from "@/constants/UrlApiCommon";
import Cached from "@/decorators/Cached";

export default class CommonService{
    @Cached()
    static async getSystemProfile(): Promise<SystemProfile>{
        return await axios.get<SystemProfile,SystemProfile>(URL_SYSTEM_PROFILE)
    }
}