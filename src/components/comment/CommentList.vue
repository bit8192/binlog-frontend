<template>
  <div class="comment-list">
    <template v-if="comments.length > 0">
      <div class="comment-item flex-row align-items-start mt-2" v-for="comment in comments" :key="comment.id">
        <el-avatar v-if="comment.createdUser" :src="comment.createdUser.headImg" :size="50" class="mr-4" >
          <font-awesome-icon icon="user" size="lg" />
        </el-avatar>
        <el-avatar v-else :src="anonymousImg" :size="50" class="mr-4" />
        <div class="flex-1">
          <div class="comment-box-right">
            <h4 v-if="comment.createdUser">{{comment.createdUser.username}}</h4>
            <h4 v-else>ANONYMOUS</h4>
            <comment-content :content="comment.content" :members="comment.members" />
            <div class="color-text-sub">
              <span class="mr-3">{{comment.createdDate}}</span>
              <el-button v-if="!comment.removed" type="text" :class="'mr-3' + (comment.isAgreed ? '' : ' color-text-sub')" v-on:click="()=>toggleCommentAgree(comment.id)">
                <font-awesome-icon :icon="[comment.isAgreed ? 'fas' : 'far', 'thumbs-up']" />
                {{comment.agreedNum ? comment.agreedNum : ''}}
              </el-button>
              <el-button v-if="!comment.removed" type="text" :class="'mr-3' + (comment.isTrod ? '' : ' color-text-sub')" v-on:click="()=>toggleCommentTread(comment.id)">
                <font-awesome-icon :icon="[comment.isTrod ? 'fas' : 'far', 'thumbs-down']" />
                {{ comment.treadNum ? comment.treadNum : '' }}
              </el-button>
              <el-button v-if="!comment.removed" type="text" class="color-text-sub" v-on:click="()=>reply(comment, null)">
                <font-awesome-icon :icon="['far', 'comment']" />
              </el-button>
              <el-button type="text" class="color-text-sub" v-if="comment.content && comment.createdUser && comment.createdUser.id === (userInfo ? userInfo.id : null)" v-on:click="removeComment(comment)">
                删除
              </el-button>
            </div>
            <sub-comment-list ref="subCommentList" :comment-id="comment.id" :comments="comment.replies || []" :comment-count="comment.repliesNum || 0" v-on:reply="subReply" :user-info="userInfo" />
          </div>
          <comment-reply-input v-if="replyCommentId === comment.id" v-model="replyContent" v-on:submit="submitReply" :placeholder="'回复 @' + replyTargetUsername + ':'" />
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
import {
  faThumbsUp as faRegularThumbsUp,
  faThumbsDown as faRegularThumbsDown,
  faComment
} from "@fortawesome/free-regular-svg-icons";
import CommentService from "@/service/CommentService";
import Pageable from "@/domain/Pageable";
import EmptyData from "@/components/EmptyData.vue";
import Throttle from "@/decorators/Throttle";
import {AppProvider} from "@/App.vue";
import SubCommentList from "@/components/comment/SubCommentList.vue";
import CommentContent from "@/components/comment/CommentContent.vue";
import CommentReplyInput from "@/components/comment/CommentReplyInput.vue";
import Page from "@/domain/Page";
import ElementUtils from "@/utils/ElementUtils";
import UserInfo from "@/domain/UserInfo";

library.add(faUser, faSolidThumbsUp, faRegularThumbsUp, faSolidThumbsDown, faRegularThumbsDown, faComment)

@Component({
  components: {CommentReplyInput, CommentContent, SubCommentList, EmptyData},
  props: {
    loadData:{
      type: Function,
      required: true
    }
  },
  inject: ['app']
})
export default class CommentList extends Vue{
  app!: AppProvider
  loadData: (pageable: Pageable)=>Promise<Page<Comment>>
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
  userInfo?: UserInfo
  anonymousImg: string

  data(): any{
    return {
      comments: [],
      replyCommentId: null,
      replySubCommentId: null,
      replyTargetUsername: null,
      replyContent: "",
      userInfo: null,
      anonymousImg: require("@/assets/anonymous.webp")
    }
  }

  mounted(): void{
    //注册滚动事件
    if(document) document.addEventListener("scroll", this.onScroll)
    this.userInfo = this.app.getLoggedUserInfo()
    this.app.addUserInfoChangeListener(this.onUserInfoChange)
    this.loadCommentPage()
  }

  beforeDestroy(): void{
    if(document) document.removeEventListener("scroll", this.onScroll)
    this.app.removeUserInfoChangeListener(this.onUserInfoChange)
  }

  /**
   * 用户信息改变，即注销
   */
  onUserInfoChange(userInfo: UserInfo): void{
    this.userInfo = userInfo
  }

  @Throttle()
  onScroll(): void{
    if(ElementUtils.getScrollSurplus() < 500){
      if(this.isLoading || this.isLastPage) return
      this.pageable.page ++
      this.loadCommentPage()
    }
  }

  async loadCommentPage(): Promise<void>{
    this.isLoading = true
    try {
      const page = await this.loadData(this.pageable)
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
    const result = await CommentService.toggleCommentAgree(commentId);
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
    const result = await CommentService.toggleCommentTread(commentId)
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
    //提交回复
    let result: Comment
    if(this.replySubCommentId){
      result = await CommentService.replyComment(this.replySubCommentId, this.replyContent);
      this.replySubCommentId = null
    }else{
      result = await CommentService.replySubComment(this.replyCommentId, this.replyContent);
    }

    //将回复内容添加到列表中
    const subCommentListArr = this.$refs.subCommentList as Array<SubCommentList>
    const subCommentList = subCommentListArr.find(l=>l.commentId === this.replyCommentId)
    if(subCommentList.isExpand){
      subCommentList.addReply(result)
    }else{
      const comment = this.comments.find(c=>c.id === this.replyCommentId)
      comment.replies.push(result)
      comment.repliesNum ++
    }

    this.replyCommentId = null
    this.replyContent = ""
    this.replyTargetUsername = ""
  }

  async removeComment(comment: Comment): Promise<void>{
    if((await this.$confirm("是否确认删除", "警告")) !== "confirm") return;
    await CommentService.removeComment(comment.id)
    comment.content = ""
  }
}
</script>

<style scoped lang="scss">
@import "src/style/var-color";

.comment-box-right{
  border-top: 1px solid $color-divider;
}
</style>
