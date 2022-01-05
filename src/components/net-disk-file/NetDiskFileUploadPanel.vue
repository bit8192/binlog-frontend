<template>
<div class="net-disk-file-upload-panel">
  <div>
    <el-button type="primary" size="small" @click="$refs.uploadInput.click()">
      添加文件
      <input type="file" style="display: none" ref="uploadInput" @change="onUploadInputChange" />
    </el-button>
    <ul class="list-style-none my-2">
      <li v-for="(file, index) of fileList" :key="file.url" class="flex-row justify-content-between align-items-center">
        <el-image :src="file.url" style="height: 100px" fit="contain">
          <template #error>
            <div class="text-center" style="line-height: 100px">
              <font-awesome-icon icon="file" class="color-text-sub" size="4x" style="vertical-align: middle" />
            </div>
          </template>
        </el-image>
        <h4>{{file.rawFile.name}}</h4>
        <span class="color-text-sub">{{file.size}}</span>
        <el-button type="text" icon="el-icon-delete" class="color-warning color-warning-hover" @click="onRemoveFile(index)" />
      </li>
    </ul>
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
            <el-button icon="el-icon-edit" circle @click="selectReadableUserList"/>
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
            <el-button icon="el-icon-edit" circle @click="selectWritableUserList"/>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="存储位置">
        <file-system-type-selector :file-system-type-list="availableFileSystemTypeList" v-model="fileInfo.fileSystemType" />
      </el-form-item>
      <el-dialog v-model="showUserTransferDialog" @close="showUserTransferDialog = false" append-to-body>
        <user-transfer v-model="selectedUserIds" ref="userTransfer" />
        <div class="text-right">
          <el-button type="primary" @click="this.selectUserListCompleteCallback">确定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
  <div class="text-right">
    <el-button size="small" type="success" :disabled="uploadBtnDisabled" @click="doUpload">上传</el-button>
    <p class="p-0"><span class="color-text-sub" v-if="uploading">{{progressTip}}</span></p>
  </div>
</div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import NetDiskFileDto from "../../domain/NetDiskFileDto";
import UserInfo from "@/domain/UserInfo";
import UserTransfer from "@/components/user/UserTransfer.vue";
import CommonUtils from "@/utils/CommonUtils";
import NetDiskFile from "@/domain/NetDiskFile";
import {FileSystemTypeEnum} from "@/domain/FileSystemTypeEnum";
import FileSystemTypeSelector from "@/components/net-disk-file/FileSystemTypeSelector.vue";
import NetDiskFileService from "@/service/NetDiskFileService";

declare interface CustomFile{
  rawFile: File
  url: string
  size: string
  id: number
}
@Options({
  components: {FileSystemTypeSelector, UserTransfer},
  props: {
    parentId: {
      type: Number,
      default: null
    },
    additionalPermission: {
      type: Boolean,
      default: false
    },
    availableFileSystemTypeList: {
      type: Array,
      default: (): any[] => []
    }
  },
  watch: {
    parentId(value: any): void{
      this.fileInfo.parentId = value;
      if(!this.availableFileSystemTypeList || this.availableFileSystemTypeList.every(i=>i !== this.fileInfo.fileSystemType)){
        this.fileInfo.fileSystemType = "LOCAL";
      }
    }
  }
})
export default class NetDiskFileUploadPanel extends Vue{
  parentId!: number
  fileInfo!: NetDiskFileDto
  readableUserList: Array<UserInfo>
  writableUserList: Array<UserInfo>
  selectedUserIds: Array<number> = []
  showUserTransferDialog: boolean
  selectUserListCompleteCallback = ():void=>{return;};
  uploadBtnDisabled: boolean
  fileList: Array<CustomFile>
  progressTip: string
  speed: number//当前速度
  secondSpeedProgress = 0//当前秒正在统计的位置
  secondSpeedTotalTime: number//上一次统计的时间
  uploading: boolean
  availableFileSystemTypeList: Array<FileSystemTypeEnum>

  data(): any{
    return {
      fileInfo: {
        parentId: this.parentId,
        everyoneReadable: true,
        everyoneWritable: false,
        readableUserList: [],
        writableUserList: [],
        fileSystemType: this.availableFileSystemTypeList.length ? this.availableFileSystemTypeList[0] : "LOCAL"
      },
      readableUserList: [],
      writableUserList: [],
      selectedUserList: [],
      showUserTransferDialog: false,
      uploadBtnDisabled: true,
      fileList: [],
      progressTip: "",
      uploading: false
    }
  }

  /**
   * 添加文件
   */
  private onUploadInputChange(e: Event): void{
    this.addFiles((e.target as HTMLInputElement).files);
  }

  addFiles(files: Iterable<File>): void{
    this.fileList.push(...[...files].map((file, index)=>({
      rawFile: file,
      url: URL.createObjectURL(file),
      size: CommonUtils.humanReadableSize(file.size),
      id: new Date().getTime() + index
    })))
    this.uploadBtnDisabled = !this.fileList.length;
  }

  private onRemoveFile(index: number): void{
    this.fileList.splice(index, 1);
    this.uploadBtnDisabled = !this.fileList.length;
  }

  /**
   * 上传文件
   */
  private async doUpload(): Promise<void>{
    this.uploadBtnDisabled = true;
    this.uploading = true;
    this.fileInfo.readableUserList = this.readableUserList.map(i=>i.id)
    this.fileInfo.writableUserList = this.writableUserList.map(i=>i.id)
    try {
      const result: Array<NetDiskFile> = await NetDiskFileService.upload(this.fileList.map(f=>f.rawFile), this.fileInfo, this.onUploadProgress);
      this.$emit("complete", result)
      this.reset();
    }finally {
      this.uploadBtnDisabled = false;
      this.uploading = false;
    }
  }

  /**
   * 上传进度
   */
  onUploadProgress(e: ProgressEvent): void{
    const progress = e.loaded / e.total;
    const currentSecond = e.timeStamp / 1000
    if(currentSecond !== this.secondSpeedTotalTime){
      this.speed = e.loaded - this.secondSpeedProgress
      this.secondSpeedTotalTime = currentSecond
      this.secondSpeedProgress = e.loaded
    }
    this.progressTip = e.loaded + "/" + e.total + ", " + (progress * 100).toFixed(2) + "%, " + CommonUtils.humanReadableSize(this.speed) + "/s"
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

  /**
   * 重置表单
   */
  reset(): void{
    this.fileList = []
  }
}
</script>

<style scoped>

</style>
