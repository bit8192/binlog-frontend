import UserInfo from "@/domain/UserInfo";

export default interface NetDiskFile {
    id?: number
    name: string
    isDirectory: boolean
    mediaType?: string
    size?: number
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
