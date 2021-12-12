<template>
  <div class="container-article">
    <div v-if="articleList.length">
      <template v-for="article in articleList">
        <article-list-item :key="article.id" :info="article" />
      </template>
      <el-pagination layout="prev,pager,next" :current-page="pageable.page + 1" :page-count="pageCount" :page-size="pageable.size" v-on:current-change="gotoPage" />
    </div>
    <empty-data v-else />
    <el-backtop ref="backTop" />
  </div>
</template>

<script lang="ts">
import ArticleListItem from "@/components/article/ArticleListItem.vue";
import Article from "@/domain/Article";
import EmptyData from "@/components/EmptyData.vue";
import ArticleService from "@/service/ArticleService";
import Pageable from "@/domain/Pageable";
import {Component, Vue} from "vue-property-decorator";

@Component({
  components: {EmptyData, ArticleListItem},
  props: {
    queryParam: Object
  },
  watch: {
    queryParam(param): void{
      this.articleClassId = param.articleClassId
      this.tagIds = param.tagIds
      this.keywords = param.keywords
    }
  }
})
export default class ArticlePage extends Vue{
  articleList!: Article[]
  pageable!: Pageable
  last = false
  keywords: string
  articleClassId: number
  tagIds: Array<number>
  queryParam: {articleClassId: number, tagIds: Array<number>, keywords: string}
  pageCount: number

  data() : any{
    return {
      keywords: this.queryParam ? this.queryParam.keywords : "",
      articleClassId: this.queryParam ? this.queryParam.articleClassId : null,
      tagIds: this.queryParam ? this.queryParam.tagIds : [],
      articleList: [],
      pageable: {
        page: 0,
        size: 20
      },
      pageCount: 0
    }
  }

  mounted(): void {
    this.gotoPage()
  }

  private async gotoPage(pageNumber = 1): Promise<void>{
    this.pageable.page = pageNumber - 1
    const page = await ArticleService.pageAll(this.keywords, this.articleClassId, this.tagIds, this.pageable)
    this.last = page.last
    this.articleList = page.content
    this.pageCount = page.totalPages
    scrollTo(0, 0)
  }

  async refresh(keywords = "", articleClassId = 0, tagIds: Array<number> = []): Promise<void>{
    this.keywords = keywords;
    this.articleClassId = articleClassId;
    this.tagIds = tagIds;
    this.articleList = []
    this.last = false
    this.pageable.page = 0
    await this.gotoPage();
    (this.$refs.backTop as any).scrollToTop();
  }
}
</script>
<style scoped lang="scss">
</style>
