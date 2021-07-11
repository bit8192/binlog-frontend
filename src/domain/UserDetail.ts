import UserInfo from "@/domain/UserInfo";

export default interface UserDetail extends UserInfo{
    agreedNum: number
    articleNum: number
}