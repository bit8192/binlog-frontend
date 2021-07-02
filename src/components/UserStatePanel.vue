<template>
  <el-card shadow="hover">
    <div class="user-state-panel-head">
      <el-avatar :src="userInfo ? userInfo.headImg : ''" class="user-state-panel-head-img" />
      <div v-if="userInfo">
        <span>{{ userInfo.nickname || userInfo.username }}</span>
      </div>
      <el-button type="text" v-else v-on:click="openLoginDialog">登录/注册</el-button>
    </div>
    <div class="user-state-panel-btns" v-if="userInfo">
      <router-link to="/article/edit/new">
        <el-button style="width: 100%" size="small"><font-awesome-icon icon="plus" /></el-button>
      </router-link>
    </div>
  </el-card>
</template>

<script lang="ts">
import UserInfo from "../domain/UserInfo";
import AuthenticationService from "../service/AuthenticationService";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Component, Vue} from "vue-property-decorator";
import {AppProvider} from "@/App.vue";

library.add(faPlus)

interface Data{
  userInfo: UserInfo
}
@Component({
  inject: ["app"],
})
export default class UserStatePanel extends Vue{
  userInfo!: UserInfo
  app!: AppProvider

  data(): Data{
    return {
      userInfo: null,
    }
  }

  created(): void{
    this.app.registerOnLoggedEvent(this.logged)
    this.readUserInfo()
  }

  beforeDestroy(): void{
    this.app.removeOnLoggedEvent(this.logged)
  }

  private async readUserInfo(): Promise<void>{
    this.userInfo = await AuthenticationService.getSelfInfo()
  }

  logged(userInfo: UserInfo): void{
    this.userInfo = userInfo
  }

  openLoginDialog(): void{
    this.app.openLoginDialog();
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