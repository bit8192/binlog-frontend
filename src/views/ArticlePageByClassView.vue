<template>
  <article-page :query-param="{articleClassId: id}" />
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ArticlePage from "@/components/article/ArticlePage.vue";

declare interface Data{
  id: number
}
@Component({
  components: {ArticlePage},
})
export default class ArticlePageByClassView extends Vue{
  type!: number

  data(): Data{
    return {
      id: parseInt(this.$route.params.id)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
