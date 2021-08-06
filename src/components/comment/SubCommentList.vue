<template>
  <div class="sub-comment-list">
    <div class="sub-comment-item flex-row align-items-start" v-for="reply in (commentPage ? commentPage.content : comments)" :key="reply.id">
      <el-avatar :src="reply.createdUser.headImg" :size="40" >
        <font-awesome-icon icon="user" />
      </el-avatar>
      <div class="sub-comment-box-right flex-1 ml-2">
        <div class="flex-row align-items-baseline">
          <h5 class="align-self-start" style="line-height: 40px">{{reply.createdUser.username}}</h5>
          <comment-content :content="reply.content" :members="reply.members" class="ml-2" />
        </div>
        <div class="color-text-sub">
          <span class="mr-3">{{reply.createdDate}}</span>
          <el-button v-if="!reply.removed" type="text" :class="'mr-3' + (reply.isAgreed ? '' : ' color-text-sub')" v-on:click="()=>toggleSubCommentAgree(reply.id)">
            <font-awesome-icon :icon="[reply.isAgreed ? 'fas' : 'far', 'thumbs-up']"/>
            {{reply.agreedNum ? reply.agreedNum : ''}}
          </el-button>
          <el-button v-if="!reply.removed" type="text" :class="'mr-3' + (reply.isTrod ? '' : ' color-text-sub')" v-on:click="()=>toggleSubCommentTread(reply.id)">
            <font-awesome-icon :icon="[reply.isTrod ? 'fas' : 'far', 'thumbs-down']"/>
            {{ reply.treadNum ? reply.treadNum : '' }}
          </el-button>
          <el-button v-if="!reply.removed" type="text" v-on:click="onReply(reply)" class="color-text-sub">
            <font-awesome-icon :icon="['far', 'comment']" />
          </el-button>
          <el-button type="text" class="color-text-sub" v-if="reply.content && reply.createdUser.id === (userInfo ? userInfo.id : null)" v-on:click="removeReply(reply)">删除</el-button>
        </div>
      </div>
    </div>
    <el-pagination
        v-if="isExpand && commentPage"
        :page-size="commentPage.size"
        :page-count="commentPage.totalPages"
        :current-page="commentPage.number + 1"
        layout="prev, pager, next"
        v-on:current-change="onCurrentPageChange"
        hide-on-single-page
    />
    <span v-else-if="commentCount > 3" class="color-text-sub">剩余<span class="text-bold">{{commentCount - comments.length}}</span>条回复，<el-button type="text" v-on:click="expand">点击查看</el-button></span>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Comment} from "@/domain/Comment";
import Pageable from "../../domain/Pageable";
import CommentService from "@/service/CommentService";
import Page from "@/domain/Page";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import CommentContent from "@/components/comment/CommentContent.vue";
import {faComment} from "@fortawesome/free-regular-svg-icons";
import UserInfo from "@/domain/UserInfo";
library.add(faUser, faComment)

@Component({
  components: {CommentContent},
  props: {
    commentId: {
      type: Number,
      required: true
    },
    comments: {
      type: Array,
      required: true
    },
    commentCount: {
      type: Number,
      required: true
    },
    userInfo: [Object, undefined]
  },
  data(): any{
    return {
      commentPage: null,
      pageable: {
        page: 0,
        size: 10
      },
      isExpand: false
    }
  }
})
export default class SubCommentList extends Vue{
  commentId!: number
  comments!: Comment[]
  commentPage!: Page<Comment>
  pageable!: Pageable
  isExpand!: boolean
  userInfo?: UserInfo

  private async expand(): Promise<void>{
    this.isExpand = true
    await this.loadPage()
  }

  private async loadPage(): Promise<void>{
    this.commentPage = await CommentService.getReplyPage(this.commentId, this.pageable)
  }

  /**
   * 回复, 把事件传出，让上级渲染回复组件进行回复
   */
  private onReply(subComment: Comment): void{
    this.$emit("reply", this.commentId, subComment)
  }

  /**
   * 上级进行评论完成后，通过该方法添加评论，就不用刷新列表了
   */
  addReply(comment: Comment): void{
    if(this.isExpand){
      this.commentPage.content.push(comment)
    }
  }

  /**
   * 切换子评论点赞
   */
  async toggleSubCommentAgree(subCommentId: number): Promise<void>{
    const result = await CommentService.toggleReplyAgree(subCommentId);
    let comment: Comment;
    if(this.isExpand){
      comment = this.commentPage.content.find(c=>c.id === subCommentId);
    }else{
      comment = this.comments.find(c=>c.id === subCommentId);
    }
    comment.agreedNum += result.value ? 1 : -1
    if(comment.isTrod && result.value) {
      comment.treadNum --
      comment.isTrod = false
    }
    comment.isAgreed = result.value
  }

  /**
   * 切换子评论点踩
   */
  async toggleSubCommentTread(subCommentId: number): Promise<void>{
    const result = await CommentService.toggleReplyTread(subCommentId)
    let comment: Comment
    if(this.isExpand){
      comment = this.commentPage.content.find(c=>c.id === subCommentId)
    }else{
      comment = this.comments.find(c=>c.id === subCommentId)
    }
    comment.treadNum += result.value ? 1 : -1
    if(comment.isAgreed && result.value) {
      comment.agreedNum --
      comment.isAgreed = false
    }
    comment.isTrod = result.value
  }

  /**
   * 跳转页码
   * @param page
   */
  async onCurrentPageChange(page: number): Promise<void>{
    this.pageable.page = page - 1
    await this.loadPage()
  }

  /**
   * 删除回复
   */
  async removeReply(reply: Comment): Promise<void>{
    if((await this.$confirm("是否确认删除", "警告")) !== "confirm") return;
    await CommentService.removeReply(reply.id)
    reply.content = ""
  }
}
</script>

<style scoped>

</style>
