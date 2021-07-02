import Tag from "@/domain/Tag";
import ArticleClass from "@/domain/ArticleClass";
import NetDiskFile from "@/domain/NetDiskFile";
import UserInfo from "@/domain/UserInfo";

export default interface Article {
    id?: number
    title?: string
    describe?: string
    tags?: Tag[]
    cover?: NetDiskFile
    articleClass?: ArticleClass
    content?: string
    isOriginal?: boolean
    recommend?: boolean
    top?: boolean
    isPublic?: boolean
    orderNum?: number
    viewingNum?: number
    agreedNum?: number
    commentNum?: number
    forwardingNum?: number
    createdUser?: UserInfo
    createdDate?: string
    lastModifiedDate?: string
    isAgreed?: boolean
}