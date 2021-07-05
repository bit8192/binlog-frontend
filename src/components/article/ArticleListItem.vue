<template>
  <transition-scroll-view name="transition-from-bottom">
    <el-card class="article-item" :body-style="{padding: 0}" shadow="hover">
      <router-link :to="'/article/' + info.id">
        <div class="article-item-header">
          <el-image class="article-item-cover" v-if="info.cover" :src="imagePath + info.cover.id" fit="cover" lazy>
            <error-image slot="error" />
          </el-image>
          <h2 class="article-item-title text-title text-ellipsis">
            {{info.title}}
          </h2>
        </div>
      </router-link>
      <div class="article-item-body">
        <div>
          <span class="text-sub text-article-item-info">{{ info.createdUser.nickname || info.createdUser.username }}</span>
          <span class="text-sub text-article-item-info">发表于{{ info.createdDate }}</span>
          <span class="text-sub text-article-item-info" v-if="info.isOriginal">原创文章</span>
          <router-link :to="'/article/article-class/' + info.articleClass.id" class="text-sub text-article-item-info" v-if="info.articleClass">
            <font-awesome-icon :icon="['fas', 'bars']" />
            {{info.articleClass.title}}
          </router-link>
        </div>
        <p class="text-content">
          {{ info.describe }}
        </p>
        <el-row class="article-item-image" :gutter="5" v-if="info.images && info.images.length">
          <el-col
              v-for="img in info.images"
              :key="img"
              :xs="info.images.length > 3 ? 6 : 24/info.images.length"
              :sm="4"
          >
            <el-image :src="img" :preview-src-list="info.images" fit="contain"/>
          </el-col>
        </el-row>
        <div class="tag-group" v-if="info.tags && info.tags.length">
          <!--suppress JSUnresolvedVariable, JSUnusedLocalSymbols -->
          <router-link v-for="tag of info.tags" :key="tag.id" :to="'/article/tags/' + tag.id">
            <el-tag size="mini" effect="plain">{{tag.title}}</el-tag>
          </router-link>
        </div>
        <div class="article-item-button-group no-margin-horizontal" :gutter="20">
          <el-button type="text" class="text-sub article-item-button">
            <font-awesome-icon :icon="['far', 'share-square']" />
            <span style="padding-left: .5em">{{info.forwardingNum}}</span>
          </el-button>
          <el-button type="text" class="text-sub article-item-button">
            <font-awesome-icon :icon="['far', 'comment']" />
            <span style="padding-left: .5em">{{info.commentNum}}</span>
          </el-button>
          <el-button type="text" class="text-sub article-item-button">
            <font-awesome-icon :icon="['far', 'thumbs-up']" />
            <span style="padding-left: .5em">{{info.agreedNum}}</span>
          </el-button>
          <el-button type="text" class="text-sub article-item-button">
            <font-awesome-icon :icon="['far', 'eye']" />
            <span style="padding-left: .5em">{{info.viewingNum}}</span>
          </el-button>
        </div>
      </div>
    </el-card>
  </transition-scroll-view>
</template>

<script lang="ts">
import {library} from "@fortawesome/fontawesome-svg-core"
import {faShareSquare, faComment, faThumbsUp, faEye} from "@fortawesome/free-regular-svg-icons"
import {faBars} from "@fortawesome/free-solid-svg-icons";
import TransitionScrollView from "@/components/TransitionScrollView.vue";
import ErrorImage from "@/components/ErrorImage.vue";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";

library.add(faShareSquare, faComment, faThumbsUp, faEye, faBars)

export default {
  name: "ArticleListItem",
  components: {ErrorImage, TransitionScrollView},
  props: {
    info: Object
  },
  data(): any{
    return {
      imagePath: URL_NET_DISK_FILE + "/get/"
    }
  }
}
</script>
<style scoped lang="scss">
@import "src/style/mixin-common";
@import "src/style/var-device-width";

.article-item{
  border-radius: $item-border-radius;
  @include background-item;
  margin-bottom: 1em;
}
.article-item-cover{
  display: block;
  max-height: 20em;
}
.article-item-header{
  position: relative;
}
.article-item-title{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: .5em;
  background-image: linear-gradient(to bottom, transparent, #333);
  color: white;
}
.article-item-body{
  padding: 0 1em;
}
.article-item-image{
  margin-top: 1em;
}
.article-item-button-group{
  font-size: 1.2em;
}
.article-item-button{
  padding: 1em 2em;
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
.text-content{
  margin: 0;
  @include text-ellipsis(5);
}
</style>