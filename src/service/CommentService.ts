import axios from "axios";
import {URL_ARTICLE} from "@/constants/UrlApiArticle";
import Pageable, {pageable2RequestParameters} from "@/domain/Pageable";
import Page from "@/domain/Page";
import ValueVo from "@/domain/ValueVo";
import {Comment} from "@/domain/Comment";
import {REG_EXP_SENSITIVE_CHAR} from "@/constants/RegExp";
import {CreateElement, VNode, VNodeComponentOptions} from "vue";

export default class CommentService{
    /**
     * 获取评论分页数据
     * @param articleId
     * @param pageable
     */
    static async getArticleCommentPage(articleId: number|string, pageable: Pageable): Promise<Page<Comment>>{
        const page = await axios.get<Page<Comment>, Page<Comment>>(URL_ARTICLE + "/" + articleId + "/comment", {
            params: pageable2RequestParameters(pageable)
        })
        this.handleCommentContent(page.content)
        page.content.forEach(c=>this.handleCommentContent(c.replies))
        return page
    }

    /**
     * 处理评论内容
     * @param comments
     * @private
     */
    private static handleCommentContent(comments: Comment[]){
        //替换@用户
        for (const comment of comments) {
            let content: Array<string|VNodeComponentOptions> = [comment.content];
            for (const member of comment.members) {
                const safeUsername = member.username.replace(REG_EXP_SENSITIVE_CHAR, "\\\\$0")
                const regexp = new RegExp('(^|\\s)@(' + safeUsername + ')($|\\s)', 'g')
                for (let i = 0; i < content.length; i++) {
                    const item = content[i]//正在替换的字符串
                    if(typeof item !== "string") break;//只有字符串才进行替换
                    const replaceResult = []//替换结果
                    const searchResult = item.matchAll(regexp)
                    let index = 0;//记录上一次匹配的位置，用于依次取出字符串
                    for (const result of searchResult) {
                        if(result.index > index){
                            replaceResult.push(item.substring(index, result.index))
                            index = result.index
                        }
                        replaceResult.push({
                            render(createElement:CreateElement): VNode{
                                return createElement("ElButton", {class: "comment-member mx-1", props: {type: "text"}}, "@" + result[2])
                            }
                        })
                        index += result[0].length
                    }
                    if(index < item.length){
                        replaceResult.push(item.substr(index))
                    }
                    const nextContent = content.splice(i, content.length - i - 1);
                    content = content.splice(0, i).concat(replaceResult, nextContent)
                    i+=replaceResult.length
                }
            }
            comment.renderContent = content
        }
    }

    /**
     * 提交评论
     * @param articleId
     * @param commentId
     * @param content
     */
    static async submitComment(articleId: number|string, commentId: number|string, content: string): Promise<Comment>{
        const result = await axios.post<Comment, Comment>(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/comment", {content});
        this.handleCommentContent([result])
        return result;
    }

    /**
     * 删除评论
     * @param articleId
     * @param commentId
     */
    static deleteComment(articleId: number|string, commentId: number|string): Promise<void>{
        return axios.delete(URL_ARTICLE + "/" + articleId + "/comment/" + commentId)
    }

    /**
     * 切换评论点赞状态
     * @param articleId
     * @param commentId
     */
    static toggleCommentAgree(articleId: number|string, commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/toggle-agree");
    }

    /**
     * 切换点踩状态
     * @param articleId
     * @param commentId
     */
    static toggleCommentTread(articleId: number|string, commentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/toggle-tread");
    }

    /**
     * 获取子评论数据
     * @param articleId
     * @param commentId
     * @param pageable
     */
    static async getArticleSubCommentPage(articleId: number|string, commentId: number|string, pageable: Pageable): Promise<Page<Comment>>{
        const page = await axios.get<Page<Comment>, Page<Comment>>(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/comment", {
            params: pageable2RequestParameters(pageable)
        });
        this.handleCommentContent(page.content)
        return page
    }

    /**
     * 提交子评论
     * @param articleId
     * @param commentId
     * @param subCommentId
     * @param content
     */
    static async submitSubComment(articleId: number|string, commentId: number|string, subCommentId: number|string, content: string): Promise<Comment>{
        const result = await axios.post<Comment, Comment>(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/comment/" + subCommentId + "/comment", {content});
        this.handleCommentContent([result]);
        return result;
    }

    /**
     * 删除子评论
     * @param articleId
     * @param commentId
     * @param subCommentId
     */
    static deleteSubComment(articleId: number|string, commentId: number|string, subCommentId: number|string): Promise<void>{
        return axios.delete(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/comment/" + subCommentId);
    }

    /**
     * 切换子评论点赞
     * @param articleId
     * @param commentId
     * @param subCommentId
     */
    static toggleSubCommentAgree(articleId: number|string, commentId: number|string, subCommentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/comment/" + subCommentId + "/toggle-agree");
    }

    /**
     * 切换子评论点踩
     * @param articleId
     * @param commentId
     * @param subCommentId
     */
    static toggleSubCommentTread(articleId: number|string, commentId: number|string, subCommentId: number|string): Promise<ValueVo<boolean>>{
        return axios.post(URL_ARTICLE + "/" + articleId + "/comment/" + commentId + "/comment/" + subCommentId + "/toggle-tread");
    }
}