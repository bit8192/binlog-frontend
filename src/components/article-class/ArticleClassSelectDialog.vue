<template>
  <div>
    <el-dialog
        title="选择文章分类"
        :visible="visible"
        class="article-class-select-dialog"
        v-on:close="e=>this.$emit('close', e)"
    >
      <el-button size="small" v-on:click="addArticleClass">添加</el-button>
      <el-tree ref="tree" :props="treeProps" node-key="id" :load="loadNode" v-on:node-click="onSelect" :expand-on-click-node="false" lazy>
        <div class="flex-row justify-content-between align-items-center" style="flex: 1" slot-scope="{node, data}">
          <span class="text-title">{{data.title}}</span>
          <span>
            <el-button type="text" class="text-primary" v-on:click="(e)=>addSubArticleClass(e, data)">添加</el-button>
            <el-button type="text" class="text-sub" v-on:click="(e)=>editArticleClass(e, data)">修改</el-button>
            <el-button type="text" class="text-warning" v-on:click="(e)=>deleteArticleClass(e, data)">删除</el-button>
          </span>
        </div>
      </el-tree>
    </el-dialog>
    <el-dialog
        :title="addOrEdit ? '新增文章分类' : '编辑文章分类'"
        :visible="showArticleClassDialog"
        v-on:close="()=>showArticleClassDialog = false"
    >
      <article-class-form ref="articleClassForm" :value="articleClass" v-on:change="(result)=>this.articleClass = result" />
      <div slot="footer">
        <el-button size="small" v-on:click="()=>showArticleClassDialog = false">取消</el-button>
        <el-button type="primary" size="small" :loading="formSubmitBtnLoading" v-on:click="onFormSubmitBtnClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import ArticleClass from "@/domain/ArticleClass";
import EmptyData from "@/components/EmptyData.vue";
import ArticleClassForm from "@/components/article-class/ArticleClassForm.vue";
import ArticleClassService from "@/service/ArticleClassService";
import {ElTree, TreeNode} from "element-ui/types/tree";
import ArticleClassVo from "@/domain/ArticleClassVo";
import CommonUtils from "@/utils/CommonUtils";

declare interface Data{
  showArticleClassDialog: boolean //是否现实分类弹窗
  articleClass: ArticleClass //正在编辑的分类节点
  formSubmitBtnLoading: boolean //提交按钮的加载状态
  treeProps: any //ElTree的节点属性
  addArticleClassParent?: ArticleClassVo //添加的分类的父级节点
  addOrEdit: boolean //添加还是编辑： 添加true  编辑false
}
@Component({
  components: {ArticleClassForm, EmptyData},
  props: {
    visible: Boolean,
  }
})
export default class ArticleClassSelect extends Vue{
  visible!: boolean
  showArticleClassDialog!: boolean
  //新增/编辑对象
  articleClass!: ArticleClass
  formSubmitBtnLoading!: boolean
  treeProps!: any
  addArticleClassParent?: ArticleClassVo
  addOrEdit!: boolean
  treeRootNode?: TreeNode<number, ArticleClassVo>

  data(): Data{
    return {
      showArticleClassDialog: false,
      articleClass: {
        title: ""
      },
      formSubmitBtnLoading: false,
      treeProps: {label: 'title', isLeaf: (data: ArticleClassVo)=>data.childrenNum < 1},
      addArticleClassParent: null,
      addOrEdit: true
    }
  }

  /**
   * 节点选中事件
   */
  private onSelect(data: ArticleClassVo): void{
    this.$emit("select", Object.assign({}, data))
  }

  /**
   * 加载数据
   */
  private async loadNode(node: TreeNode<number, ArticleClassVo>, resolve: (_:ArticleClass[])=>void): Promise<void>{
    if(node.level === 0){
      this.treeRootNode = node
    }
    resolve((await ArticleClassService.searchByParent(node.data?.id)))
  }

  /**
   * 添加新的文章分类
   */
  private addArticleClass(): void{
    this.articleClass = {title: "", visible: true}
    this.addArticleClassParent = null
    this.addOrEdit = true
    this.showArticleClassDialog = true
  }

  /**
   * 添加子文章分类
   */
  private addSubArticleClass(e: TouchEvent, data: ArticleClassVo): void{
    e.stopPropagation()
    this.articleClass = {title: "", visible: true}
    this.addArticleClassParent = data
    this.addOrEdit = true
    this.showArticleClassDialog = true
  }

  /**
   * 修改
   */
  private editArticleClass(e: TouchEvent, data: ArticleClassVo): void{
    e.stopPropagation()
    this.articleClass = data
    this.addOrEdit = false
    this.showArticleClassDialog = true
  }

  /**
   * 删除
   */
  private deleteArticleClass(e: TouchEvent, data: ArticleClassVo): void{
    e.stopPropagation()
    this.$confirm("是否确定删除?", "提示")
        .then(async ()=>{
          await ArticleClassService.delete(data as ArticleClass)
          this.refreshTree()
        })
        .catch(CommonUtils.emptyFun)
  }

  /**
   * 刷新树节点
   */
  private refreshTree(key?: number){
    const tree = this.$refs.tree as ElTree<number, ArticleClassVo>
    const node = key ? tree.getNode(key) : this.treeRootNode
    if(!node) return;
    node.loaded = false;
    (node as any).loadData.call(node)
  }

  /**
   * 提交按钮点击
   */
  private async onFormSubmitBtnClick(): Promise<void>{
    const form = this.$refs.articleClassForm as ArticleClassForm;
    if(!(await form.validate())) return;
    this.formSubmitBtnLoading = true
    try{
      if(this.addOrEdit){
        if(this.addArticleClassParent){
          this.articleClass.parent = this.addArticleClassParent
        }
        await ArticleClassService.post(this.articleClass)
      }else{
        await ArticleClassService.put(this.articleClass)
      }
      this.refreshTree()
      this.showArticleClassDialog = false
    }finally {
      this.formSubmitBtnLoading = false
    }
  }
}
</script>
<style lang="scss">
</style>