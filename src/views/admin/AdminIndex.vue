<template>
  <div class="flex-row admin-container">
    <el-menu style="width: 200px">
      <el-menu-item index="1">
        <i class="el-icon-s-data" />
        <span slot="title">概况</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-user-solid" />
        <span slot="title">用户</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"/>
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class AdminIndex extends Vue{
}
</script>

<style scoped lang="scss">
@import "src/style/var-layout";

.admin-container{
  height: $router-view-height;
}
</style>
