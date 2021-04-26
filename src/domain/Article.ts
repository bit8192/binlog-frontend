import Tag from "@/domain/Tag";
import UploadFile from "@/domain/UploadFile";
import ArticleClass from "@/domain/ArticleClass";
import Author from "./Author";

export default interface Article {
    id?: number
    title?: string
    describe?: string
    tags?: Tag[]
    cover?: string
    articleClass?: ArticleClass
    content?: string
    isOrigin?: boolean
    recommend?: boolean
    top?: boolean
    orderNum?: number
    viewingNum?: number
    agreedNum?: number
    commentNum?: number
    forwardingNum?: number
    author?: Author
    createdDate?: string
    lastModifiedDate?: string
}