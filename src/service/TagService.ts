import Tag from "@/domain/Tag";
import axios from "axios";
import {URL_TAG, URL_TAG_LIST_ALL} from "@/constants/UrlApiTag";

export default class TagService {
    static async listAll(): Promise<Array<Tag>>{
        return await axios.get<Array<Tag>, Array<Tag>>(URL_TAG_LIST_ALL);
    }

    static async post(tag: Tag): Promise<Tag> {
        return await axios.post(URL_TAG, {title: tag.title});
    }
}