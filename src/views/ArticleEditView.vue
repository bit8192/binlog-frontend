<template>
  <transition name="transition-from-bottom" appear>
    <el-card class="article-edit-view">
      <el-form ref="form" :model="article" :rules="formRules">
        <el-form-item prop="title">
          <el-input placeholder="文章标题" v-model="article.title" />
        </el-form-item>
        <el-form-item prop="articleClass">
          <el-input
              :value="article.articleClass ? article.articleClass.title : ''"
              placeholder="类型"
              style="width: 100%"
              v-on:focus="()=>this.showArticleClassSelectDialog = true"
              v-on:clear="()=>this.article.articleClass = null"
              clearable
          />
        </el-form-item>
        <el-form-item prop="tags">
          <tag-select v-model="article.tags" :action="tagAction" :add-action="tagAddAction" />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <img v-if="article.cover" :src="imagePath + article.cover.id" alt="封面图片" height="100%" style="cursor: pointer; max-width: 100%" v-on:click="showCoverSelectDialog = !showCoverSelectDialog" />
          <div v-else class="article-edit-view-cover-select" v-on:click="showCoverSelectDialog = !showCoverSelectDialog">
            <el-icon name="plus" style="display: block" />
          </div>
          <el-dialog :visible="showCoverSelectDialog" v-on:close="()=>(this.showCoverSelectDialog = false) || this.$refs.form.validateField('cover')">
            <span slot="title">选择封面</span>
            <net-disk-file-list v-on:open="onSelectCover" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="选项">
          <el-checkbox label="公开" v-model="article.isPublic" />
          <el-checkbox label="原创" v-model="article.isOriginal" />
          <el-checkbox label="推荐" v-model="article.recommend" />
          <el-checkbox label="置顶" v-model="article.top" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="article.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="article.keywords" />
        </el-form-item>
        <el-form-item label="摘要" prop="describe">
          <el-input type="textarea" v-model="article.describe" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <markdown-editor :value="article.content" v-on:change="c=>article.content = c" style="width: 100%; line-height: initial" v-on:blur="()=>this.$refs.form.validateField('content')" v-on:pause="onPause" />
        </el-form-item>
        <article-class-select-dialog
            ref="articleClassSelectDialog"
            :visible="showArticleClassSelectDialog"
            v-on:select="onSelectArticleClass"
            v-on:close="()=>(this.showArticleClassSelectDialog = false) || this.$refs.form.validateField('articleClass')"
        />
        <el-form-item>
          <el-button type="success" size="lg" v-on:click="submit">提交</el-button>
          <el-button size="lg" v-on:click="autoSave">储存到本地</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </transition>
</template>

<script lang="ts">
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import {Component, Vue} from "vue-property-decorator";
import ArticleClassSelectDialog from "@/components/article-class/ArticleClassSelectDialog.vue";
import ArticleClassVo from "@/domain/ArticleClassVo";
import Article from "@/domain/Article";
import NetDiskFileList from "@/components/net-disk-file/NetDiskFileList.vue";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import NetDiskFile from "@/domain/NetDiskFile";
import {REG_EXP_IMAGE_FILE} from "@/constants/RegExp";
import {ElForm} from "element-ui/types/form";
import ArticleService from "@/service/ArticleService";
import TagSelect from "@/components/TagSelect.vue";
import {URL_TAG, URL_TAG_LIST_ALL} from "@/constants/UrlApiTag";
import {LOCAL_STORAGE_KEY_ARTICLE} from "@/constants/LocalStorageKeys";
import NetDiskFileService from "@/service/NetDiskFileService";
import DateUtils from "@/utils/DateUtils";
import CodeMirror from "codemirror";

@Component({
  components: {TagSelect, NetDiskFileList, ArticleClassSelectDialog, MarkdownEditor},
  data(): any{
    return {
      showArticleClassSelectDialog: false,
      showCoverSelectDialog: false,
      article: {
        title: '',
        articleClass: null,
        tags: [],
        cover: null,
        keywords: '',
        describe: '',
        content: '',
        isOriginal: true,
        recommend: false,
        top: false,
        isPublic: true,
        orderNum: undefined,
      },
      tagAction: URL_TAG_LIST_ALL,
      tagAddAction: URL_TAG,
      imagePath: URL_NET_DISK_FILE + "/get/"
    }
  }
})
export default class ArticleEditView extends Vue{
  showArticleClassSelectDialog!: boolean
  showCoverSelectDialog!: boolean
  article!: Article
  tagAction: string
  tagAddAction: string
  formRules = {
    title: [
      { required: true, message: "必填项" },
      { min: 2, max: 255, message: "输入2-255个字符" },
    ],
    articleClass: { required: true, message: "必填项" },
    orderNum: { min: 0, max: 999, message: "范围[0, 999]" },
    describe: { required: true, message: "必填项" },
    content: { required: true, message: "必填项" }
  }
  autoSaveInterval: number

  created(): void{
    this.loadData()
  }

  async loadData(): Promise<void>{
    const articleCache = localStorage.getItem(LOCAL_STORAGE_KEY_ARTICLE)
    if(this.$route.params.id === 'new'){
      if(articleCache){
        try {
          await this.$confirm("检测到本地保存有数据，是否进行编辑（否则将覆盖）")
          this.article = JSON.parse(articleCache);
        }catch (e) {
          localStorage.removeItem(LOCAL_STORAGE_KEY_ARTICLE)
        }
      }
    } else {
      if(articleCache){
        try {
          await this.$confirm("检测到本地保存有数据，是否进行编辑（否则将覆盖）")
          this.article = JSON.parse(articleCache)
        }catch (e) {
          this.article = await ArticleService.getDetail(this.$route.params.id)
          localStorage.removeItem(LOCAL_STORAGE_KEY_ARTICLE)
        }
      }else{
        this.article = await ArticleService.getDetail(this.$route.params.id)
      }
    }
    if(this.article && this.article.id && this.article.id !== +this.$route.params.id){
      await this.$router.replace({path: '/article/edit/' + this.article.id})
    }
    this.autoSaveInterval = setInterval(this.autoSave, 600000)//十分钟自动保存一次
  }

  beforeDestroy(): void{
    clearInterval(this.autoSaveInterval)
  }

  /**
   * 自动保存
   */
  autoSave(): void{
    if(this.article.content) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ARTICLE, JSON.stringify(this.article))
      this.$message.info("本地已保存")
    }
  }

  /**
   * 文章分类被选择
   */
  private onSelectArticleClass(articleClass: ArticleClassVo): void{
    this.showArticleClassSelectDialog = false
    this.article.articleClass = articleClass
  }

  private onSelectCover(file: NetDiskFile){
    if(!file.name.match(REG_EXP_IMAGE_FILE)){
      this.$message.error("请选择（jpg、jpeg、png、webp）文件")
      return
    }
    this.article.cover = file
    this.showCoverSelectDialog = false
  }

  private async submit(): Promise<void>{
    const form = this.$refs.form as ElForm;
    if(! await form.validate()) {
      this.$message.error("请完成表单")
      return
    }

    //提交
    if(this.$route.params.id === "new"){
      await ArticleService.add(this.article)
    }else{
      await ArticleService.update(this.article)
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY_ARTICLE)
    this.$router.back()
  }

  /**
   * 上传图片
   */
  private async onPause(e: ClipboardEvent, editor: CodeMirror.Editor): Promise<void>{
    if(e.clipboardData.files.length){
      const netDiskFile = await NetDiskFileService.uploadMaterial(this.article.title || DateUtils.formatDate(), e.clipboardData.files[0],)
      if(netDiskFile.mediaType.includes("image")){
        editor.replaceSelections(editor.getSelections().map(()=>"![image](" + URL_NET_DISK_FILE + "/get/" + netDiskFile.id + ")"), "around")
      }else{
        editor.replaceSelections(editor.getSelections().map(()=>"[file](" + URL_NET_DISK_FILE + "/get/" + netDiskFile.id + ")"), "around")
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/style/var-color";
.article-edit-view{
  margin-top: 1em;
}
.article-edit-view-cover-select{
  display: inline-block;
  border: #aaa dashed 1px;
  border-radius: 6px;
  padding: 3em;
  cursor: pointer;
}
.is-error .article-edit-view-cover-select{
  border: $color-danger dashed 1px;
  color: $color-danger;
}
</style>
