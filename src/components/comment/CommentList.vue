<template>
  <div class="comment-list">
    <template v-if="comments.length > 0">
      <div class="comment-item flex-row align-items-start mt-2" v-for="comment in comments" :key="comment.id">
        <el-avatar :src="comment.createdUser.headImg" :size="50" class="mr-4" >
          <font-awesome-icon icon="user" size="lg" />
        </el-avatar>
        <div class="flex-1">
          <div class="comment-box-right">
            <h4>{{comment.createdUser.username}}</h4>
            <p>
              <template v-for="(c, index) of comment.renderContent">
                <span :key="index" v-if="typeof c === 'string'">{{c}}</span>
                <component :key="index" :is="c" v-else />
              </template>
            </p>
            <div class="text-sub">
              <span class="mr-3">{{comment.createdDate}}</span>
              <el-button type="text" :class="'mr-3' + (comment.isAgreed ? '' : ' text-sub')" v-on:click="()=>toggleCommentAgree(comment.id)">
                <font-awesome-icon :icon="[comment.isAgreed ? 'fas' : 'far', 'thumbs-up']" />
                {{comment.agreedNum ? comment.agreedNum : ''}}
              </el-button>
              <el-button type="text" :class="'mr-3' + (comment.isTrod ? '' : ' text-sub')" v-on:click="()=>toggleCommentTread(comment.id)">
                <font-awesome-icon :icon="[comment.isTrod ? 'fas' : 'far', 'thumbs-down']" />
                {{ comment.treadNum ? comment.treadNum : '' }}
              </el-button>
              <el-button type="text" v-on:click="()=>reply(comment, null)">回复</el-button>
            </div>
            <sub-comment-list ref="subCommentList" :article-id="articleId" :comment-id="comment.id" :comments="comment.replies" :comment-count="comment.repliesNum" v-on:reply="subReply" />
          </div>
          <div class="flex-row" v-if="replyCommentId === comment.id">
            <el-input type="textarea" :rows="2" :placeholder="'回复 @' + replyTargetUsername + ':'" v-model="replyContent"/>
            <el-button class="ml-2" v-on:click="submitReply">发表</el-button>
          </div>
        </div>
      </div>
    </template>
    <empty-data v-else />
</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Comment} from "@/domain/Comment";
import {library} from "@fortawesome/fontawesome-svg-core";
import {
  faThumbsUp as faSolidThumbsUp,
  faThumbsDown as faSolidThumbsDown,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as faRegularThumbsUp, faThumbsDown as faRegularThumbsDown} from "@fortawesome/free-regular-svg-icons";
import CommentService from "@/service/CommentService";
import Pageable from "@/domain/Pageable";
import EmptyData from "@/components/EmptyData.vue";
import Throttle from "@/decorators/Throttle";
import {AppProvider} from "@/App.vue";
import SubCommentList from "@/components/comment/SubCommentList.vue";

library.add(faUser, faSolidThumbsUp, faRegularThumbsUp, faSolidThumbsDown, faRegularThumbsDown)

@Component({
  components: {SubCommentList, EmptyData},
  props: {
    articleId: {
      required: true
    }
  },
  inject: ['app']
})
export default class CommentList extends Vue{
  app!: AppProvider
  articleId!: number
  comments: Comment[]
  pageable: Pageable = {
    page: 0,
    size: 20
  }
  isLastPage: boolean
  isLoading = false
  replyCommentId?: number //回复评论id
  replySubCommentId?: number //回复子评论id
  replyTargetUsername?: string //回复对象用户名
  replyContent!: string //回复内容

  data(): any{
    return {
      comments: [],
      replyCommentId: null,
      replySubCommentId: null,
      replyTargetUsername: null,
      replyContent: "",
    }
  }

  mounted(): void{
    //注册滚动事件
    document.addEventListener("scroll", this.onScroll)
    this.loadCommentPage()
  }

  unmounted(): void{
    document.removeEventListener("scroll", this.onScroll)
  }

  @Throttle()
  onScroll(): void{
    const scrollingElement = document.scrollingElement as HTMLElement
    if(scrollingElement.scrollHeight - scrollingElement.scrollTop - window.innerHeight < 500){
      if(this.isLoading || this.isLastPage) return
      this.pageable.page ++
      this.loadCommentPage()
    }
  }

  async loadCommentPage(): Promise<void>{
    this.isLoading = true
    try {
      const page = await CommentService.getArticleCommentPage(this.articleId, this.pageable)
      this.isLastPage = page.last
      this.comments.push(...page.content)
    }finally {
      this.isLoading = false
    }
  }

  /**
   * 刚评论过后，不用刷新，直接调用此方法添加评论
   * @param comment
   */
  addComment(comment: Comment): void{
    this.comments.unshift(comment)
  }

  /**
   * 刷新
   */
  refresh(): void{
    this.pageable.page = 0
    this.loadCommentPage()
  }

  /**
   * 切换评论点赞
   */
  async toggleCommentAgree(commentId: number): Promise<void>{
    const result = await CommentService.toggleCommentAgree(this.articleId, commentId);
    const comment = this.comments.find(c=>c.id === commentId);
    comment.agreedNum += result.value ? 1 : -1
    if(comment.isTrod && result.value) {
      comment.treadNum --
      comment.isTrod = false
    }
    comment.isAgreed = result.value
  }

  /**
   * 切换评论点踩
   */
  private async toggleCommentTread(commentId: number): Promise<void>{
    const result = await CommentService.toggleCommentTread(this.articleId, commentId)
    const comment = this.comments.find(c=>c.id === commentId);
    comment.treadNum += result.value ? 1 : -1
    if(comment.isAgreed && result.value) {
      comment.agreedNum --
      comment.isAgreed = false
    }
    comment.isTrod = result.value
  }

  /**
   * 评论事件
   */
  private reply(comment: Comment, subComment: Comment): void{
    if(!this.app.isLogged()){
      this.app.openLoginDialog()
      return
    }
    this.replyCommentId = comment.id;
    if(subComment){
      this.replySubCommentId = subComment.id;
      this.replyTargetUsername = subComment.createdUser.username
    }else{
      this.replyTargetUsername = comment.createdUser.username
    }
  }

  /**
   * 子评论点击评论事件
   */
  private subReply(commentId: number, subComment: Comment): void{
    const comment = this.comments.find(c=>c.id === commentId);
    this.reply(comment, subComment)
  }

  /**
   * 发表回复
   * @private
   */
  private async submitReply(): Promise<void>{
    if(!this.replyContent || !this.replyCommentId){
      return
    }
    const subCommentListArr = this.$refs.subCommentList as Array<SubCommentList>
    const subCommentList = subCommentListArr.find(l=>l.commentId === this.replyCommentId)
    let result: Comment
    if(this.replySubCommentId){
      result = await CommentService.submitSubComment(this.articleId, this.replyCommentId, this.replySubCommentId, this.replyContent);
      this.replySubCommentId = null
    }else{
      result = await CommentService.submitComment(this.articleId, this.replyCommentId, this.replyContent);
    }
    if(subCommentList.isExpand){
      subCommentList.addReply(result)
    }else{
      this.comments.find(c=>c.id === this.replyCommentId).replies.push(result)
    }
    this.replyCommentId = null
    this.replyContent = ""
    this.replyTargetUsername = ""
  }
}
</script>

<style scoped lang="scss">
@import "src/style/var-color";

.comment-box-right{
  border-top: 1px solid $color-divider-border;
}
</style>