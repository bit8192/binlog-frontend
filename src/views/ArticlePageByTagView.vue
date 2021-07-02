<template>
  <article-page-by-tag :tag-id="tagId" />
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ArticlePageByTag from "@/components/article/ArticlePageByTag.vue";

@Component({
  components: {ArticlePageByTag}
})
export default class ArticlePageByTagView extends Vue{
  tagId!: number

  data(): any{
    return {
      tagId: this.$route.params.id
    }
  }
}
</script>

<style scoped>

</style>