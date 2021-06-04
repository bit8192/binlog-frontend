import NetDiskFile from "@/domain/NetDiskFile";
import axios from "axios";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import NetDiskFileDto from "@/domain/NetDiskFileDto";

export default class NetDiskFileService{
    public static async listChildren(id: number): Promise<Array<NetDiskFile>>{
        return await axios.get(URL_NET_DISK_FILE, {params: {id}})
    }

    public static async getParents(id: number): Promise<Array<NetDiskFile>>{
        return await axios.get(URL_NET_DISK_FILE + "/" + id + "/parents")
    }

    public static async createDirectory(data: NetDiskFileDto): Promise<NetDiskFile>{
        return await axios.post(URL_NET_DISK_FILE + "/directories", data)
    }

    public static async delete(id: number): Promise<void>{
        await axios.delete(URL_NET_DISK_FILE + "/" + id)
    }

    public static async put(data: NetDiskFileDto): Promise<NetDiskFile>{
        return await axios.put(URL_NET_DISK_FILE, data);
    }

    static async getDetail(id: number): Promise<NetDiskFile>{
        return await axios.get(URL_NET_DISK_FILE + "/" + id)
    }
}