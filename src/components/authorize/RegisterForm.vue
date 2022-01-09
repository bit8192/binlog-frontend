<template>
  <el-form :model="user" :rules="formRules" ref="form" label-width="100px">
    <el-image :src="goodFriendBannerImage"></el-image>
    <p class="text-center">
      ~(￣▽￣)~注册了我们就是好朋友哦~(￣▽￣)~
    </p>
    <el-form-item label="头像">
      <div class="d-flex flex-column width-100">
        <div class="text-center">
          <el-upload :action="headImageUploadAction" :show-file-list="false" :on-success="onUploadHeadImg" :multiple="false">
            <el-avatar :src="user.headImg" :size="80" >
              <font-awesome-icon icon="user" size="4x" class="color-text-sub"/>
            </el-avatar>
          </el-upload>
        </div>
        <el-input v-model="user.headImg" placeholder="输入头像地址，或者点击头像上传" />
      </div>
    </el-form-item>
    <el-form-item label="用户名" required prop="username">
      <el-input v-model="user.username" placeholder="用户名，5-16位中文、字母、数字、下划线、中划线" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" placeholder="密码，绑定有第三方帐号可以不设置密码" type="password" />
    </el-form-item>
    <el-form-item label="再次输入密码" prop="repassword" v-if="user.password">
      <el-input v-model="user.repassword" placeholder="再次输入密码" @input="$refs.form.validateField('password')" type="password" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" placeholder="形式而已，我也不会向你的邮箱发送任何邮件" />
    </el-form-item>
    <el-form-item label="手机" prop="phoneNum">
      <el-input v-model="user.phoneNum" placeholder="你的手机号，这并不是必填的" />
    </el-form-item>
    <el-form-item label="个性签名">
      <el-input v-model="user.biography" placeholder="表达一下你的个性吧" />
    </el-form-item>
    <el-form-item label="个人网站" prop="website">
      <el-input v-model="user.website" placeholder="一起加友链吧" />
    </el-form-item>
    <el-form-item label="绑定QQ">
      <el-input v-model="user.qqOpenId" disabled >
        <template #append>
          <el-button title="重新绑定" @click="$emit('rebind', 'qq')">
            <font-awesome-icon :icon="['fab', 'qq']" size="2x" />
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="绑定微信">
      <el-input v-model="user.wechatOpenId" disabled>
        <template #append>
          <el-button title="重新绑定" @click="$emit('rebind', 'wechat')">
            <font-awesome-icon :icon="['fab', 'weixin']" size="2x" />
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="绑定Github">
      <el-input v-model="user.github" disabled>
        <template #append>
          <el-button title="重新绑定" @click="$emit('rebind', 'github')">
            <font-awesome-icon :icon="['fab', 'github']" size="2x" />
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="验证码">
      <div style="display: inline-table; width: 100%">
        <chinese-verify-code ref="verifyCode" />
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="register">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import UserDto from "@/domain/UserDto";
import {URL_FILES} from "@/constants/UrlApiFiles";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import UploadFile from "@/domain/UploadFile";
import {faGithub, faQq, faWeixin} from "@fortawesome/free-brands-svg-icons";
import UserService from "@/service/UserService";
import {REG_EXP_PHONE_NUM, REG_EXP_USERNAME, REG_EXP_WEBSITE} from "@/constants/RegExp";
import ChineseVerifyCode, { refreshVerifyCode } from "@/components/ChineseVerifyCode.vue";
import {ElMessage} from "element-plus";

library.add(faUser, faQq, faWeixin, faGithub)

@Options({
  components: {ChineseVerifyCode}
})
export default class RegisterForm extends Vue{
  headImageUploadAction = URL_FILES
  goodFriendBannerImage = require("@/assets/good_friend_banner.webp")
  user: UserDto & {repassword?: string}

  data(): any{
    return {
      formRules: {
        username: [
          {required: true, message: "必填项"},
          {pattern: REG_EXP_USERNAME, message: "5-16位中文、字母、数字、下划线、中划线"},
          {
            validator: async (_: void, value: string, callback: (error: Error | undefined)=>void): Promise<void>=>{
              callback((await UserService.usernameOccupied(value)).value ? new Error("用户名被占用") : undefined);
            }
          }
        ],
        password: [
          {min: 5, message: "5位字符"},
          {
            validator: (_: void, value: string, callback: (error?: Error)=>void)=>{
              if(!value && !this.user.qqOpenId && !this.user.wechatOpenId && !this.user.github) {
                callback(new Error("若未绑定第三方帐号，需要设置登录密码"));
              }
              callback()
            }
          }
        ],
        repassword: [
          {required: true, message: "必填项"},
          {
            validator: (_: void, value: string, callback: (error?: Error)=>void)=>{
              callback(value !== this.user.password ? new Error("密码不一致") : undefined)
            }
          }
        ],
        email: {type: 'email', message: "这个邮箱好像不对"},
        phoneNum: {pattern: REG_EXP_PHONE_NUM, message: "这个手机号好像不对"},
        website: {pattern: REG_EXP_WEBSITE, message: "地址是不是写错了啊"}
      },
      user: {username: "", headImg: "", qqOpenId: "", wechatOpenId: "", github: ""},
    }
  }

  onUploadHeadImg(result: Array<UploadFile>): any{
    this.user.headImg = result[0].url;
  }

  /**
   * 注册
   */
  async register(): Promise<void>{
    let success;
    try{
      success = await (this.$refs.form as any).validate();
    }catch (e) {
      success = false;
    }
    if(!success) {
      ElMessage.warning("好像什么东西填错了")
      return;
    }
    try {
      const result = await UserService.register(this.user, (this.$refs.verifyCode as ChineseVerifyCode).getParams());
      if (result.value) {
        this.$emit("success");
        this.user = {username: "", headImg: "", qqOpenId: "", wechatOpenId: "", github: ""};
        ElMessage.success("注册成功！");
      }else{
        if(result.msg){
          ElMessage.warning(result.msg)
        }
      }
    }finally {
      refreshVerifyCode()
    }
  }
}
</script>

<style scoped>

</style>
