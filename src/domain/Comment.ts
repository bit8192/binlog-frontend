import UserInfo from "@/domain/UserInfo";

/**
 * 评论数据
 */
export interface Comment{
    id: number
    content: string
    agreedNum: number
    treadNum: number
    createdUser: UserInfo
    createdDate: string
    replies?: Comment[]
    repliesNum?: number
    isAgreed?: boolean
    isTrod?: boolean
    members: UserInfo[]
    removed?: boolean
    isAnonymous?: boolean
}
