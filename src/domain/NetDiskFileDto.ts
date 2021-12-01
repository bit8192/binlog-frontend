import {FileSystemTypeEnum} from "@/domain/FileSystemTypeEnum";

export default interface NetDiskFileDto{
    id?: number
    name?: string
    parentId?: number
    fileSystemType?: FileSystemTypeEnum
    everyoneReadable?: boolean
    everyoneWritable?: boolean
    readableUserList?: number[]
    writableUserList?: number[]
}
