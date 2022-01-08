<template>
  <div id="app">
    <el-header id="header">
      <transition name="transition-from-top" appear>
        <nav-menu :profile="systemProfile" />
      </transition>
    </el-header>
    <el-main id="main">
      <el-row type="flex" justify="center">
        <el-col :sm="16" :xs="24" id="content">
          <router-view/>
        </el-col>
      </el-row>
    </el-main>
    <el-footer id="footer">
      <span class="color-text-sub">{{systemProfile.copyRight}}</span>
      <span class="color-text-sub">powered by <a target="_blank" href="https://github.com/Bincker1973/binlog">binlog</a></span>
      <span v-if="systemProfile.icp"><a href="https://beian.miit.gov.cn/" target="_blank" class="color-text-sub">{{ systemProfile.icp }}</a></span>
      <span v-if="systemProfile.github">
        <a class="color-text-sub" target="_blank" :href="systemProfile.github">
          <font-awesome-icon :icon="['fab', 'github']" size="2x" />
        </a>
      </span>
    </el-footer>
    <el-dialog
        show-close
        close-on-press-escape
        v-model="showLoginDialog"
        @close="showLoginDialog = false"
    >
      <h2 slot="title">登录</h2>
      <login-panel ref="loginPanel" slot="default" @logged="logged" />
    </el-dialog>
  </div>
</template>
<script lang="ts">
import SystemProfile from "@/domain/SystemProfile";
import CommonService from "@/service/CommonService";
import NavMenu from "@/components/NavMenu.vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {Options, Vue} from "vue-class-component";
import LoginPanel from "@/components/authorize/LoginPanel.vue";
import NetworkError from "@/error/NetworkError";
import AuthenticationService from "@/service/AuthenticationService";
import UserDetail from "@/domain/UserDetail";
import {refreshVerifyCode, refreshVerifyCodeIfExpire} from "@/components/ChineseVerifyCode.vue";
import {MUTATION_IS_HAPPY, MUTATION_IS_LOGGED, MUTATION_SYSTEM_PROFILE, MUTATION_USER_INFO} from "./createStore";

library.add(faGithub)

export interface AppProvider{
  isLogged: ()=>boolean
  getLoggedUserInfo: ()=>UserDetail
  updateUserInfo: ()=>Promise<void>
  openLoginDialog: ()=>void
  addUserInfoChangeListener: (fun: (UserDetail)=>void)=>void
  removeUserInfoChangeListener: (fun: (UserDetail)=>void)=>void
  logout: ()=>Promise<void>
  binlogIsHappy: ()=>boolean
}

@Options({
  components: {NavMenu, LoginPanel},
  provide(): any{
    return {
      app: {
        //提供打开登录页面弹窗接口
        openLoginDialog: () => {
          this.showLoginDialog = true
        },
        //通知注销
        logout: async () => {
          await this.logout()
        },
      }
    };
  },
  watch: {
    showLoginDialog(value: boolean): void{
      if(value) refreshVerifyCodeIfExpire()
    }
  },
  /**
   * 异常处理
   * @param error
   */
  errorCaptured(error: Error): boolean{
    if(error instanceof NetworkError && error.response){
      switch (error.response.status) {
        case 401:
          this.userInfo = null
          this.showLoginDialog = true
          break;
        default:
          break;
      }
      return true;
    }
    return false;
  }
})
export default class App extends Vue{
  systemProfile!: SystemProfile
  showLoginDialog!: boolean
  userInfo?: UserDetail

  data(): any {
    return {
      systemProfile: {},
      showLoginDialog: false
    }
  }

  async created(): Promise<void> {
    this.systemProfile = await CommonService.getSystemProfile();
    this.$store.commit(MUTATION_SYSTEM_PROFILE, this.systemProfile);
    try {
      const userInfo = await AuthenticationService.getSelfInfo();
      this.logged(userInfo);
    }catch (e){
      //ignore
    }
    this.$store.commit(MUTATION_IS_HAPPY, !!this.userInfo || this.systemProfile?.expression === "happy")
    this.checkRedirect()
  }
  checkRedirect(): void{
    if(this.$route.query.redirectPath){
      this.$router.replace(this.$route.query.redirectPath as string);
      this.$route.query.redirectPath = null;
    }
  }

  logged(userInfo: UserDetail): void{
    this.userInfo = userInfo
    this.$store.commit(MUTATION_USER_INFO, userInfo)
    this.$store.commit(MUTATION_IS_LOGGED, true)
    this.showLoginDialog = false
  }

  async logout(): Promise<void>{
    await AuthenticationService.logout()
    //注销之后Session被清空，验证码需要重新拉取
    refreshVerifyCode()
    this.userInfo = null
    this.showLoginDialog = true
    this.$store.commit(MUTATION_USER_INFO, null)
  }
}
</script>

<style lang="scss">
@import "src/style/var-device-width";

</style>
