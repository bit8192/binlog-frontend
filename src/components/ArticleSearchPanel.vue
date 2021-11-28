<template>
<el-card shadow="hover" >
  <el-input v-model="keywords" placeholder="搜索" suffix-icon="el-icon-search" clearable ref="searchInput" />
  <el-divider><span class="color-text-sub">分类</span></el-divider>
  <el-tree
      :props="articleTreeProps"
      node-key="id"
      :load="loadArticleClassTree"
      :expand-on-click-node="false"
      lazy
      v-on:node-click="onArticleClassClick"
      ref="articleClassTree"
      highlight-current
      class="article-search-panel-article-class-tree"
  />
  <el-divider><span class="color-text-sub">标签</span></el-divider>
  <ul class="list-style-none">
    <li v-for="tag in tags" :key="tag.id" class="d-inline-block m-2">
        <el-tag size="small" :effect="selectedTagIdSet.has(tag.id) ? 'dark' : 'plain'" v-on:click="e=>onTagClick(e, tag)" style="cursor: pointer">
          {{tag.title}}({{tag.articleNum}})
        </el-tag>
    </li>
  </ul>
  <span class="color-text-sub" style="font-size: .8em">按住Ctrl多选</span>
</el-card>
</template>

<script lang="ts">
import Tag from "../domain/Tag";
import {Component, Vue} from "vue-property-decorator";
import TagService from "@/service/TagService";
import ArticlePage from "@/components/article/ArticlePage.vue";
import ArticleClassVo from "@/domain/ArticleClassVo";
import {ElTree, TreeNode} from "element-ui/types/tree";
import ArticleClass from "@/domain/ArticleClass";
import ArticleClassService from "@/service/ArticleClassService";
import {ElInput} from "element-ui/types/input";

@Component({
  props: {
    articlePage: [ArticlePage, undefined]
  },
  watch: {
    $route: {
      handler(){
        this.readQueryParams();
      },
      deep: true
    }
  }
})
export default class ArticleSearchPanel extends Vue{
  tags!: Tag[]
  keywords: string
  articlePage: ArticlePage
  articleTreeProps = {label: 'title', isLeaf: (data: ArticleClassVo): boolean=>data.childrenNum < 1}
  selectedArticleClassId: number
  selectedTagIdSet: Set<number>
  loadArticleClassTreePromise?: Promise<ArticleClass[]> //加载文章分类时设置当前节点会失效，记录Promise当Promise完成时再设置当前节点

  data(): any{
    return {
      tags: [],
      keywords: '',
      selectedArticleClassId: null,
      selectedTagIdSet: new Set()
    }
  }

  readQueryParams(): void{
    const tree = this.$refs.articleClassTree as ElTree<number, ArticleClass>;
    if(this.$route.query.articleClassId){
      this.selectedArticleClassId = parseInt(Array.isArray(this.$route.query.articleClassId) ? this.$route.query.articleClassId[0] : this.$route.query.articleClassId);
    }else if(tree){
      tree.setCurrentKey(null)
    }
    if(this.$route.query.keywords){
      this.keywords = Array.isArray(this.$route.query.keywords) ? this.$route.query.keywords[0] : this.$route.query.keywords;
    }else{
      this.keywords = ""
    }
    this.selectedTagIdSet = new Set();
    if(this.$route.query.tagIds){
      this.selectedTagIdSet.add(parseInt(Array.isArray(this.$route.query.tagIds) ? this.$route.query.tagIds[0] : this.$route.query.tagIds));
    }
    if(this.$route.query.articleClassId || this.$route.query.keywords || this.$route.query.tagIds){
      this.$nextTick(()=>{
        this.refreshArticlePage();
        if(this.selectedArticleClassId){
          if(this.loadArticleClassTreePromise){
            this.loadArticleClassTreePromise.then(()=>{
              tree.setCurrentKey(this.selectedArticleClassId);
            });
          }else{
            tree.setCurrentKey(this.selectedArticleClassId);
          }
        }
      })
    }
  }

  mounted(): void{
    this.loadData();
    this.readQueryParams();
    (this.$refs.searchInput as ElInput).$el.addEventListener("keydown", this.onSearchInputKeydown)
  }

  private async loadData(): Promise<void>{
    this.tags = await TagService.hotList()
  }

  // noinspection JSMethodCanBeStatic
  /**
   * 加载文章分类数据
   */
  private async loadArticleClassTree(node: TreeNode<number, ArticleClassVo>, resolve: (articleClasses:Array<ArticleClass>)=>void): Promise<void>{
    this.loadArticleClassTreePromise = ArticleClassService.searchByParent(node.data?.id)
    this.loadArticleClassTreePromise.then(result=>resolve(result));
    this.loadArticleClassTreePromise.finally(()=>{
      this.loadArticleClassTreePromise = null
    });
  }

  /**
   * 回车搜索
   */
  private onSearchInputKeydown(event: KeyboardEvent){
    if(event.key === "Enter"){
      this.refreshArticlePage()
    }
  }

  /**
   * 分类被选择
   */
  private onArticleClassClick(articleClass: ArticleClass, _: any, element: Vue): void{
    if(articleClass.id === this.selectedArticleClassId){
      (this.$refs.articleClassTree as ElTree<number, ArticleClass>).setCurrentKey(null);
      (element.$el as HTMLElement).blur()
      this.selectedArticleClassId = null
    }else{
      this.selectedArticleClassId = articleClass.id
    }
    this.refreshArticlePage()
  }

  /**
   * 点击标签
   * @param event
   * @param tag
   * @private
   */
  private onTagClick(event: TouchEvent, tag: Tag): void{
    if(event.ctrlKey){
      if(this.selectedTagIdSet.has(tag.id)){
        this.selectedTagIdSet.delete(tag.id)
      }else{
        this.selectedTagIdSet.add(tag.id)
      }
      this.selectedTagIdSet = new Set<number>(this.selectedTagIdSet)
    }else{
      this.selectedTagIdSet = new Set<number>([tag.id]);
    }
    this.refreshArticlePage()
  }

  private refreshArticlePage(): void{
    if(!this.articlePage) return;
    this.articlePage.refresh(this.keywords, this.selectedArticleClassId, [...this.selectedTagIdSet])
  }
}
</script>

<style lang="scss">
@import "src/style/var-color";
.article-search-panel-article-class-tree .el-tree-node.is-current > .el-tree-node__content, .article-search-panel-article-class-tree .el-tree-node.is-current > .el-tree-node__content:hover{
  background-color: $color-selected;
  color: $color-white;
}
</style>
