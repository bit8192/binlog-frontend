export default interface UserInfo{
    id: number
    username: string
    headImg: string
    biography: string
    website: string
    github: string
    qqOpenId: string
    wechatOpenId: string
    roles?: string[]
    locked?: boolean
    isBlogger?: boolean
    isAdmin?: boolean
}
