<template>
  <div class="container-article">
    <transition name="transition-from-bottom" mode="out-in">
      <div v-if="articleList.length">
        <article-list-item v-for="article in articleList" :key="article.id" :info="article" />
      </div>
      <empty-data v-else />
    </transition>
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
import CommonUtils from "@/utils/CommonUtils";
import ElementPosition from "@/domain/ElementPosition";

interface Data{
  articleList: Article[]
  pageable: Pageable
}
@Component({
  components: {EmptyData, ArticleListItem},
})
export default class ArticlePage extends Vue{
  articleList!: Article[]
  pageable!: Pageable
  last = false
  elementPosition!: ElementPosition

  data() : Data{
    return {
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
    this.elementPosition = CommonUtils.getElementPosition(this.$el as HTMLElement)
  }

  unmounted(): void{
    document.removeEventListener("scroll", this.onStroll)
  }

  @Debounce()
  onStroll(): void{
    //如果不存在下一页，或没有滚动到距离底部200像素时，不进行加载
    if(this.last || (this.elementPosition.offsetTop + this.$el.clientHeight - document.scrollingElement.scrollTop - document.scrollingElement.clientHeight > 200)) return
    this.pageable.page ++
    this.loadNextPage()
  }

  protected async loadNextPage(): Promise<void>{
    const page = await ArticleService.pageAll(this.pageable)
    this.last = page.last
    this.articleList.push(...page.content)
  }
}
</script>
<style scoped lang="scss">
</style>