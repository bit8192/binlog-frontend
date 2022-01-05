<template>
<div class="empty-data">
  <p class="m-0"><span class="color-text-sub">_(:3 ⌒ﾞ)_</span></p>
  <p class="m-0"><span class="color-text-sub">啥玩儿都没有</span></p>
</div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({})
export default class EmptyData extends Vue{}
</script>

<style scoped lang="scss">
.empty-data{
  padding: 3em;
  text-align: center;
}
</style>
