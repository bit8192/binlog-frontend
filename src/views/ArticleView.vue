<template>
  <div>
    <transition name="el-fade-in" appear>
      <div class="article-cover">
        <el-image :src="imagePath + info.cover.id" fit="cover" v-if="info.cover" v-on:load="this.$refs.catalog.refresh">
          <error-image slot="error" />
        </el-image>
        <div class="article-header">
          <h1 class="article-title">{{info.title}}</h1>
          <div class="article-info">
            <span class="text-article-info">{{ info.createdUser ? info.createdUser.nickname || info.createdUser.username : "-" }}</span>
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
    </transition>
    <el-row class="mt-1" type="flex" style="align-items: stretch" :gutter="5">
      <el-col :sm="5">
        <el-card id="article-catalog-container" class="hidden-sm-and-down">
          <article-catalog ref="catalog" id="article-catalog" element="article" />
        </el-card>
      </el-col>
      <el-col :sm="19" :xs="24">
        <el-card>
          <markdown-it-vue id="article" :content="info.content || ''" />
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-1">
      <div class="flex-row justify-content-between align-items-center">
        <el-button type="text" ref="agreeButton" :class="'article-action' + (this.info.isAgreed ? '' : ' text-sub ')" title="不错哦" v-on:click="toggleAgree">
          <font-awesome-icon icon="thumbs-up" size="2x" />&nbsp;{{info.agreedNum}}
        </el-button>
        <el-button type="text" class="text-sub article-action" title="可怜可怜我吧">
          <font-awesome-icon icon="donate" size="2x" />&nbsp;捐赠
        </el-button>
        <el-button type="text" class="text-sub article-action" title="分享">
          <font-awesome-icon icon="share" size="2x"/>&nbsp;{{info.forwardingNum}}
        </el-button>
        <router-link :to="'edit/' + info.id" class="text-sub" v-if="info.createdUser && userInfo && info.createdUser.id === userInfo.id">
          <font-awesome-icon icon="edit" size="2x" />
        </router-link>
      </div>
    </el-card>
    <el-card class="mt-1">
      <h3 slot="header">{{info.commentNum}}评论</h3>
      <div class="flex-row position-relative">
        <el-avatar :src="userInfo ? userInfo.headImg : ''" :size="50" class="mr-4">
          <font-awesome-icon icon="user" size="lg" />
        </el-avatar>
        <el-input type="textarea" :rows="2" class="mx-2 flex-1" :autofocus="!!userInfo" v-model="commentContent" ></el-input>
        <el-button v-on:click="submitComment">发表</el-button>
        <div v-if="!userInfo" class="flex-row justify-content-center align-items-center position-absolute bg-mask" style="left: 0; right:0; top:0; bottom: 0">
          <el-button v-on:click="this.app.openLoginDialog">登录后进行评论</el-button>
        </div>
      </div>
      <comment-list ref="commentList" :article-id="info.id" class="mt-3"/>
    </el-card>
    <el-backtop />
  </div>
</template>

<script lang="ts">
import {library} from "@fortawesome/fontawesome-svg-core";
import {faDonate, faEdit, faShare, faTag, faThumbsUp, faUser} from "@fortawesome/free-solid-svg-icons";
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
library.add(faTag, faThumbsUp, faShare, faDonate, faUser, faEdit)

@Component({
  components: {EmptyData, CommentList, ErrorImage, ArticleCatalog, MarkdownItVue: MarkdownItVue as VueComponent},
  inject: ['app']
})
export default class ArticleView extends Vue{
  info!: Article
  imagePath!: string
  userInfo!: UserInfo
  app!: AppProvider
  commentContent!: string

  data(): any{
    return {
      info: {id: this.$route.params.id},
      imagePath: URL_NET_DISK_FILE + "/get/",
      userInfo: this.app.getLoggedUserInfo(),
      commentContent: ""
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
    document.title = this.info.title
    this.$nextTick(()=>{
      (this.$refs.catalog as ArticleCatalog).refresh()
    })
  }

  created() : void{
    this.loadArticle()
    this.app.addUserInfoChangeListener(this.onUserInfoChange)
  }

  onUserInfoChange(userInfo: UserInfo): void{
    this.userInfo = userInfo
  }

  beforeDestroy(): void{
    this.app.removeUserInfoChangeListener(this.onUserInfoChange)
  }

  beforeRouteUpdate(): void{
    if(this.info && this.info.title) document.title = this.info.title
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
   * 提交评论
   */
  async submitComment(): Promise<void>{
    if(!this.commentContent.length) {
      this.$message.warning("请输入评论内容");
      return;
    }
    const comment = await ArticleService.submitComment(this.info.id, this.commentContent);
    (this.$refs.commentList as CommentList).addComment(comment);
    this.commentContent = ""
  }
}
</script>

<style scoped lang="scss">
@import "src/style/var-device-width";
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
.article-title{
  font-size: 3em;
}
.text-article-info{
  font-size: .9em;
  color: #e4e6e8;
  margin-right: 2em;
  white-space: nowrap;
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
@media (max-width: $device-width-xs) {
  .article-title{
    font-size: 2em;
  }
  #article{
    margin-left: 0;
  }
}
.article-action>span>svg{
  vertical-align: text-bottom;
  margin-right: 5px;
}
</style>