import PasswordGroup from "@/domain/PasswordGroup";

export default interface PasswordInfo{
    id?: number
    title?: string
    username?: string
    encodedPassword?: string
    passwordGroup?: PasswordGroup
    url?: string
    createdDate?: string
    lastModifiedDate?: string
    remark?: string
    encryptionRemark?: boolean
}
