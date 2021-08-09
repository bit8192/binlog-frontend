<template>
  <el-card>
    <ul class="tag-list-view-list">
      <li v-for="tag in tags" :key="tag.id">
        <router-link :to="'/article/tags/' + tag.id" >{{tag.title}}({{tag.articleNum}})</router-link>
      </li>
    </ul>
  </el-card>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Tag from "../domain/Tag";
import TagService from "../service/TagService";

@Component({
})
export default class TagListView extends Vue{
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
    this.tags = await TagService.listAll();
  }
}
</script>

<style scoped lang="scss">
.tag-list-view-list{
  list-style: none;
  padding: 0;
  margin: 0;
}
.tag-list-view-list>li{
  cursor: pointer;
  padding: 5px 1em;
}
.tag-list-view-list>li:hover{
   background-color: #f5f7fa;
 }
</style>
