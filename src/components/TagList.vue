<template>
<el-card shadow="hover">
  <div slot="header">
    <span>热门标签</span>
  </div>
  <ul class="tag-list-container">
    <li v-for="tag in tags" :key="tag.id">
      <el-button type="text">{{tag.title}}</el-button>
    </li>
  </ul>
</el-card>
</template>

<script lang="ts">
import Tag from "../domain/Tag";

interface Data{
  tags: Tag[]
}
export default {
  name: "TagList",
  data(): Data{
    return {
      tags: [
        {id: 0, title: "java"},
        {id: 1, title: "php"},
        {id: 2, title: "c/c++"},
        {id: 3, title: "c#"},
        {id: 4, title: "python"},
        {id: 5, title: "js"},
        {id: 6, title: "html/css"},
      ]
    }
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