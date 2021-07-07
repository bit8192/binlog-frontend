<template>
  <div id="app">
    <el-header id="header">
      <transition name="transition-from-top" appear>
        <nav-menu :profile="systemProfile" />
      </transition>
    </el-header>
    <el-main id="main">
      <el-row type="flex" justify="center">
        <el-col :sm="16" :xs="24" id="content" style="padding-top: 1em">
          <router-view/>
        </el-col>
      </el-row>
    </el-main>
    <el-footer id="footer">
      <span class="text-sub">{{systemProfile.copyRight}}</span>
      <span class="text-sub">powered by <a  target="_blank" href="//bincker.cn">bincker</a></span>
      <span><a href="https://beian.miit.gov.cn/" target="_blank" class="text-sub">{{systemProfile.ipc}}</a></span>
      <span>
        <a class="text-sub" target="_blank" :href="systemProfile.github" v-if="systemProfile.github">
          <font-awesome-icon :icon="['fab', 'github']" size="2x" />
        </a>
      </span>
    </el-footer>
    <el-dialog
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
import UserInfo from "@/domain/UserInfo";
import AuthenticationService from "@/service/AuthenticationService";

library.add(faGithub)

export interface AppProvider{
  isLogged: ()=>boolean
  getLoggedUserInfo: ()=>UserInfo
  openLoginDialog: ()=>void
  registerOnLoggedEvent: (fun: (UserInfo)=>void)=>void
  removeOnLoggedEvent: (fun: (UserInfo)=>void)=>void
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
        //提供打开登录页面弹窗接口
        openLoginDialog: ()=>{
          this.showLoginDialog = true
        },
        //向下级组件提供事件注册方法
        registerOnLoggedEvent: (fun: (UserInfo)=>void)=>{
          this.onLoggedEventFunctions.push(fun)
        },
        removeOnLoggedEvent: (fun: (UserInfo)=>void)=>{
          const index = this.onLoggedEventFunctions.findIndex(f=>f===fun)
          if(index < 0) return
          this.onLoggedEventFunctions.splice(index, 1)
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
  onLoggedEventFunctions = new Array<(UserInfo) => void>()
  userInfo?: UserInfo

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
  }

  logged(userInfo: UserInfo): void{
    this.userInfo = userInfo
    this.showLoginDialog = false
    this.onLoggedEventFunctions.forEach(fun=>{
      try{
        fun(userInfo)
      }catch (e){
        console.error(e)
      }
    })
  }

  /**
   * 异常处理
   * @param error
   */
  errorCaptured(error: Error): void{
    console.log("captured error", error)
    if(error instanceof NetworkError){
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