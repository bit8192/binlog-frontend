<template>
  <el-row type="flex">
    <el-col :span="12">
      <el-form ref="form">
        <el-form-item>
          <el-input placeholder="帐号/手机/邮箱" v-model="username" />
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="密码" v-model="password" />
        </el-form-item>
        <el-form-item>
          <el-checkbox label="下次记住我" v-model="rememberMe" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" v-on:click="login">登录</el-button>
        </el-form-item>
      </el-form>
      <el-divider><span class="text-sub">合作帐号登录</span></el-divider>
      <el-button type="primary" v-on:click="qqLogin" v-if="useQQAuthorize">
        <div style="line-height: 30px">
          <img alt="qq-logo" :src="qqImage" style="width: 25px; height: 30px; float: left" class="pr-2" /> QQ帐号登录
        </div>
      </el-button>
    </el-col>
    <el-divider direction="vertical" />
    <el-col :span="12">
      <chinese-verify-code ref="verifyCode" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import ChineseVerifyCode from "@/components/ChineseVerifyCode.vue";
import AuthenticationService from "@/service/AuthenticationService";
import { Component, Vue } from 'vue-property-decorator';
import NotificationErrorHandler from "@/decorators/NotificationErrorHandler";
import { URL_AUTHORIZE_QQ } from "@/constants/UrlApiAuthentication";
import CommonService from "@/service/CommonService";

@Component({
  components: {ChineseVerifyCode},
  data(){
    return {
      username: "",
      password: "",
      rememberMe: false,
      qqImage: require('@/assets/qq.png'),
      useQQAuthorize: false
    }
  }
})
export default class LoginPanel extends Vue{
  username: string
  password: string
  useQQAuthorize: boolean
  rememberMe: boolean

  async created(): Promise<void>{
    const profiles = await CommonService.getSystemProfile()
    this.useQQAuthorize = profiles.useQQAuthorize;
  }

  refreshVerifyCode(): void{
    const verifyCode = this.$refs.verifyCode as ChineseVerifyCode
    verifyCode.refresh()
  }

  @NotificationErrorHandler()
  async login(): Promise<void>{
    const verifyCode: any = this.$refs.verifyCode
    try{
      const success = await AuthenticationService.authentication(this.username, this.password, verifyCode.getParams(), this.rememberMe)
      if(success){
        this.username = ""
        this.password = ""
        this.$emit("logged", await AuthenticationService.getSelfInfo())
      }else {
        //登录失败了，刷新验证码
        (this.$refs.verifyCode as any).refresh()
      }
    }catch (e) {
      //登录失败了，刷新验证码
      (this.$refs.verifyCode as any).refresh()
      throw e
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * qq帐号登录
   */
  private async qqLogin(): Promise<void>{
    const result = window.open(URL_AUTHORIZE_QQ, "TencentLogin", "width=450,height=320,menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1")
    console.log(result)
  }
}
</script>

<style scoped>

</style>