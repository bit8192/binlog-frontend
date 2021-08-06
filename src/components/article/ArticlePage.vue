<template>
  <div class="container-article">
    <div v-if="articleList.length">
      <article-list-item v-for="article in articleList" :key="article.id" :info="article" />
      <p v-if="last" class="color-text-sub text-center py-3">说实话，我没了</p>
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
import Debounce from "@/decorators/Debounce";
import ElementUtils from "@/utils/ElementUtils";

@Component({
  components: {EmptyData, ArticleListItem},
})
export default class ArticlePage extends Vue{
  articleList!: Article[]
  pageable!: Pageable
  last = false
  keywords: string
  articleClassId: number
  tagIds: Array<number>

  data() : any{
    return {
      keywords: "",
      articleClassId: null,
      tagIds: [],
      articleList: [],
      pageable: {
        page: 0,
        size: 20
      }
    }
  }

  mounted(): void {
    this.loadNextPage()
    document.addEventListener("scroll", this.onStroll)
  }

  beforeDestroy(): void{
    document.removeEventListener("scroll", this.onStroll)
  }

  @Debounce()
  onStroll(): void{
    //如果不存在下一页，或没有滚动到距离底部200像素时，不进行加载
    if(this.last || ElementUtils.getScrollSurplus() > 200) return
    this.pageable.page ++
    this.loadNextPage()
  }

  protected async loadNextPage(): Promise<void>{
    const page = await ArticleService.pageAll(this.keywords, this.articleClassId, this.tagIds, this.pageable)
    this.last = page.last
    this.articleList.push(...page.content)
  }

  async refresh(keywords = "", articleClassId = 0, tagIds: Array<number> = []): Promise<void>{
    this.keywords = keywords;
    this.articleClassId = articleClassId;
    this.tagIds = tagIds;
    this.articleList = []
    this.last = false
    this.pageable.page = 0
    await this.loadNextPage();
    (this.$refs.backTop as any).scrollToTop();
  }
}
</script>
<style scoped lang="scss">
</style>
