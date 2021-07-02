import UserInfo from "@/domain/UserInfo";
import {VNodeComponentOptions} from "vue";

/**
 * 评论数据
 */
export interface Comment{
    id: number
    content: string
    renderContent?: Array<string|VNodeComponentOptions>
    agreedNum: number
    treadNum: number
    createdUser: UserInfo
    createdDate: string
    replies?: Comment[]
    repliesNum?: number
    isAgreed?: boolean
    isTrod?: boolean
    members: UserInfo[]
}