export default interface ArticleClass{
    id?: number
    title: string
    visible?: boolean
    orderNum?: number
    parent?: ArticleClass
    children?: ArticleClass[]
}