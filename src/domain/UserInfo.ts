export default interface UserInfo{
    id: number
    nickname: string
    username: string
    headImg: string
    roles?: string[]
    locked?: boolean
}