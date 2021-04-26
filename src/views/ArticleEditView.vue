<template>
  <el-card class="article-edit-view">
    <h1>{{ title }}</h1>
    <el-form>
    </el-form>
    <markdown-editor />
  </el-card>
</template>

<script lang="ts">
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import {Component, Vue} from "vue-property-decorator";

interface Data{
  title: string
}

@Component({
  components: {MarkdownEditor},
  data(): Data{
    return {
      title: "写文章"
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