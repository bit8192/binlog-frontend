<template>
  <article-page-by-class :article-class-id="id" />
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import ArticlePageByClass from "@/components/article/ArticlePageByClass.vue";

declare interface Data{
  id: number
}
@Component({
  components: {ArticlePageByClass},
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