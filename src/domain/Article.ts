import Tag from "@/domain/Tag";
import ArticleClass from "@/domain/ArticleClass";
import Author from "./Author";
import NetDiskFile from "@/domain/NetDiskFile";

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
    public?: boolean
    orderNum?: number
    viewingNum?: number
    agreedNum?: number
    commentNum?: number
    forwardingNum?: number
    author?: Author
    createdDate?: string
    lastModifiedDate?: string
}