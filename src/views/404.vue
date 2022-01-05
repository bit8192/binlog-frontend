<template>
  <div class="text-center p-5">
    <div><span id="notfound-title" class="text-bold">404</span></div>
    <div><span class="color-text-sub">file not found</span></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({})
export default class NotFound extends Vue{
}
</script>

<style scoped>
#notfound-title{
  font-size: 6em;
  color: #909699;
}
</style>
