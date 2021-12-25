export default interface PasswordInfoDto{
    id?: number
    title?: string
    username?: string
    encodedPassword?: string
    passwordGroupId?: number
    url?: string
    remark?: string
    encryptionRemark?: boolean
}
