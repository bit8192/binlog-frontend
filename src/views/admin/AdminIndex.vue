<template>
  <div class="flex-row admin-container">
    <el-menu style="width: 200px" router :default-active="$route.path">
      <el-menu-item index="/admin/overview">
        <i class="el-icon-s-data" />
        <template #title>
          <span>概况</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/admin/request-log">
        <i class="el-icon-tickets" />
        <template #title>
          <span>请求日志</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/admin/user-management">
        <i class="el-icon-user-solid" />
        <template #title>
          <span>用户</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/admin/system-setting">
        <i class="el-icon-setting"/>
        <template #title>
          <span>设置</span>
        </template>
      </el-menu-item>
    </el-menu>
    <div class="flex-1 bg-white" style="overflow-y: auto">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({})
export default class AdminIndex extends Vue{
}
</script>

<style scoped lang="scss">
@import "src/style/var-layout";

.admin-container{
  height: $router-view-height;
}
</style>
