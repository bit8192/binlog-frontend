<template>
  <article-page :query-param="{tagIds: [tagId]}" />
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ArticlePage from "@/components/article/ArticlePage.vue";

@Component({
  components: {ArticlePage}
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
