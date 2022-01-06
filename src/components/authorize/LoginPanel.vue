<template>
  <el-tabs :active-name="systemProfile.useQQAuthorize || systemProfile.useGithubAuthorize ? 'oauth2' : 'username-password'" @click-tab="onTabsClick" ref="tabs">
    <el-tab-pane label="合作帐号登录" :disabled="!systemProfile.useQQAuthorize && !systemProfile.useGithubAuthorize" name="oauth2" >
      <div class="flex-row flex-wrap">
        <qq-authorize-button v-if="systemProfile.useQQAuthorize" @authorized="onQqAuthorized" @success="onLoginSuccess" ref="qqAuthorizeBtn" />
        <github-authorize-button v-if="systemProfile.useGithubAuthorize" @authorized="onGithubAuthorized" @success="onLoginSuccess" ref="githubAuthorizeBtn" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="帐号密码登录" name="username-password">
      <username-password-login-form ref="usernameLoginForm" @success="onLoginSuccess" />
    </el-tab-pane>
    <el-tab-pane label="注册" name="register" v-if="systemProfile.allowRegister">
      <register-form @rebind="rebind" ref="registerForm" @success="onLoginSuccess" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import ChineseVerifyCode, {refreshVerifyCodeIfExpire} from "@/components/ChineseVerifyCode.vue";
import { Options, Vue } from 'vue-class-component';
import CommonService from "@/service/CommonService";
import QqAuthorizeButton from "@/components/authorize/QqAuthorizeButton.vue";
import GithubAuthorizeButton from "@/components/authorize/GithubAuthorizeButton.vue";
import SystemProfile from "@/domain/SystemProfile";
import UserInfo from "@/domain/UserInfo";
import UsernamePasswordLoginForm from "@/components/authorize/UsernamePasswordLoginForm.vue";
import AuthenticationService from "@/service/AuthenticationService";
import RegisterForm from "@/components/authorize/RegisterForm.vue";
import {ElMessage} from "element-plus";

@Options({
  components: {RegisterForm, UsernamePasswordLoginForm, GithubAuthorizeButton, QqAuthorizeButton, ChineseVerifyCode},
  data(){
    return {
      systemProfile: {}
    }
  }
})
export default class LoginPanel extends Vue{
  systemProfile: SystemProfile
  prevTabName = ""

  async created(): Promise<void>{
    this.systemProfile = await CommonService.getSystemProfile()
  }

  // noinspection JSMethodCanBeStatic
  private onTabsClick(tab: any): void{
    if(tab.name === "username-password"){
      refreshVerifyCodeIfExpire()
    }else if(tab.name === "register"){
      refreshVerifyCodeIfExpire()
    }
  }

  /**
   * 重新绑定第三方帐号
   */
  private rebind(type: string): void{
    switch (type) {
      case 'qq':
        (this.$refs.qqAuthorizeBtn as QqAuthorizeButton).authorize()
        break;
      case 'github':
        (this.$refs.githubAuthorizeBtn as GithubAuthorizeButton).authorize()
        break;
    }
  }

  /**
   * QQ oauth2授权成功
   */
  private async onQqAuthorized(user: UserInfo): Promise<void>{
    if(!this.systemProfile.allowRegister){
      ElMessage.warning("该第三方帐号未在本站注册");
      return;
    }
    (this.$refs.tabs as any).currentName = "register";
    const registerForm = this.$refs.registerForm as RegisterForm;
    registerForm.user.headImg = user.headImg
    registerForm.user.username = user.username
    registerForm.user.qqOpenId = user.qqOpenId
  }

  /**
   * github授权成功
   */
  private async onGithubAuthorized(user: UserInfo): Promise<void>{
    if(!this.systemProfile.allowRegister){
      ElMessage.warning("该第三方帐号未在本站注册");
      return;
    }
    (this.$refs.tabs as any).currentName = "register";
    const registerForm = this.$refs.registerForm as RegisterForm;
    registerForm.user.headImg = user.headImg
    registerForm.user.username = user.username
    registerForm.user.website = user.website
    registerForm.user.biography = user.biography
    registerForm.user.github = user.github
  }

  /**
   * 登录成功
   */
  private async onLoginSuccess(): Promise<void>{
    this.$emit("logged", await AuthenticationService.getSelfInfo())
  }
}
</script>

<style lang="scss" scoped>
</style>
