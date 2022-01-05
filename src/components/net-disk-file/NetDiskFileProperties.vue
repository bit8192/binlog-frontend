<template>
  <el-form label-width="100px">
    <el-form-item label="文件名">
      <el-input :value="detail.name" />
    </el-form-item>
    <el-form-item label="类型">
      <el-input :value="detail.isDirectory ? '文件夹' : '文件'" />
    </el-form-item>
    <el-form-item label="存储位置">
      <el-select :value="detail.fileSystemTypeSet" multiple>
        <el-option v-for="(type, title) of fileSystemTypeMap" :key="type" :value="type" :title="title" />
      </el-select>
    </el-form-item>
    <el-form-item label="文件大小">
      <el-input :value="humanSize" />
    </el-form-item>
    <el-form-item label="创建时间">
      <el-input :value="detail.createdDate" />
    </el-form-item>
    <el-form-item label="最后修改时间">
      <el-input :value="detail.lastModifiedDate" />
    </el-form-item>
    <el-form-item label="所有人">
      <div class="net-disk-file-properties-user-label">
        <el-avatar :src="detail.possessor && detail.possessor.headImg || ''" />
        <span>{{detail.possessor && detail.possessor.username || "-"}}</span>
      </div>
    </el-form-item>
    <el-form-item label="创建人">
      <div class="net-disk-file-properties-user-label">
        <el-avatar :src="detail.createdUser && detail.createdUser.headImg" />
        <span>{{detail.createdUser && detail.createdUser.username || "-"}}</span>
      </div>
    </el-form-item>
    <el-form-item label="最后修改人">
      <div class="net-disk-file-properties-user-label">
        <el-avatar :src="detail.lastModifiedUser && detail.lastModifiedUser.headImg" />
        <span>{{detail.lastModifiedUser && detail.lastModifiedUser.username || "-"}}</span>
      </div>
    </el-form-item>
    <el-form-item label="当前权限">
      <el-checkbox label="可读" :value="detail.readable" />
      <el-checkbox label="可写" :value="detail.writable" />
    </el-form-item>
    <el-form-item label="任何人可读">
      <el-checkbox :value="detail.everyoneReadable" @change="changeEveryoneReadable" />
    </el-form-item>
    <el-form-item label="任何人可写">
      <el-checkbox :value="detail.everyoneWritable" @change="changeEveryoneWritable" />
    </el-form-item>
    <el-form-item label="可读用户列表" v-if="detail.readableUserList && canChangePermission">
      <div class="flex-row">
        <div class="net-disk-file-properties-user-label" v-for="user of detail.readableUserList.concat().splice(0, 10)" :key="user.id">
          <el-avatar :src="user.headImg" />
          <span>{{user.username}}</span>
        </div>
        <span v-if="detail.readableUserList.length > 10">等{{detail.readableUserList.length}}人</span>
        <el-button circle icon="el-icon-edit" @click="onEditReadableUserList" />
      </div>
    </el-form-item>
    <el-form-item label="可写用户列表" v-if="detail.writableUserList && canChangePermission">
      <div class="flex-row">
        <div class="net-disk-file-properties-user-label" v-for="user of detail.writableUserList.concat().splice(0, 10)" :key="user.id">
          <el-avatar :src="user.headImg" />
          <span>{{user.username}}</span>
        </div>
        <span v-if="detail.writableUserList.length > 10">等{{detail.writableUserList.length}}人</span>
        <el-button circle icon="el-icon-edit" @click="onEditWritableUserList" />
      </div>
    </el-form-item>
    <el-dialog :visible="showUserTransferDialog" @close="showUserTransferDialog=false" append-to-body>
      <user-transfer ref="userTransfer" v-model="userTransferValue" />
      <template #footer>
        <div>
          <el-button type="primary" v-if="userTransferCompleteCallback" @click="userTransferCompleteCallback">确定</el-button>
          <el-button @click="showUserTransferDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-form>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import NetDiskFile from "@/domain/NetDiskFile";
import NetDiskFileService from "@/service/NetDiskFileService";
import CommonUtils from "@/utils/CommonUtils";
import {AppProvider} from "@/App.vue";
import UserTransfer from "@/components/user/UserTransfer.vue";
import {FileSystemTypeTitle} from "@/domain/FileSystemTypeEnum";

@Options({
  components: {UserTransfer},
  inject: ['app'],
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data(): any{
    return {
      detail: {},
      humanSize: "-",
      canChangePermission: false,
      showUserTransferDialog: false,
      userTransferValue: [],
      userTransferCompleteCallback: null
    }
  },
  created(): void {
    this.loadDetail()
  },
  watch: {
    id(): void{
      this.loadDetail()
    }
  }
})
export default class NetDiskFileProperties extends Vue{
  id: number
  detail: NetDiskFile
  humanSize: string
  canChangePermission: boolean
  app: AppProvider
  showUserTransferDialog: boolean
  userTransferValue: number[]
  userTransferCompleteCallback: ()=>void
  fileSystemTypeMap = FileSystemTypeTitle

  async loadDetail(): Promise<void>{
    this.detail = await NetDiskFileService.getDetail(this.id)
    this.humanSize = this.detail.size ? CommonUtils.humanReadableSize(this.detail.size) : "-"
    if(this.app.isLogged()){
      this.canChangePermission = this.app.getLoggedUserInfo().id === this.detail.possessor.id
    }else{
      this.canChangePermission = false
    }
  }

  async changeEveryoneReadable(value: boolean): Promise<void>{
    try {
      this.detail.everyoneReadable = value
      await this.submitUpdate()
    }catch (e) {
      this.detail.everyoneReadable = !value
      throw e
    }
  }

  async changeEveryoneWritable(value: boolean): Promise<void>{
    try {
      this.detail.everyoneWritable = value
      await this.submitUpdate()
    }catch (e) {
      this.detail.everyoneWritable = !value
      throw e
    }
  }

  onEditReadableUserList(): void{
    this.userTransferValue = this.detail.readableUserList.map(u=>u.id)
    this.showUserTransferDialog = true
    this.userTransferCompleteCallback = this.onEditReadableUserListComplete
  }

  onEditWritableUserList(): void{
    this.userTransferValue = this.detail.writableUserList.map(u=>u.id)
    this.showUserTransferDialog = true
    this.userTransferCompleteCallback = this.onEditWritableUserListComplete
  }

  /**
   * 完成可读用户的修改
   */
  async onEditReadableUserListComplete(): Promise<void>{
    const userTransfer = this.$refs.userTransfer as UserTransfer
    this.detail.readableUserList = userTransfer.getSelectedUserList()
    await this.submitUpdate()
    this.showUserTransferDialog = false
  }

  /**
   * 完成可写用户的修改
   */
  async onEditWritableUserListComplete(): Promise<void>{
    const userTransfer = this.$refs.userTransfer as UserTransfer
    this.detail.writableUserList = userTransfer.getSelectedUserList()
    await this.submitUpdate()
    this.showUserTransferDialog = false
  }

  /**
   * 提交更新
   */
  async submitUpdate(): Promise<void>{
    const result = await NetDiskFileService.put({
      id: this.detail.id,
      name: this.detail.name,
      everyoneReadable: this.detail.everyoneReadable,
      everyoneWritable: this.detail.everyoneWritable,
      readableUserList: this.detail.readableUserList.map(i => i.id),
      writableUserList: this.detail.writableUserList.map(i => i.id)
    })
    this.detail.everyoneReadable = result.everyoneReadable
    this.detail.everyoneWritable = result.everyoneWritable
    this.detail.readableUserList = result.readableUserList
    this.detail.writableUserList = result.writableUserList
  }
}
</script>

<style lang="scss" scoped>
.net-disk-file-properties-user-label{
  line-height: 40px;
  margin-right: .5em;
}
.net-disk-file-properties-user-label>.el-avatar{
  vertical-align: middle;
  margin-right: .5em;
}
</style>
