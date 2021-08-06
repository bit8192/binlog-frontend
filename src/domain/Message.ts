import UserInfo from "@/domain/UserInfo";

export default interface Message{
    id: number
    createdDate: string
    fromUser: UserInfo
    toUser: UserInfo
    isRead: boolean
    additionInfo: string
    content: string
    type: string
    relatedTargetId: number
    originalTargetId: number
    targetId: number
}
