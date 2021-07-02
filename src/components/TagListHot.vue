<template>
<el-card shadow="hover">
  <div slot="header">
    <span>热门标签</span>
  </div>
  <ul class="tag-list-container">
    <li v-for="tag in tags" :key="tag.id">
      <el-link :underline="false" :href="'/article/tags/' + tag.id">{{tag.title}}({{tag.articleNum}})</el-link>
    </li>
  </ul>
</el-card>
</template>

<script lang="ts">
import Tag from "../domain/Tag";
import {Component, Vue} from "vue-property-decorator";
import TagService from "@/service/TagService";

@Component({})
export default class TagListHot extends Vue{
  tags!: Tag[]

  data(): any{
    return {
      tags: []
    }
  }

  created(): void{
    this.loadData()
  }

  private async loadData(): Promise<void>{
    this.tags = await TagService.hotList()
  }
}
</script>

<style scoped lang="scss">
.tag-list-container{
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>