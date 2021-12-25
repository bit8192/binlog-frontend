import PasswordProfile from "@/domain/PasswordProfile";
import axios from "axios";
import {URL_PASSWORD_GROUP, URL_PASSWORD_PROFILE} from "@/constants/UrlApiPassword";

export default class PasswordProfileService{
    static async get(): Promise<PasswordProfile|null>{
        return await axios.get(URL_PASSWORD_PROFILE);
    }

    static async update(passwordProfile: PasswordProfile): Promise<PasswordProfile>{
        return await axios.put(URL_PASSWORD_GROUP, passwordProfile);
    }

    static async convert(passwordProfile: PasswordProfile, rawPassword: string): Promise<string>{
        if(passwordProfile == null) return rawPassword;
        // const profile = await PasswordProfileService.get();
        // profile.inputConvert
        return rawPassword;
    }
}
