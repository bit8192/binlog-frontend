<template>
  <div>
    <el-card>
      <h2>关于这个小博客</h2>
      <p>欢迎访问我的博客！我是一名软件技术专业的大专狗，现已工作三四年了，一直想自己编写一个博客，可总是因为自己太完美主义，每次写了一点不满意又重写，这样反反复复了好几次，终于我决定现写完再慢慢优化，于是就有了这个我花了几个月时间编写的小网站。</p>
      <p>我会将我的一些稀奇古怪的想法、实战经历、编程技巧记录在这里，和大家一起分享、一起讨论、一起学习、一起成长。</p>
      <p>这个网站是面向个人的，我会把我自己需要用到的功能陆续实现，这些功能包括：密码管理、常用软件下载（它将自动解析来源并提供最新版本和历史版本）、表情包、统计资讯、网盘。</p>
      <p>这个项目是开源的，我会发布一篇搭建教程让大家都能拥有自己的博客，虽然写的不是很好，但是应该能满足大部分人的需求。如果有兴趣的话，可以联系我一起开发这个项目。</p>
      <p>另外，希望小伙伴们发表言论态度友好，遵守法律法规。</p>
      <h2>留言板</h2>
      <comment-reply-input v-model="commentContent" btn-title="留言" class="mt-2" placeholder="来都来了，不留下点什么吗？" />
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CommentReplyInput from "@/components/comment/CommentReplyInput.vue";
import {Component} from "vue-property-decorator";

@Component({
  components: {CommentReplyInput}
})
export default class About extends Vue {
  commentContent: string

  data(): any{
    return {
      commentContent: ""
    }
  }
}
</script>
