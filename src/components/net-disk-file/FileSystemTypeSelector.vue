<template>
  <el-button-group>
    <template v-for="type of list">
      <el-button :type="value === type ? 'primary' : undefined" :key="type" v-on:click="()=>onClick(type)">
        {{titleMap[type] || ''}}
      </el-button>
    </template>
  </el-button-group>
</template>

<script lang="ts">
import NetDiskFileService from "@/service/NetDiskFileService";
import {FileSystemTypeEnum} from "@/domain/FileSystemTypeEnum";
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    value: String,
    fileSystemTypeList: {
      type: Array,
      default: []
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
})
export default class FileSystemTypeSelector extends Vue{
  fileSystemTypeList: Array<FileSystemTypeEnum>
  list: Array<FileSystemTypeEnum>
  value: FileSystemTypeEnum
  inputValue: FileSystemTypeEnum
  titleMap = {
    LOCAL: '本地',
    ALI_OSS: '阿里云OSS'
  }

  data(): any{
    return {
      list: this.fileSystemTypeList,
      inputValue: this.value
    }
  }

  async created(): Promise<void>{
    if(!this.list.length){
      this.list = await NetDiskFileService.getAvailableFileSystemTypeList();
    }
  }

  private onClick(type: FileSystemTypeEnum){
    if(this.inputValue !== type){
      this.inputValue = type;
      this.$emit("change", type)
    }
  }
}
</script>

<style scoped>

</style>
