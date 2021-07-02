<template>
  <div class="sub-comment-list">
    <div class="sub-comment-item flex-row align-items-start" v-for="replies in (commentPage ? commentPage.content : comments)" :key="replies.id">
      <el-avatar :src="replies.createdUser.headImg" :size="40" >
        <font-awesome-icon icon="user" />
      </el-avatar>
      <div class="sub-comment-box-right flex-1 ml-2">
        <div class="flex-row align-items-baseline">
          <h5>{{replies.createdUser.username}}</h5>
          <span class="ml-2">
            <template v-for="(c, index) of replies.renderContent">
              <span :key="index" v-if="typeof c === 'string'">{{c}}</span>
              <component :key="index" v-else :is="c" />
            </template>
          </span>
        </div>
        <div class="text-sub">
          <span class="mr-3">{{replies.createdDate}}</span>
          <el-button type="text" :class="'mr-3' + (replies.isAgreed ? '' : ' text-sub')" v-on:click="()=>toggleSubCommentAgree(replies.id)">
            <font-awesome-icon :icon="[replies.isAgreed ? 'fas' : 'far', 'thumbs-up']"/>
            {{replies.agreedNum ? replies.agreedNum : ''}}
          </el-button>
          <el-button type="text" :class="'mr-3' + (replies.isTrod ? '' : ' text-sub')" v-on:click="()=>toggleSubCommentTread(replies.id)">
            <font-awesome-icon :icon="[replies.isTrod ? 'fas' : 'far', 'thumbs-down']"/>
            {{ replies.treadNum ? replies.treadNum : '' }}
          </el-button>
          <el-button type="text" v-on:click="()=>reply(replies)">回复</el-button>
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
    <span v-else-if="commentCount > 3" class="text-sub">共<span class="text-bold">{{commentCount}}</span>条回复，<el-button type="text" v-on:click="expand">点击查看</el-button></span>
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
library.add(faUser)

@Component({
  props: {
    articleId: {
      type: [String, Number],
      required: true
    },
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
    }
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
  articleId!: string|number
  commentId!: number
  comments!: Comment[]
  commentCount!: number
  commentPage!: Page<Comment>
  pageable!: Pageable
  isExpand!: boolean

  private async expand(): Promise<void>{
    this.isExpand = true
    await this.loadPage()
  }

  private async loadPage(): Promise<void>{
    this.commentPage = await CommentService.getArticleSubCommentPage(this.articleId, this.commentId, this.pageable)
  }

  /**
   * 回复, 把事件传出，让上级渲染回复组件进行回复
   */
  private reply(subComment: Comment): void{
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
    const result = await CommentService.toggleSubCommentAgree(this.articleId, this.commentId, subCommentId);
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
    const result = await CommentService.toggleSubCommentTread(this.articleId, this.commentId, subCommentId)
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
}
</script>

<style scoped>

</style>