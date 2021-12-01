import UserInfo from "@/domain/UserInfo";
import {FileSystemTypeEnum} from "@/domain/FileSystemTypeEnum";
export type f = 'LOCAL'|'ALI_OSS'
export default interface NetDiskFile {
    id?: number
    name: string
    isDirectory: boolean
    mediaType?: string
    size?: number
    fileSystemTypeSet?: Array<FileSystemTypeEnum>
    createdDate?: string | Date
    lastModifiedDate?: string | Date
    possessor?: UserInfo
    createdUser?: UserInfo
    lastModifiedUser?: UserInfo
    childrenNum?: number
    everyoneReadable?: boolean
    everyoneWritable?: boolean
    readableUserList?: UserInfo[]
    writableUserList?: UserInfo[]
    readable?: boolean
    writable?: boolean
}
