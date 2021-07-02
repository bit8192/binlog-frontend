<script lang="ts">
import {Component} from "vue-property-decorator";
import ArticlePage from "@/components/article/ArticlePage.vue";
import ArticleService from "@/service/ArticleService";

@Component({
  props: {
    articleClassId: Number
  }
})
export default class ArticlePageByClass extends ArticlePage{
  articleClassId!: number

  protected async loadNextPage(): Promise<void> {
    const page = await ArticleService.pageByArticleClass(this.articleClassId, this.pageable)
    this.last = page.last
    this.articleList.push(...page.content)
  }
}
</script>

<style scoped>

</style>