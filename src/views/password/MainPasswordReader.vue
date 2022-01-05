<template>
<el-dialog title="主密码" append-to-body v-model="visible" :show-close="false" :close-on-click-modal="false" @close="onClose">
  <el-form @submit.native.prevent>
    <el-form-item :rules="[{required: true, message: '请输入密码'}, {min: 6, message: '至少需要6位密码'}]">
      <el-input type="password" v-model="password" clearable autofocus ref="input" @change="onPasswordChange" />
    </el-form-item>
    <el-checkbox label="本次会话不再输入" v-model="saveLocal" />
  </el-form>
</el-dialog>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {SESSION_STORAGE_KEY_MAIN_PASSWORD} from "@/constants/SessionStorageKeys";
import CommonUtils from "@/utils/CommonUtils";
import PasswordProfileService from "@/service/PasswordProfileService";
import PasswordProfile from "@/domain/PasswordProfile";
import aes256 from "aes256";
import AuthenticationService from "@/service/AuthenticationService";

@Options({
  name: "MainPasswordReader"
})
export default class MainPasswordReader extends Vue{
  visible: boolean
  password: string
  saveLocal: boolean
  onPasswordChange: (password: string)=>void
  readRejectMethod: (msg: any)=>void = CommonUtils.emptyFun
  passwordProfile: PasswordProfile

  data(): any{
    return {
      visible: false,
      password: "",
      saveLocal: true,
      onPasswordChange: CommonUtils.emptyFun
    }
  }

  async mounted(): Promise<void>{
    this.passwordProfile = await PasswordProfileService.get()
  }

  async getSessionStoreMainPassword(): Promise<string>{
    let mainPassword = sessionStorage.getItem(SESSION_STORAGE_KEY_MAIN_PASSWORD);
    if(!mainPassword) return mainPassword;
    const userInfo = await AuthenticationService.getSelfInfo();
    try{
      mainPassword = aes256.decrypt(userInfo.username, mainPassword);
      return mainPassword;
    }catch (e) {
      return "";
    }
  }

  async setSessionStoreMainPassword(password: string): Promise<void>{
    const userInfo = await AuthenticationService.getSelfInfo();
    sessionStorage.setItem(SESSION_STORAGE_KEY_MAIN_PASSWORD, aes256.encrypt(userInfo.username, password));
  }

  public async read(): Promise<string>{
    let mainPassword = await this.getSessionStoreMainPassword();
    if(mainPassword) return PasswordProfileService.convert(this.passwordProfile, mainPassword);
    const result = new Promise<string>((resolve, reject) => {
      this.visible = true;
      this.$nextTick(()=>{
        (this.$refs.input as any).focus();
      });
      this.readRejectMethod = reject;
      this.onPasswordChange = ()=>{
        if(this.password.length < 6) return;
        if(this.saveLocal){
          this.setSessionStoreMainPassword(this.password);
        }
        resolve(PasswordProfileService.convert(this.passwordProfile, this.password));
      }
    });
    result.finally(()=>{
      this.onPasswordChange = CommonUtils.emptyFun;
      this.readRejectMethod = CommonUtils.emptyFun;
      this.password = "";
      this.visible = false;
    });
    return result;
  }

  onClose(): void{
    this.readRejectMethod("取消输入");
    this.visible = false;
  }
}
</script>

<style scoped>

</style>
