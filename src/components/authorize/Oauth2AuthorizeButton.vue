<template>
  <el-button type="primary" v-on:click="authorize" class="py-2 px-4">
    <slot />
  </el-button>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CommonUtils from "../../utils/CommonUtils";
import UserInfo from "../../domain/UserInfo";
import SuccessMsg from "@/domain/SuccessMsg";

@Component({
  props: {
    authorizeUrl: {
      type: String,
      required: true
    },
    checkNotice: {
      type: Function,
      required: true
    }
  }
})
export default class Oauth2AuthorizeButton extends Vue{
  authorizeUrl: string
  checkNotice: ()=>Promise<SuccessMsg | UserInfo>

  authorize(): void{
    const authorizeWindow = window.open(this.authorizeUrl, "TencentLogin", "width=600,height=420,menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1")
    this.loopCheck(authorizeWindow);
  }

  /**
   * 检测是否登录成功
   */
  private async loopCheck(authorizeWindow: Window): Promise<void>{
    while (!authorizeWindow.closed) {
      const result = await this.checkNotice()
      if((result as SuccessMsg).success != undefined){
        const successMsg = result as SuccessMsg;
        if(successMsg.success){
          this.$emit("success")
          if(successMsg.msg) {
            this.$message.info(successMsg.msg);
          }
          return;
        }else if(successMsg.msg){
          this.$message.warning(successMsg.msg);
        }
      }else if(result){
        authorizeWindow.close();
        this.$emit("authorized", result);
        return;
      }
      await CommonUtils.sleep(3000);
    }
  }
}
</script>

<style scoped>

</style>
