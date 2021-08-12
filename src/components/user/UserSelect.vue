<template>
  <el-select v-model="result" filterable v-on:change="r=>$emit('change', r)" placeholder="选择用户" :size="size">
    <el-option v-for="user of userList" :key="user.id" :value="user.id" :label="user.username" class="flex-row align-items-center justify-content-between" style="height: 45px">
      <el-avatar :src="user.headImg" :size="40" />
      <span style="font-size: 1em">{{user.username}}</span>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserInfo from "../../domain/UserInfo";
import UserService from "@/service/UserService";

@Component({
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: Number,
    size: String
  },
  watch: {
    value(v: number){
      this.result = v
    }
  }
})
export default class UserSelect extends Vue{
  userList: Array<UserInfo>
  result: number
  value: number

  data(): any{
    return {
      userList: [],
      result: this.value
    }
  }

  mounted(): void{
    this.loadData();
  }

  async loadData(): Promise<void>{
    this.userList = await UserService.getAllUserList();
  }
}
</script>

<style scoped lang="scss">

</style>
