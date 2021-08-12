<template>
  <div class="user-transfer flex-row justify-content-center">
    <el-transfer :data="userList" v-model="selectedUserIds" :props="{key: 'id', label: 'username'}" :titles="['用户列表', '已选']" >
      <span slot-scope="{option}" class="d-inline-block" style="line-height: 40px">
        <el-avatar :src="option.headImg" style="vertical-align: bottom" class="mr-2" />
        <span>{{option.username}}</span>
      </span>
    </el-transfer>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import UserInfo from "@/domain/UserInfo";
import UserService from "@/service/UserService";

@Component({
  props: {
    value: {
      type: Array
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data(): any{
    return {
      userList: [],
      selectedUserIds: []
    }
  },
  async mounted(): Promise<void>{
    await this.loadUserList()
  },
  watch: {
    value(value: number[]){
      this.selectedUserIds = value
    },
    selectedUserIds(value: number[]){
      this.$emit("change", value)
    }
  }
})
export default class UserTransfer extends Vue{
  userList: UserInfo[]
  selectedUserIds: number[]

  // noinspection JSUnusedLocalSymbols
  private async loadUserList(): Promise<void>{
    this.userList = await UserService.getAllUserList()
  }

  /**
   * 获取已选中的用户信息列表
   */
  getSelectedUserList(): UserInfo[]{
    return this.userList.filter(u=>this.selectedUserIds.find(id=>id === u.id))
  }
}
</script>

<style lang="scss">
.user-transfer .el-transfer-panel__item .el-checkbox__input{
  top: 15px;
}
.user-transfer .el-transfer-panel__item{
  height: auto;
}
</style>
