<template>
<el-form :model="passwordInfo" :rules="rules">
  <el-form-item label="分组" prop="passwordGroup">
    <el-select v-model="passwordGroupId">
      <el-option v-for="group of passwordGroupList" :key="group.id" :value="group.id" :label="group.title" />
    </el-select>
  </el-form-item>
  <el-form-item label="标题" prop="title">
    <el-input v-model="passwordInfo.title" placeholder="标题" />
  </el-form-item>
  <el-form-item label="用户名" prop="username">
    <el-input v-model="passwordInfo.username" placeholder="用户名" />
  </el-form-item>
  <el-form-item label="密码" prop="encodedPassword">
    <el-input v-model="passwordInfo.encodedPassword" :type="passwordInputType" >
      <el-button slot="append" icon="el-icon-view" v-on:click="passwordInputType = passwordInputType === 'password' ? 'text' : 'password'" />
    </el-input>
  </el-form-item>
  <el-form-item label="网址" prop="url">
    <el-input v-model="passwordInfo.url" />
  </el-form-item>
  <el-form-item label="备注" prop="remark">
    <el-input v-model="passwordInfo.remark" type="textarea" />
    <el-checkbox label="加密备注" v-model="passwordInfo.encryptionRemark" />
  </el-form-item>
  <main-password-reader ref="mainPasswordReader" />
</el-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PasswordInfo from "@/domain/PasswordInfo";
import PasswordGroup from "@/domain/PasswordGroup";
import PasswordGroupService from "@/service/PasswordGroupService";
import PasswordInfoDto from "@/domain/PasswordInfoDto";
import PasswordInfoService from "@/service/PasswordInfoService";
import MainPasswordReader from "@/views/password/MainPasswordReader.vue";
import * as aes256 from "aes256";

@Component({
  name: "PasswordInfoEdit",
  components: {MainPasswordReader},
  props: {
    value: Object
  },
  model: {
    prop: "value",
    event: "save"
  },
  watch: {
    value(val: PasswordInfo): void{
      this.passwordInfo = val || {};
    }
  }
})
export default class PasswordInfoEdit extends Vue{
  value: PasswordInfo
  passwordInfo: PasswordInfo
  passwordGroupId: number
  passwordGroupList: PasswordGroup[]
  passwordInputType: string

  rules = {
    title: {required: true, message: '请输入标题'},
    encodedPassword: {required: true, message: '请输入密码'},
  }

  data(): any{
    return {
      passwordInfo: this.value || {},
      passwordGroupId: (this.value && this.value.passwordGroup) ? this.value.passwordGroup.id : null,
      passwordGroupList: [],
      passwordInputType: "password"
    }
  }

  async mounted(): Promise<void>{
    await this.getPasswordGroupList()
  }

  async getPasswordGroupList(keywords = ''): Promise<void>{
    this.passwordGroupList = (await PasswordGroupService.page(keywords, {page: 0, size: 1000})).content;
  }

  async getMainPassword(): Promise<string>{
    return await (this.$refs.mainPasswordReader as MainPasswordReader).read();
  }

  async encryption(raw: string): Promise<string>{
    const mainPassword = await this.getMainPassword();
    return aes256.encrypt(mainPassword, raw)
  }

  async save(): Promise<PasswordInfo>{
    const dto = {
      id: this.passwordInfo.id,
      title: this.passwordInfo.title,
      username: this.passwordInfo.username,
      encodedPassword: await this.encryption(this.passwordInfo.encodedPassword),
      url: this.passwordInfo.url,
      remark: this.passwordInfo.encryptionRemark ? await this.encryption(this.passwordInfo.remark) : this.passwordInfo.remark,
      encryptionRemark: this.passwordInfo.encryptionRemark,
      passwordGroupId: this.passwordGroupId
    } as PasswordInfoDto;
    let result: PasswordInfo;
    if(dto.id){
      result = await PasswordInfoService.update(dto);
    }else{
      result = await PasswordInfoService.add(dto);
    }
    this.$emit('save', result);
    return result;
  }
}
</script>

<style scoped>

</style>
