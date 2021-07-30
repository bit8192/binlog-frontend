import ExpressionTag from "@/domain/ExpressionTag";
import UserInfo from "@/domain/UserInfo";

export default interface ExpressionVo {
    id: number
    title: string
    tags: ExpressionTag[]
    agreedNum: number
    createdUser: UserInfo
    isAgreed: boolean
}
