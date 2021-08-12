<template>
<div class="net-disk-file-upload-panel">
  <div>
    <el-upload ref="upload" :auto-upload="false" multiple :action="uploadUrl" :http-request="doUpload" :on-success="onUploadSuccess">
      <el-button slot="trigger" size="small" type="primary" style="margin-right: 1em">添加文件</el-button>
    </el-upload>
  </div>
  <div v-if="additionalPermission">
    <el-form>
      <el-form-item>
        <el-checkbox v-model="fileInfo.everyoneReadable">任何人可读</el-checkbox>
        <el-checkbox v-model="fileInfo.everyoneWritable">任何人可写</el-checkbox>
      </el-form-item>
      <el-form-item label="可读用户">
        <ul class="list-style-none">
          <li v-for="user of readableUserList" :key="user.id" class="d-inline-block mr-2" style="line-height: 40px">
            <el-avatar :src="user.headImg" style="vertical-align: middle" class="mr-2" />
            <span>{{user.username}}</span>
          </li>
          <li class="d-inline-block">
            <el-button icon="el-icon-edit" circle v-on:click="selectReadableUserList"/>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="可写用户">
        <ul class="list-style-none">
          <li v-for="user of writableUserList" :key="user.id" class="d-inline-block mr-2" style="line-height: 40px">
            <el-avatar :src="user.headImg" style="vertical-align: middle" class="mr-2" />
            <span>{{user.username}}</span>
          </li>
          <li class="d-inline-block">
            <el-button icon="el-icon-edit" circle v-on:click="selectWritableUserList"/>
          </li>
        </ul>
      </el-form-item>
      <el-dialog :visible="showUserTransferDialog" v-on:close="showUserTransferDialog = false" append-to-body>
        <user-transfer v-model="selectedUserIds" ref="userTransfer" />
        <div class="text-right">
          <el-button type="primary" v-on:click="this.selectUserListCompleteCallback">确定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
  <div class="text-right">
    <el-button size="small" type="success" :disabled="!$refs.upload || !$refs.upload.uploadFiles.length" v-on:click="()=>$refs.upload.submit()">上传</el-button>
  </div>
</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NetDiskFileDto from "../../domain/NetDiskFileDto";
import axios from "axios";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import {ElUpload, ElUploadInternalFileDetail, HttpRequestOptions} from "element-ui/types/upload";
import UserInfo from "@/domain/UserInfo";
import UserTransfer from "@/components/user/UserTransfer.vue";

@Component({
  components: {UserTransfer},
  props: {
    parentId: {
      type: Number,
      default: null
    },
    additionalPermission: {
      type: Boolean,
      default: false
    }
  }
})
export default class NetDiskFileUploadPanel extends Vue{
  parentId!: number
  fileInfo!: NetDiskFileDto
  uploadUrl!: string
  readableUserList: Array<UserInfo>
  writableUserList: Array<UserInfo>
  selectedUserIds: Array<number>
  showUserTransferDialog: boolean
  selectUserListCompleteCallback: ()=>void

  data(): any{
    return {
      fileInfo: {
        parentId: this.parentId,
        everyoneReadable: true,
        everyoneWritable: false,
        readableUserList: [],
        writableUserList: []
      },
      uploadUrl: URL_NET_DISK_FILE + "/files",
      readableUserList: [],
      writableUserList: [],
      selectedUserList: [],
      showUserTransferDialog: false
    }
  }

  /**
   * 上传文件，逐个上传
   */
  private async doUpload(options: HttpRequestOptions): Promise<void>{
    const formData = new FormData()
    this.fileInfo.readableUserList = this.readableUserList.map(i=>i.id)
    this.fileInfo.writableUserList = this.writableUserList.map(i=>i.id)
    formData.append(options.filename, options.file)
    formData.append("fileInfo", new Blob([JSON.stringify(this.fileInfo)], {type: "application/json"}));
    await axios.post(this.uploadUrl, formData)
  }

  /**
   * 每个文件上传成功后的事件
   */
  private async onUploadSuccess(response, _file, fileList: ElUploadInternalFileDetail[]): Promise<void>{
    if(fileList.every(i=>i.status === "success")){
      this.$emit("complete", response);
      (this.$refs.upload as ElUpload).clearFiles()
    }
  }

  /**
   * 设置可读用户列表
   */
  private selectReadableUserList(): void{
    this.selectUserListCompleteCallback = ()=>{
      this.readableUserList = (this.$refs.userTransfer as UserTransfer).getSelectedUserList().concat();
      this.showUserTransferDialog = false;
    }
    this.selectedUserIds = this.readableUserList.map(i=>i.id);
    this.showUserTransferDialog = true;
  }

  /**
   * 设置可写用户列表
   */
  private selectWritableUserList(): void{
    this.selectUserListCompleteCallback = ()=>{
      this.writableUserList = (this.$refs.userTransfer as UserTransfer).getSelectedUserList().concat();
      this.showUserTransferDialog = false;
    }
    this.selectedUserIds = this.writableUserList.map(i=>i.id);
    this.showUserTransferDialog = true;
  }
}
</script>

<style scoped>

</style>
