<script lang="ts">
import ArticlePage from "@/components/article/ArticlePage.vue";
import {Component} from "vue-property-decorator"
import ArticleService from "@/service/ArticleService";

@Component({
  props: {
    tagId: [Number, String]
  }
})
export default class ArticlePageByTag extends ArticlePage{
  tagId!: number

  protected async loadNextPage(): Promise<void> {
    const page = await ArticleService.pageByTag(this.tagId, this.pageable)
    this.last = page.last
    this.articleList.push(...page.content)
  }
}
</script>

<style scoped>

</style>