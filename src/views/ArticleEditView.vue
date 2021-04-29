<template>
  <el-card class="article-edit-view">
    <el-form>
      <el-form-item>
        <el-input placeholder="文章标题" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select value/>
      </el-form-item>
      <el-form-item label="标签">
        <el-select />
      </el-form-item>
      <el-form-item label="封面">
        <el-upload />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input type="textarea" />
      </el-form-item>
    </el-form>
    <markdown-editor v-model="content" />
  </el-card>
</template>

<script lang="ts">
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import {Component, Vue} from "vue-property-decorator";

interface Data{
  content: string
}

@Component({
  components: {MarkdownEditor},
  data(): Data{
    return {
      content: "# title  \nabcdefg\n> afwf\n* feda\n- afew\n+ afef\n"
    }
  }
})
export default class ArticleEditView extends Vue{
  created(): void{
    console.log(this.$route.params)
  }
}
</script>

<style scoped lang="scss">
.article-edit-view{
  margin-top: 1em;
}
</style>