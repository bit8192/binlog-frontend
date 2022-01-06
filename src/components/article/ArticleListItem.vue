<template>
  <el-card
      :class="[
          'article-item transition-from-bottom-enter-active',
          {'transition-from-bottom-enter': info.cover && loading},
          {'transition-from-bottom-enter-to': !info.cover || !loading},
          {'article-item-with-cover': !!info.cover}
          ]"
      :body-style="{padding: 0}"
      shadow="hover"
  >
    <router-link :to="'/article/' + info.id" v-if="info.cover">
      <div class="article-item-header">
        <el-image class="article-item-cover" :src="imagePath + info.cover.id" fit="cover" lazy @load="loading = false">
          <template v-slot:placeholder>
            <el-skeleton loading>
              <el-skeleton-item variant="image" />
            </el-skeleton>
          </template>
          <template v-slot:error>
            <error-image />
          </template>
        </el-image>
      </div>
    </router-link>
    <div class="article-item-body">
      <router-link :to="'/article/' + info.id">
        <h2 class="article-item-title color-text-title text-ellipsis">
          {{info.title}}
        </h2>
      </router-link>
      <div>
        <span class="color-warning text-article-item-info" v-if="info.top"><font-awesome-icon icon="thumbtack" />置顶</span>
        <span class="color-warning text-article-item-info" v-if="info.recommend"><font-awesome-icon icon="fire" />推荐</span>
        <span class="color-text-sub text-article-item-info">{{ info.createdUser.username }}</span>
        <span class="color-text-sub text-article-item-info">发表于{{ info.createdDate }}</span>
        <span class="color-text-sub text-article-item-info" v-if="info.isOriginal">原创文章</span>
        <router-link :to="'/?articleClassId=' + info.articleClass.id" class="color-text-sub text-article-item-info" v-if="info.articleClass">
          <font-awesome-icon :icon="['fas', 'bars']" />
          {{info.articleClass.title}}
        </router-link>
      </div>
      <div class="tag-group" v-if="info.tags?.length">
        <router-link v-for="tag of info.tags" :key="tag.id" :to="'/?tagIds=' + tag.id">
          <el-tag size="small" effect="plain" class="bg-transparent">{{tag.title}}</el-tag>
        </router-link>
      </div>
      <p class="article-item-describe color-text-content">
        {{ info.describe }}
      </p>
      <el-row class="article-item-image" :gutter="5" v-if="info.images?.length">
        <el-col
            v-for="img in info.images"
            :key="img"
            :xs="info.images.length > 3 ? 6 : 24/info.images.length"
            :sm="4"
        >
          <el-image :src="img" :preview-src-list="info.images" fit="contain"/>
        </el-col>
      </el-row>
      <div class="article-item-button-group no-margin-horizontal">
        <el-button type="text" class="article-item-button">
          <font-awesome-icon :icon="['far', 'share-square']" />
          <span style="padding-left: .5em">{{info.forwardingNum}}</span>
        </el-button>
        <el-button type="text" class="article-item-button">
          <font-awesome-icon :icon="['far', 'comment']" />
          <span style="padding-left: .5em">{{info.commentNum}}</span>
        </el-button>
        <el-button type="text" :class="'article-item-button' + (info.isAgreed ? ' active' : '')" @click="toggleAgree">
          <font-awesome-icon :icon="['far', 'thumbs-up']" />
          <span style="padding-left: .5em">{{info.agreedNum}}</span>
        </el-button>
        <el-button type="text" class="article-item-button">
          <font-awesome-icon :icon="['far', 'eye']" />
          <span style="padding-left: .5em">{{info.viewingNum}}</span>
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import {library} from "@fortawesome/fontawesome-svg-core"
import {faShareSquare, faComment, faThumbsUp, faEye} from "@fortawesome/free-regular-svg-icons"
import {faBars, faFire, faThumbtack} from "@fortawesome/free-solid-svg-icons";
import ErrorImage from "@/components/ErrorImage.vue";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import {Options, Vue} from "vue-class-component";
import ArticleService from "@/service/ArticleService";
import Article from "@/domain/Article";

library.add(faShareSquare, faComment, faThumbsUp, faEye, faBars, faThumbtack, faFire)

@Options({
  components: {ErrorImage},
  props: {
    info: Object
  },
  data(): any{
    return {
      imagePath: URL_NET_DISK_FILE + "/get/",
      loading: true,
    }
  }
})
export default class ArticleListItem extends Vue{
  info!: Article

  async toggleAgree(): Promise<void>{
    const result = await ArticleService.toggleAgree(this.info.id)
    this.info.isAgreed = result.value
    this.info.agreedNum += result.value ? 1 : -1
  }
}
</script>
<style scoped lang="scss">
@import "src/style/mixin-common";
@import "src/style/var-device-width";
@import "src/style/var-color";

.article-item{
  border-radius: $item-border-radius;
  @include background-item;
  margin-bottom: 1em;
}
.article-item-with-cover{
  position: relative;
  overflow: hidden;
}
.article-item-cover{
  display: block;
  max-height: 20em;
}
.article-item-header{
}
.article-item-title{
  padding-top: .5em;
  padding-bottom: .5em;
}
.article-item-body{
  padding: 0 1em;
  display: flex;
  flex-flow: column nowrap;
}
.article-item-with-cover .article-item-body{
  position: absolute;
  left: 50%;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  transform: translateX(100%);
  transition: transform 3s cubic-bezier(0,.5,0,1);
}
.article-item-with-cover:hover .article-item-body{
  transform: translateX(1px);
  box-shadow: 0 2px 12px 0 black;
}
.article-item-with-cover .article-item-cover{
  transition: transform 10s ease-in-out;
}
.article-item-with-cover:hover .article-item-cover{
  transform: scale(1.05);
}
.article-item-describe{
  flex: 1;
}
.article-item-image{
  margin-top: 1em;
}
.article-item-button-group{
  font-size: 1.2em;
}
.article-item-button{
  padding: 1em 2em;
  color: $color-text-sub;
}
.article-item-button.active{
  color: $color-primary;
}
@media (max-width: $device-width-xs) {
  .article-item-button-group{
    display: flex;
    justify-content: space-evenly;
  }
  .article-item-button{
    padding: 1em;
    margin-right: 0;
  }
}
.text-article-item-info{
  font-size: .85em;
  margin-right: 1em;
}
.color-text-content{
  margin: 0;
  @include text-ellipsis(5);
}
</style>
