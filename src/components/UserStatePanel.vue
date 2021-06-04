<template>
  <el-card shadow="hover">
    <div class="user-state-panel-head">
      <el-avatar :src="userInfo ? userInfo.headImg : ''" class="user-state-panel-head-img" />
      <div v-if="userInfo">
        <span>{{ userInfo.nickname || userInfo.username }}</span>
      </div>
      <el-button type="text" v-else v-on:click="showLoginDialog = !showLoginDialog">登录/注册</el-button>
    </div>
    <div class="user-state-panel-btns" v-if="userInfo">
      <router-link to="/article/edit/new">
        <el-button style="width: 100%" size="small"><font-awesome-icon icon="plus" /></el-button>
      </router-link>
    </div>
    <el-dialog
        show-close
        close-on-press-escape
        :visible="showLoginDialog"
        v-on:close="showLoginDialog = false"
      >
      <h2 slot="title">登录</h2>
      <login-panel slot="default" v-on:logged="logged" />
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import UserInfo from "../domain/UserInfo";
import AuthenticationService from "../service/AuthenticationService";
import LoginPanel from "@/components/LoginPanel.vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

library.add(faPlus)

interface Data{
  userInfo: UserInfo
  showLoginDialog: boolean
}
export default {
  name: "UserStatePanel",
  components: {LoginPanel},
  data(): Data{
    return {
      userInfo: null,
      showLoginDialog: false
    }
  },
  created(): void{
    this.$_readUserInfo()
  },
  methods:{
    async $_readUserInfo(): Promise<void>{
      try {
        this.userInfo = await AuthenticationService.getSelfInfo()
      }catch (e) {
        console.error("not login", e)
      }
    },
    logged(): void{
      this.showLoginDialog = false
      this.$_readUserInfo()
    }
  }
}
</script>

<style scoped lang="scss">
.user-state-panel-head{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
.user-state-panel-head-img{
  margin-right: 1em;
}
.user-state-panel-btns{
  margin-top: 1em;
}
</style>