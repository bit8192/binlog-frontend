<template>
  <div class="pt-4 text-center">
    <el-upload :action="uploadFileUrl" :show-file-list="false" :on-success="this.onUploadSuccess">
      <el-avatar :src="headImageUrl" :size="120" style="cursor: pointer"/>
    </el-upload>
    <el-input placeholder="输入图片地址" v-model="headImageUrl" class="mt-5" />
    <el-button type="default" class="mt-5" v-if="userInfo && userInfo.isBlogger" v-on:click="()=>this.showNetDiskFileDialog = true">网盘文件</el-button>
    <el-button type="primary" class="mt-5" v-on:click="submitChangeHeadImage">提交</el-button>
    <el-dialog :visible="showNetDiskFileDialog" v-on:close="()=>this.showNetDiskFileDialog = false">
      <net-disk-file-list v-on:open="onSelectNetDiskFile" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {URL_FILES} from "@/constants/UrlApiFiles";
import {AppProvider} from "@/App.vue"
import UserInfo from "@/domain/UserInfo";
import UploadFile from "@/domain/UploadFile";
import UserService from "@/service/UserService";
import NetDiskFileList from "@/components/net-disk-file/NetDiskFileList.vue";
import NetDiskFile from "@/domain/NetDiskFile";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import {clearCache} from "@/decorators/Cached";
import AuthenticationService from "@/service/AuthenticationService";

@Component({
  components: {NetDiskFileList},
  inject: ["app"],
  data: ()=>{
    return {
      uploadFileUrl: URL_FILES,
      userInfo: null,
      headImageUrl: "",
      showNetDiskFileDialog: false
    }
  }
})
export default class UserChangeHeadImageView extends Vue{
  app: AppProvider
  userInfo: UserInfo
  headImageUrl: string
  showNetDiskFileDialog: boolean

  created(): void{
    this.userInfo = this.app.getLoggedUserInfo()
    if(this.userInfo){
      this.headImageUrl = this.userInfo.headImg
    }
  }

  /**
   * 上传文件
   */
  async onUploadSuccess(files: UploadFile[]): Promise<void>{
    if(!files.length) return
    this.headImageUrl = files[0].url
  }

  /**
   * 选择了文件
   */
  onSelectNetDiskFile(file: NetDiskFile): void{
    this.headImageUrl = location.origin + URL_NET_DISK_FILE + "/get/" + file.id
    this.showNetDiskFileDialog = false
  }

  /**
   * 提交头像
   */
  async submitChangeHeadImage(): Promise<void>{
    const result = await UserService.changeHeadImg(this.headImageUrl)
    if(result.value){
      this.$message.success("修改成功")
      clearCache(AuthenticationService.getSelfInfo)
      await this.app.updateUserInfo()
      this.$router.back()
    }else{
      this.$message.warning("修改失败")
    }
  }
}
</script>

<style scoped>

</style>