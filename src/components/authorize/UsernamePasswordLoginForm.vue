<template>
  <div class="usernamePasswordLoginPanel flex-row justify-content-between flex-direction-column-md">
    <div class="flex-1">
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
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <chinese-verify-code ref="verifyCode" class="ml-2" />
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import NotificationErrorHandler from "../../decorators/NotificationErrorHandler";
import AuthenticationService from "../../service/AuthenticationService";
import ChineseVerifyCode from "../ChineseVerifyCode.vue";
import {refreshVerifyCode} from "@/components/ChineseVerifyCode.vue";

@Options({
  components: {ChineseVerifyCode},
  data(): any{
    return {
      username: "",
      password: "",
      rememberMe: false,
    }
  }
})
export default class UsernamePasswordLoginForm extends Vue{
  username: string
  password: string
  rememberMe: boolean

  @NotificationErrorHandler()
  async login(): Promise<void>{
    const verifyCode: any = this.$refs.verifyCode
    try{
      const success = await AuthenticationService.authentication(this.username, this.password, verifyCode.getParams(), this.rememberMe)
      if(success){
        this.username = ""
        this.password = ""
        this.$emit("success")
      }
    }finally {
      refreshVerifyCode()
    }
  }
}
</script>

<style scoped>

</style>
