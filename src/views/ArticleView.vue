<template>
  <div>
    <div :class="'article-cover transition-from-top-enter-active' + ((loadingArticle || loadingCover) ? ' transition-from-top-enter' : ' transition-from-top-enter-to')">
      <el-image :src="imagePath + info.cover.id" fit="contain" v-if="info.cover" v-on:load="()=>{this.$refs.catalog.refresh(); loadingCover = false}" v-on:error="()=>{this.$refs.catalog.refresh(); loadingCover = false}">
        <error-image slot="error" />
      </el-image>
      <div :class="['article-header', {'no-cover': !info.cover}]">
        <h1 class="article-title">{{info.title}}</h1>
        <div class="article-info">
          <span class="text-article-info">{{ info.createdUser ? info.createdUser.username || info.createdUser.username : "-" }}</span>
          <span class="text-article-info">发表于{{ info.createdDate }}</span>
          <span class="text-article-info" v-if="info.isOriginal">原创文章</span>
          <span class="text-article-info" v-if="info.articleClass">
            <font-awesome-icon :icon="['fas', 'bars']" />
            {{info.articleClass.title}}
          </span>
          <div class="text-article-info article-tag-list">
            <font-awesome-icon icon="tag"/>
            <!--suppress JSUnusedLocalSymbols, JSUnresolvedVariable -->
            <router-link v-for="tag of info.tags" :key="tag.id" :to="'/tag/' + tag.id" class="text-article-tag">
              {{tag.title}}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div :class="'mt-1 flex-row flex-direction-column-md align-items-start transition-from-bottom-enter-active' + (loadingArticle || loadingCover ? ' transition-from-bottom-enter' : ' transition-from-bottom-enter-to')">
      <el-card id="article-catalog-container" class="flex-1 d-none-md mr-1" :body-style="{padding: '6px'}">
        <article-catalog ref="catalog" id="article-catalog" element="article" />
      </el-card>
      <div class="flex-5 flex-1-md width-100 article-container">
        <markdown-it-vue id="article" :content="info.content || ''" />
      </div>
    </div>

    <el-card :class="'mt-1 transition-fade-in-enter-active' + (((app.binlogIsHappy() && loadingComments) || (!app.binlogIsHappy() && (loadingArticle || loadingCover))) ? ' transition-fade-in-enter' : ' transition-fade-in-enter-to')" :body-style="{padding: '5px 1em'}">
      <div class="flex-row justify-content-between align-items-center">
        <el-button type="text" ref="agreeButton" :class="'article-action' + (this.info.isAgreed ? '' : ' color-text-sub ')" title="不错哦" v-on:click="toggleAgree">
          <font-awesome-icon icon="thumbs-up" size="2x" />&nbsp;{{info.agreedNum}}
        </el-button>
        <a :href="payImage" class="color-text-sub article-action" target="_blank" title="请我喝一杯Java">
          <font-awesome-icon icon="coffee" size="2x" />
        </a>
        <el-button type="text" class="color-text-sub article-action" title="分享">
          <font-awesome-icon icon="share" size="2x"/>&nbsp;{{info.forwardingNum}}
        </el-button>
        <router-link :to="'edit/' + info.id" class="color-text-sub" v-if="info.createdUser && userInfo && info.createdUser.id === userInfo.id">
          <font-awesome-icon icon="edit" size="2x" />
        </router-link>
      </div>
    </el-card>
    <el-card :class="'mt-1 article-comment-container transition-fade-in-enter-active' + (loadingComments ? ' transition-fade-in-enter' : ' transition-fade-in-enter-to')" v-if="app.binlogIsHappy()">
      <h3 slot="header">{{info.commentNum}}评论</h3>
      <div class="flex-row position-relative">
        <el-avatar :src="userInfo ? userInfo.headImg : ''" :size="50" class="mr-4">
          <font-awesome-icon icon="user" size="lg" />
        </el-avatar>
        <comment-reply-input v-model="commentContent" v-on:submit="submitComment" class="flex-1" />
        <div v-if="!userInfo" class="flex-row justify-content-center align-items-center position-absolute bg-mask" style="left: 0; right:0; top:0; bottom: 0">
          <el-button v-on:click="this.app.openLoginDialog">登录后进行评论</el-button>
        </div>
      </div>
      <comment-list ref="commentList" :load-data="loadComments" class="mt-3"/>
    </el-card>
    <el-backtop />
  </div>
</template>

<script lang="ts">
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCoffee, faEdit, faShare, faTag, faThumbsUp, faUser} from "@fortawesome/free-solid-svg-icons";
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import ArticleCatalog from "@/components/article/ArticleCatalog.vue";
import ErrorImage from "@/components/ErrorImage.vue";
import ArticleService from "@/service/ArticleService";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import {Component as VueComponent} from "vue";
import {Component, Vue} from "vue-property-decorator";
import Article from "@/domain/Article";
import UserInfo from "@/domain/UserInfo";
import CommentList from "@/components/comment/CommentList.vue";
import EmptyData from "@/components/EmptyData.vue";
import {ElButton} from "element-ui/types/button";
import {AppProvider} from "@/App.vue";
import CommentReplyInput from "@/components/comment/CommentReplyInput.vue";
import {LOCAL_STORAGE_KEY_VIEWED_ARTICLE_IDS} from "@/constants/LocalStorageKeys";
import Pageable from "@/domain/Pageable";
import Page from "@/domain/Page";
import {Comment} from "@/domain/Comment";

library.add(faTag, faThumbsUp, faShare, faCoffee, faUser, faEdit)

@Component({
  components: {CommentReplyInput, EmptyData, CommentList, ErrorImage, ArticleCatalog, MarkdownItVue: MarkdownItVue as VueComponent},
  inject: ['app']
})
export default class ArticleView extends Vue{
  info!: Article
  imagePath!: string
  userInfo!: UserInfo
  app!: AppProvider
  commentContent!: string
  loadingArticle: boolean
  loadingCover: boolean
  loadingComments: boolean
  payImage = require("@/assets/pay.webp")

  data(): any{
    return {
      info: {id: parseInt(this.$route.params.id)},
      imagePath: URL_NET_DISK_FILE + "/get/",
      userInfo: this.app.getLoggedUserInfo(),
      commentContent: "",
      loadingArticle: true,
      loadingCover: true,
      loadingComments: true
    }
  }

  updated() :void{
    this.$nextTick(()=>{
      setTimeout(()=>{
        (this.$refs.catalog as ArticleCatalog).refresh();
      }, 0)
    })
  }

  async loadArticle(): Promise<void>{
    this.info = await ArticleService.getDetail(this.$route.params.id)
    if(document) document.title = this.info.title
    this.loadingArticle = false
    this.$nextTick(()=>{
      (this.$refs.catalog as ArticleCatalog).refresh()
    })
  }

  async created() : Promise<void>{
    await this.loadArticle();
    this.app.addUserInfoChangeListener(this.onUserInfoChange)
    await this.viewArticle();
    //没有封面则直接显示不用等待图片加载完成
    if(!this.info.cover){
      (this.$refs.catalog as ArticleCatalog).refresh();
      this.loadingCover = false;
    }
  }

  /**
   * 判断是否阅读过，没有阅读过提交阅读
   */
  async viewArticle(): Promise<void> {
    let viewedIds = localStorage.getItem(LOCAL_STORAGE_KEY_VIEWED_ARTICLE_IDS) as string || ""
    if(!viewedIds.includes(this.info.id.toString())){
      await ArticleService.view(this.info.id)
      if(viewedIds.length){
        viewedIds = this.info.id + "," + viewedIds
      }else{
        viewedIds = this.info.id.toString()
      }
      localStorage.setItem(LOCAL_STORAGE_KEY_VIEWED_ARTICLE_IDS, viewedIds);
    }
    if(viewedIds.length > 2000){
      let i = viewedIds.length;
      while (i > 2000) {
        i = viewedIds.lastIndexOf(",", i - 1)
      }
      viewedIds = viewedIds.substr(0, i)
      localStorage.setItem(LOCAL_STORAGE_KEY_VIEWED_ARTICLE_IDS, viewedIds)
    }
  }

  onUserInfoChange(userInfo: UserInfo): void{
    this.userInfo = userInfo
  }

  beforeDestroy(): void{
    this.app.removeUserInfoChangeListener(this.onUserInfoChange)
  }

  beforeRouteUpdate(): void{
    if(this.info && this.info.title && document) document.title = this.info.title
  }

  /**
   * 切换文章点赞
   */
  async toggleAgree(): Promise<void>{
    if(!this.info.id) return
    const result = await ArticleService.toggleAgree(this.info.id);
    this.info.isAgreed = result.value
    this.info.agreedNum += result.value ? 1 : -1;
    ((this.$refs.agreeButton as ElButton).$el as HTMLElement).blur()
  }

  /**
   * 加载评论
   */
  async loadComments(pageable: Pageable): Promise<Page<Comment>>{
    const result = ArticleService.getCommentPage(this.info.id, pageable)
    this.loadingComments = false;
    return result;
  }

  /**
   * 提交评论
   */
  async submitComment(): Promise<void>{
    if(!this.commentContent.trim()) {
      this.$message.warning("请输入评论内容");
      return;
    }
    const comment = await ArticleService.commenting(this.info.id, this.commentContent);
    (this.$refs.commentList as CommentList).addComment(comment);
    this.commentContent = ""
  }
}
</script>

<style lang="scss">
@import "src/style/var-device-width";
@import "src/style/var-color";

.article-cover{
  position: relative;
  .el-image{
    display: block;
    max-height: 500px;
  }
}
.article-header{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
  background-image: linear-gradient(to bottom, transparent, #333);
  color: white;
}
.article-header.no-cover{
  position: static;
  color: black;
  background-image: unset;
}
.article-title{
  font-size: 3em;
}
.text-article-info{
  font-size: .9em;
  color: #e4e6e8;
  margin-right: 2em;
  white-space: nowrap;
}
.article-header.no-cover>.article-info>.text-article-info{
  color: $color-text-normal;
}
.article-tag-list{
  display: inline-block;
}
.text-article-tag{
  margin-right: 1em;
}
#article-catalog-container{
  position: -webkit-sticky;
  position: sticky;
  top: 5px;
  bottom: 0;
}
#article-catalog{
  max-height: calc(100vh - 2em);
}
#article{
  margin-left: 5px;
  border-radius: 3px;
  padding: 1em 2em;
  background-color: white;
  overflow-x: auto;
}
@media (max-width: $device-width-md) {
  .article-title{
    font-size: 2em;
  }
  .article-container{
    border: none;
    &>.el-card__body{
      padding: 0;
    }
  }
  .article-comment-container>.el-card__body{
    padding: 10px;
  }
  #article{
    margin-left: 0;
    padding: 1em;
  }
}
.article-action>span>svg{
  vertical-align: text-bottom;
  margin-right: 5px;
}
</style>
