<template>
<div class="net-disk-file-upload-panel">
  <div>
    <el-upload ref="upload" :auto-upload="false" multiple v-model="fileList" :action="uploadUrl" :http-request="doUpload" :on-success="onUploadSuccess">
      <el-button slot="trigger" size="small" type="primary" style="margin-right: 1em">添加文件</el-button>
      <el-button size="small" type="success" v-on:click="()=>$refs.upload.submit()">上传</el-button>
    </el-upload>
  </div>
  <div v-if="additionalPermission">
    <el-form>
      <el-form-item>
        <el-checkbox v-model="fileInfo.everyoneReadable">任何人可读</el-checkbox>
        <el-checkbox v-model="fileInfo.everyoneWritable">任何人可写</el-checkbox>
      </el-form-item>
      <el-form-item label="可读用户">
        <p>**TODO**</p>
      </el-form-item>
      <el-form-item label="可写用户">
        <p>**TODO**</p>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NetDiskFileDto from "../../domain/NetDiskFileDto";
import axios from "axios";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import {ElUploadInternalFileDetail, HttpRequestOptions} from "element-ui/types/upload";

declare interface Data{
  fileInfo: NetDiskFileDto
  fileList: any[]
  uploadUrl: string
}
@Component({
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
export default class NetDiskFileUploadPanel extends Vue implements Data{
  parentId!: number
  fileInfo!: NetDiskFileDto
  fileList!: any[]
  uploadUrl!: string

  // noinspection JSUnusedLocalSymbols
  private data(): Data{
    return {
      fileInfo: {
        parentId: this.parentId,
        everyoneReadable: false,
        everyoneWritable: false,
        readableUserList: [],
        writableUserList: []
      },
      fileList: [],
      uploadUrl: URL_NET_DISK_FILE + "/files"
    }
  }

  /**
   * 上传文件，逐个上传
   */
  private async doUpload(options: HttpRequestOptions): Promise<void>{
    const formData = new FormData()
    formData.append(options.filename, options.file)
    formData.append("fileInfo", new Blob([JSON.stringify(this.fileInfo)], {type: "application/json"}));
    await axios.post(this.uploadUrl, formData)
  }

  /**
   * 每个文件上传成功后的事件
   */
  private async onUploadSuccess(_response, _file, fileList: ElUploadInternalFileDetail[]): Promise<void>{
    if(fileList.every(i=>i.status === "success")){
      this.$emit("complete")
    }
  }
}
</script>

<style scoped>

</style>