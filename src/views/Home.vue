<template>
  <el-row class="container" type="flex" :gutter="10">
    <el-col :md="18" :xs="24">
      <article-page ref="articlePage" />
    </el-col>
    <el-col :md="6" :xs="24" class="home-panel-right">
      <user-state-panel class="mb-1" v-if="isHappy" />
      <bloggers-panel class="mb-1" />
      <div class="follow-panel">
        <article-search-panel :article-page="articlePage"/>
        <el-card class="mt-1">
          <template #header>
            <h3>阳光男孩 在线磕头</h3>
          </template>
          <a :href="payImage" target="_blank" title="请我喝一杯Java">
            <el-image :src="begImage" />
          </a>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import ArticlePage from "@/components/article/ArticlePage.vue";
import ArticleSearchPanel from "@/components/ArticleSearchPanel.vue";
import CommonService from "@/service/CommonService";
import UserStatePanel from "@/components/UserStatePanel.vue";
import {Options, Vue} from "vue-class-component";
import BloggersPanel from "@/components/BloggersPanel.vue";

@Options({
  components: {BloggersPanel, UserStatePanel, ArticleSearchPanel, ArticlePage},
  computed: {
    isHappy(){
      return this.$store.state.isHappy
    }
  },
})
export default class Home extends Vue{
  articlePage: ArticlePage
  begImage = require("@/assets/beg.jpg")
  payImage = require("@/assets/pay.webp")

  data(): any{
    return {
      articlePage: undefined,
    }
  }

  mounted(): void{
    this.articlePage = this.$refs.articlePage as ArticlePage
  }

  async created() : Promise<void>{
    const systemProfile = await CommonService.getSystemProfile()
    if(document) document.title = systemProfile.name
  }
}
</script>
<style lang="scss">
@import "src/style/var-device-width";
.container{
  align-items: stretch;
}
.follow-panel{
  position: -webkit-sticky;
  position: sticky;
  top: 1em;
}
.home-panel-right{
}
@media screen and (max-width: $device-width-xs){
  .container{
    flex-flow: column-reverse wrap;
  }
  .follow-panel{
    position: unset;
    top: unset;
    margin-bottom: 1em;
  }
}
</style>
