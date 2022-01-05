<template>
<el-card>
  <el-row :gutter="20">
    <el-col :span="6">
      <div class="d-flex mb-2">
        <el-input suffix-icon="el-icon-search" size="small" clearable class="flex-1" v-model="groupKeywords" @change="refreshGroupPage" />
        <el-button icon="el-icon-plus" size="small" class="ml-2" @click="addGroup" />
      </div>
      <empty-data v-if="!groupPage.content.length" />
      <ul class="list-style-none station-list" v-else>
        <li v-for="group of groupPage.content" :key="group.id" :class="['d-flex align-items-center justify-content-between', {selected: group.id === selectedGroup.id}]" @click="changeSelectGroup(group)">
          <div>
            <h5 class="h5">{{group.title}}</h5>
            <span class="fs-6 color-sub">{{group.remark}}</span>
          </div>
          <div>
            <el-button type="text" icon="el-icon-edit" @click.stop="doEditGroup(group)" />
            <el-button type="text" icon="el-icon-delete" @click.stop="deleteGroup(group)" />
          </div>
        </li>
      </ul>
      <el-pagination layout="prev,pager,next" :total="groupPage.totalElements" :page-size="groupPageable.size" :current-page="groupPageable.page + 1" small @current-change="groupPageChange" />
    </el-col>
    <el-col :span="18">
      <div class="d-flex flex-row align-items-center mb-3">
        <el-input suffix-icon="el-icon-search" size="small" v-model="passwordKeywords" @change="refreshPasswordPage" />
        <el-button type="primary" icon="el-icon-plus" size="small" class="ml-3" @click="addPassword" :disabled="!selectedGroup" />
        <el-button type="primary" icon="el-icon-setting" size="small" class="ml-3" />
      </div>
      <empty-data v-if="!passwordPage.content.length" />
      <ul class="list-style-none" v-else>
        <li v-for="password of passwordPage.content" :key="password.id" class="mb-3">
          <el-card shadow="hover">
            <template #header>
              <div>
                <div class="d-flex flex-row align-items-center justify-content-between">
                  <div>
                    <span class="h4">{{password.title}}</span>&nbsp;&nbsp;&nbsp;
                    <el-button type="text" icon="el-icon-document-copy" @click="copyTitle(password)" />
                  </div>
                  <div>
                    <el-button type="text" icon="el-icon-edit" @click="editPassword(password)" />
                    <el-button type="text" icon="el-icon-delete" @click="deletePassword(password)" />
                  </div>
                </div>
                <span class="color-text-sub">{{password.encryptionRemark ? '' : password.remark}}</span>
              </div>
            </template>
            <div>
              <span>{{password.username}}</span>
              <el-button type="text" icon="el-icon-document-copy" class="ml-2" @click="copyUsername(password)" />
            </div>
            <div>
              <span class="color-text-sub">{{ viewPasswordItem === password ? decryptedPassword : '●●●●●●●●●●●●●●●●●' }}</span>
              <el-button type="text" icon="el-icon-view" class="ml-3" @click="viewPassword(password)" />
              <el-button type="text" icon="el-icon-document-copy" class="ml-3" @click="copyPassword(password)" />
            </div>
            <div class="color-text-sub fs-6">
              <span>{{password.createdDate}}</span>
            </div>
            <template v-if="password.encryptionRemark">
              <el-divider class="mb-2" />
              <pre v-if="viewRemarkItem === password" class="color-text-sub">{{ decryptedRemark }}</pre>
              <div class="text-center">
                <el-button type="text" icon="el-icon-caret-top" @click="viewRemark(password)" v-if="viewRemarkItem === password">隐藏</el-button>
                <el-button type="text" icon="el-icon-caret-bottom" @click="viewRemark(password)" v-else>显示</el-button>
              </div>
            </template>
          </el-card>
        </li>
      </ul>
      <el-pagination layout="prev,pager,next" :total="passwordPage.totalElements" :page-size="passwordPageable.size" :current-page="passwordPageable.page + 1" @current-change="passwordPageChange" />
    </el-col>
  </el-row>
  <el-dialog :title="selectedPasswordInfo && selectedPasswordInfo.title" :model-value="!!selectedPasswordInfo" @close="selectedPasswordInfo = null">
    <password-info-edit v-model="selectedPasswordInfo" ref="passwordEdit" />
    <template #footer>
      <div>
        <el-button @click="selectedPasswordInfo = null">取消</el-button>
        <el-button type="primary" @click="savePassword">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog :title="selectedGroup && selectedGroup.title" v-model="showGroupDialog" @close="showGroupDialog = false">
    <password-group-edit v-model="editGroup" @cancel="showGroupDialog = false" ref="groupEdit" />
    <div slot="footer">
      <el-button @click="showGroupDialog = false">取消</el-button>
      <el-button type="primary" @click="saveGroup">确定</el-button>
    </div>
  </el-dialog>
  <main-password-reader ref="mainPasswordReader" />
</el-card>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import PasswordGroup from "@/domain/PasswordGroup";
import PasswordInfo from "@/domain/PasswordInfo";
import PasswordInfoEdit from "@/views/password/PasswordInfoEdit.vue";
import PasswordGroupService from "@/service/PasswordGroupService";
import Pageable from "@/domain/Pageable";
import Page from "@/domain/Page";
import PasswordInfoService from "@/service/PasswordInfoService";
import PasswordGroupEdit from "@/views/password/PasswordGroupEdit.vue";
import aes256 from "aes256";
import MainPasswordReader from "@/views/password/MainPasswordReader.vue";
import CommonUtils from "@/utils/CommonUtils";
import EmptyData from "@/components/EmptyData.vue";
import {ElMessage, ElMessageBox} from "element-plus";

@Options({
  name: "PasswordView",
  components: {EmptyData, MainPasswordReader, PasswordGroupEdit, PasswordInfoEdit},
})
export default class PasswordView extends Vue{
  groupPage: Page<PasswordGroup>
  groupKeywords: string
  groupPageable: Pageable
  passwordPage: Page<PasswordInfo>
  passwordKeywords: string
  passwordPageable: Pageable
  selectedPasswordInfo: PasswordInfo
  selectedGroup: PasswordGroup
  editGroup: PasswordGroup
  showGroupDialog: boolean
  decryptedPassword: string
  viewPasswordItem: PasswordInfo
  decryptedRemark: string
  viewRemarkItem: PasswordInfo

  data(): any{
    return {
      groupPage: {content: [], totalElements: 0},
      groupKeywords: '',
      groupPageable: {page: 0, size: 10, sort: [{name: 'useTimes', direction: 'DESC'}]},
      passwordPage: {content: [], totalElements: 0},
      passwordKeywords: '',
      passwordPageable: {page: 0, size: 10, sort: [{name: 'useTimes', direction: 'DESC'}]},
      selectedPasswordInfo: null,
      selectedGroup: null,
      showGroupDialog: false,
      decryptedPassword: "",
      viewPasswordItem: null,
      editGroup: null,
      decryptedRemark: "",
      viewRemarkItem: null,
    }
  }

  async mounted(): Promise<void>{
    await this.getGroupPage();
  }

  async groupPageChange(page:number): Promise<void>{
    this.groupPageable.page = page - 1;
    await this.getGroupPage()
  }

  async passwordPageChange(page: number): Promise<void>{
    this.groupPageable.page = page - 1;
    await this.getPasswordPage();
  }

  async changeSelectGroup(group: PasswordGroup): Promise<void>{
    if(this.selectedGroup === group) return;
    this.selectedGroup = group;
    this.passwordPageable.page = 0;
    await this.getPasswordPage();
  }

  async refreshGroupPage(): Promise<void>{
    this.groupPageable.page = 0;
    await this.getGroupPage();
  }

  async getGroupPage(): Promise<void>{
    this.groupPage = await PasswordGroupService.page(this.groupKeywords, this.groupPageable);
    if(this.groupPage.content.length){
      this.selectedGroup = this.groupPage.content[0];
      await this.getPasswordPage();
    }
  }

  async refreshPasswordPage(): Promise<void>{
    this.passwordPageable.page = 0;
    await this.getPasswordPage();
  }

  async getPasswordPage(): Promise<void>{
    if(this.selectedGroup == null) return;
    this.passwordPage = await PasswordInfoService.page(this.selectedGroup.id, this.passwordKeywords, this.passwordPageable);
  }

  addGroup(): void{
    this.editGroup = null;
    this.showGroupDialog = true;
  }

  async deleteGroup(group: PasswordGroup): Promise<void>{
    if((await ElMessageBox.confirm("是否确定删除密码分组[" + group.title + "]")) != "confirm") return;
    await PasswordGroupService.delete(group.id);
    this.groupPage.content.splice(this.groupPage.content.findIndex(i=>i.id === group.id), 1);
    this.groupPage.totalElements --;
  }

  doEditGroup(group: PasswordGroup): void{
    this.editGroup = group;
    this.showGroupDialog = true;
  }

  async saveGroup(): Promise<void>{
    const groupEdit = this.$refs.groupEdit as PasswordGroupEdit
    if(this.editGroup == null){
      const group = await groupEdit.save();
      if(group == null) return;
      this.groupPage.content.unshift(group);
      this.groupPage.totalElements ++;
    }else{
      const group = await groupEdit.save();
      if(group == null) return;
      this.editGroup.title = group.title;
      this.editGroup.remark = group.remark;
    }
    this.showGroupDialog = false;
  }

  async getMainPassword(): Promise<string>{
    return await (this.$refs.mainPasswordReader as MainPasswordReader).read();
  }

  async decryptionPasswordInfo(passwordInfo: PasswordInfo): Promise<PasswordInfo>{
    const mainPassword = await this.getMainPassword();
    return {
      ...passwordInfo,
      encodedPassword: aes256.decrypt(mainPassword, passwordInfo.encodedPassword),
      remark: passwordInfo.encryptionRemark ? aes256.decrypt(mainPassword, passwordInfo.remark) : passwordInfo.remark
    };
  }

  async viewPassword(passwordInfo: PasswordInfo): Promise<void>{
    if(passwordInfo === this.viewPasswordItem){
      this.viewPasswordItem = null;
      this.decryptedPassword = "";
      return;
    }
    this.viewPasswordItem = passwordInfo;
    this.decryptedPassword = aes256.decrypt(await this.getMainPassword(), passwordInfo.encodedPassword);
  }

  async viewRemark(passwordInfo: PasswordInfo): Promise<void>{
    if(passwordInfo === this.viewRemarkItem){
      this.viewRemarkItem = null;
      this.decryptedRemark = "";
      return;
    }
    this.viewRemarkItem = passwordInfo;
    this.decryptedRemark = aes256.decrypt(await this.getMainPassword(), passwordInfo.remark);
    await PasswordInfoService.updateUseTimes(passwordInfo.id);
  }

  copyTitle(passwordInfo: PasswordInfo): void{
    CommonUtils.copyString(passwordInfo.title);
    ElMessage.success("复制成功");
  }

  copyUsername(passwordInfo: PasswordInfo): void{
    CommonUtils.copyString(passwordInfo.username);
    ElMessage.success("复制成功");
  }

  async copyPassword(passwordInfo: PasswordInfo): Promise<void> {
    CommonUtils.copyString(aes256.decrypt(await this.getMainPassword(), passwordInfo.encodedPassword));
    ElMessage.success("复制成功");
    await PasswordInfoService.updateUseTimes(passwordInfo.id);
  }

  async editPassword(password: PasswordInfo): Promise<void>{
    this.selectedPasswordInfo = await this.decryptionPasswordInfo(password);
  }

  async addPassword(): Promise<void>{
    if(!this.selectedGroup){
      ElMessage.warning("请选择分组");
      return;
    }
    this.selectedPasswordInfo = {
      passwordGroup: this.selectedGroup
    };
  }

  async deletePassword(password: PasswordInfo): Promise<void>{
    if((await ElMessageBox.confirm("是否确定删除密码[" + password.title + "]")) != "confirm") return;
    await PasswordInfoService.delete(password.id);
    this.passwordPage.content.splice(this.passwordPage.content.findIndex(i=>i.id === password.id), 1);
    this.passwordPage.totalElements --;
  }

  async savePassword(): Promise<void>{
    const edit = this.$refs.passwordEdit as PasswordInfoEdit
    if(this.selectedPasswordInfo.id){
      const item = this.selectedPasswordInfo;
      const result = await edit.save();
      item.title = result.title;
      item.username = result.username;
      item.encodedPassword = result.encodedPassword;
      item.passwordGroup = result.passwordGroup;
      item.remark = result.remark;
      item.encryptionRemark = result.encryptionRemark;
      if(item.passwordGroup.id !== this.selectedGroup.id){
        const index = this.passwordPage.content.findIndex(i=>i.id === item.id);
        this.passwordPage.content.splice(index, 1)
        this.passwordPage.totalElements --;
      }
    }else{
      await edit.save();
      this.passwordPage.content.unshift(this.selectedPasswordInfo);
      this.passwordPage.totalElements++;
    }
    this.selectedPasswordInfo = null;
  }
}
</script>

<style scoped lang="scss">
@import 'src/style/var-color';

.station-list>li{
  cursor: pointer;
  padding: .5em 1em;
  background-color: white;
  color: $color-text-normal;
  transition: background-color ease-out .5s, color ease-out .5s;
  &:hover, &.selected{
    background-color: $color-selected;
    color: white;
  }
  &:hover .el-button, &.selected .el-button{
    color: white;
  }
}
</style>
