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
      <span class="color-text-sub">powered by <a target="_blank" href="//bincker.cn">bincker</a></span>
<!--      <span v-if="systemProfile.ipc"><a href="https://beian.miit.gov.cn/" target="_blank" class="color-text-sub">{{systemProfile.ipc}}</a></span>-->
      <span v-if="systemProfile.github">
        <a class="color-text-sub" target="_blank" :href="systemProfile.github">
          <font-awesome-icon :icon="['fab', 'github']" size="2x" />
        </a>
      </span>
    </el-footer>
    <el-dialog
        id="login-dialog"
        show-close
        close-on-press-escape
        :visible="showLoginDialog"
        v-on:close="showLoginDialog = false"
    >
      <h2 slot="title">登录</h2>
      <login-panel ref="loginPanel" slot="default" v-on:logged="logged" />
    </el-dialog>
  </div>
</template>
<script lang="ts">
import SystemProfile from "@/domain/SystemProfile";
import CommonService from "@/service/CommonService";
import NavMenu from "@/components/NavMenu.vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {Component, Vue} from "vue-property-decorator";
import LoginPanel from "@/components/LoginPanel.vue";
import NetworkError from "@/error/NetworkError";
import AuthenticationService from "@/service/AuthenticationService";
import UserDetail from "@/domain/UserDetail";

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

@Component({
  components: {NavMenu, LoginPanel},
  provide(): any{
    return {
      app: {
        //判断是否已经登录，而不用去调用获取用户信息进行判断
        isLogged: ()=>{
          return !!this.userInfo;
        },
        //获取当前登录用户信息
        getLoggedUserInfo: ()=>this.userInfo,
        /**
         * 通知更新用户信息
         */
        updateUserInfo: async ()=>{
          this.logged(await AuthenticationService.getSelfInfo())
        },
        //提供打开登录页面弹窗接口
        openLoginDialog: ()=>{
          this.showLoginDialog = true
        },
        //向下级组件提供事件注册方法
        addUserInfoChangeListener: (fun: (UserDetail)=>void)=>{
          this.userInfoChangeListeners.push(fun)
        },
        removeUserInfoChangeListener: (fun: (UserDetail)=>void)=>{
          const index = this.userInfoChangeListeners.findIndex(f=>f===fun)
          if(index < 0) return
          this.userInfoChangeListeners.splice(index, 1)
        },
        //通知注销
        logout: async ()=>{
          this.logout()
        },
        binlogIsHappy: ()=>{
          return !!this.userInfo || (this.systemProfile && this.systemProfile.expression === "happy");
        }
      }
    }
  },
  watch: {
    showLoginDialog(value: boolean): void{
      if(value && this.$refs.loginPanel){
        (this.$refs.loginPanel as LoginPanel).refreshVerifyCode()
      }
    }
  }
})
export default class App extends Vue{
  systemProfile!: SystemProfile
  showLoginDialog!: boolean
  userInfoChangeListeners = new Array<(UserInfo) => void>()
  userInfo?: UserDetail

  data(): any {
    return {
      systemProfile: {},
      showLoginDialog: false
    }
  }

  async created(): Promise<void> {
    this.systemProfile = await CommonService.getSystemProfile()
    try {
      const userInfo = await AuthenticationService.getSelfInfo();
      this.logged(userInfo)
    }catch (e){
      //ignore
    }
    this.checkRedirect()
  }

  checkRedirect(): void{
    if(this.$route.query.redirectPath){
      this.$router.replace(this.$route.query.redirectPath as string)
    }
  }

  logged(userInfo: UserDetail): void{
    this.userInfo = userInfo
    this.showLoginDialog = false
    this.userInfoChangeListeners.forEach(fun=>{
      try{
        fun(userInfo)
      }catch (e){
        console.error(e)
      }
    })
  }

  async logout(): Promise<void>{
    await AuthenticationService.logout()
    this.userInfo = null
    this.showLoginDialog = true
    this.userInfoChangeListeners.forEach(fun=>{
      try {
        fun(null)
      }catch (e) {
        console.error(e)
      }
    })
  }

  /**
   * 异常处理
   * @param error
   */
  errorCaptured(error: Error): void{
    if(error instanceof NetworkError && error.response){
      switch (error.response.status) {
        case 401:
          this.userInfo = null
          this.showLoginDialog = true
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss">
@import "src/style/var-device-width";

</style>
