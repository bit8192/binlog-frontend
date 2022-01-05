<template>
  <el-card shadow="hover">
    <div class="text-center pt-5">
      <router-link to="/user/change-head-image" title="更换头像" v-if="userInfo">
        <el-avatar :src="userInfo?.headImg || ''" :size="80" style="cursor: pointer"/>
      </router-link>
      <el-avatar src="" :size="80" v-else/>
      <div>
        <span v-if="userInfo">{{ userInfo?.username }}</span>
        <el-button v-else type="text" @click="openLoginDialog">登录/注册</el-button>
      </div>
    </div>
    <div class="flex-row justify-content-center align-items-center">
      <div class="text-center">
        <span class="d-block user-integral">{{ userInfo?.agreedNum || "-"}}</span>
        <span class="d-block color-text-sub">获赞</span>
      </div>
      <span class="user-state-panel-divider" />
      <div class="text-center">
        <span class="d-block user-integral">{{ userInfo?.commentNum || "-" }}</span>
        <span class="d-block color-text-sub">评论</span>
      </div>
      <template v-if="userInfo?.isBlogger">
        <span class="user-state-panel-divider" />
        <div class="text-center">
          <span class="d-block user-integral">{{ userInfo?.articleNum || "-"}}</span>
          <span class="d-block color-text-sub">文章</span>
        </div>
      </template>
    </div>
    <div class="user-state-panel-btns flex-row justify-content-center align-items-center color-text-sub" v-if="userInfo">
      <template v-if="userInfo.isBlogger || userInfo.isAdmin">
        <router-link to="/article/edit/new">
          写文章
        </router-link>
        <span class="user-state-panel-divider" />
      </template>
      <el-button type="text" class="color-text-sub" @click="()=>this.showChangePasswordDialog = true">
        修改密码
      </el-button>
      <span class="user-state-panel-divider" />
      <el-button type="text" class="color-text-sub" @click="logout">
        注销
      </el-button>
    </div>
    <el-dialog :visible="showChangePasswordDialog" @close="()=>this.showChangePasswordDialog = false">
      <el-form :model="passwordFormData" :rules="passwordFormRule" ref="changePasswordForm">
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="passwordFormData.password" />
        </el-form-item>
        <el-form-item label="再次输入" prop="repeat_password">
          <el-input type="password" v-model="passwordFormData.repeat_password" />
        </el-form-item>
        <el-button type="primary" @click="submitChangePassword">确定</el-button>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import AuthenticationService from "../service/AuthenticationService";
import {ElMessage} from "element-plus";
import {AppProvider} from "@/App.vue";
import UserDetail from "@/domain/UserDetail";
import {Options, Vue} from "vue-class-component";

@Options({
  inject: ["app"],
  computed: {
    userInfo(){
      return this.$store.state.userInfo
    }
  }
})
export default class UserStatePanel extends Vue{
  userInfo!: UserDetail
  app!: AppProvider
  showChangePasswordDialog: boolean
  passwordFormData: {password: string, repeat_password: string}
  passwordFormRule: any

  data(): any{
    return {
      userInfo: null,
      showChangePasswordDialog: false,
      passwordFormData: {password: "", repeat_password: ""},
      passwordFormRule: {
        password: {pattern: "[a-zA-Z0-9~!@#$%^&*()_+`\\-=\\[\\]{}|\\\\;':\",./<>? ]{6,16}", message: "密码由6-16位的字母、数字、符号和空格组成"},
        repeat_password: {
          validator: (rule: any, value: string): Promise<any> => {
            if(value === this.passwordFormData.password){
              return Promise.resolve()
            }else{
              return Promise.reject("")
            }
          },
          message: "两次输入密码不一致"
        }
      },
    }
  }

  openLoginDialog(): void {
    this.app.openLoginDialog();
  }

  /**
   * 注销
   */
  async logout(): Promise<void> {
    await this.app.logout()
  }

  /**
   * 修改密码
   */
  async submitChangePassword(): Promise<void> {
    const form = this.$refs.changePasswordForm as any;
    if (!(await form.validate())) return;
    const result = await AuthenticationService.changePassword(this.passwordFormData.password)
    if (result.value) {
      this.showChangePasswordDialog = false
      ElMessage.success("修改成功")
    } else {
      ElMessage.warning("修改失败")
    }
  }
}
</script>

<style scoped lang="scss">
.user-integral{
  font-size: 1.5em;
}
.user-state-panel-divider{
  display: inline-block;
  width: 1px;
  height: 1.2em;
  background-color: #dcdef6;
  margin: 0 1em;
}
.user-state-panel-btns{
  margin-top: 1em;
}
</style>
