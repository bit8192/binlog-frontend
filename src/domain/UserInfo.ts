export default interface UserInfo{
    id: number
    username: string
    headImg: string
    roles?: string[]
    locked?: boolean
    isBlogger?: boolean
    isAdmin?: boolean
}
