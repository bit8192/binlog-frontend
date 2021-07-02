<template>
  <el-card>
    <el-tree :props="treeProps" node-key="id" :load="loadNode" :expand-on-click-node="false" lazy>
      <div slot-scope="{node, data}">
        <el-link :underline="false" :href="'/article/article-class/' + data.id">{{data.title}}</el-link>
      </div>
    </el-tree>
  </el-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ArticleClassVo from "../domain/ArticleClassVo";
import {TreeNode} from "element-ui/types/tree";
import ArticleClass from "../domain/ArticleClass";
import ArticleClassService from "../service/ArticleClassService";

@Component({
})
export default class ArticleClassListView extends Vue{
  treeProps!: any

  data(): any{
    return {
      treeProps: {label: 'title', isLeaf: (data: ArticleClassVo)=>data.childrenNum < 1},
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * 加载数据
   */
  private async loadNode(node: TreeNode<number, ArticleClassVo>, resolve: (articleClasses:Array<ArticleClass>)=>void): Promise<void>{
    resolve((await ArticleClassService.searchByParent(node.data?.id)))
  }
}
</script>

<style scoped lang="scss">
</style>