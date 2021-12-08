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
import {FileSystemTypeEnum, FileSystemTypeTitle} from "@/domain/FileSystemTypeEnum";
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
  watch: {
    async fileSystemTypeList(list){
      if(!list || !list.length) {
        if (!this.allAvailableFileSystemTypeList) {
          this.allAvailableFileSystemTypeList = await NetDiskFileService.getAvailableFileSystemTypeList();
        }
        this.list = this.allAvailableFileSystemTypeList.concat();
      }else{
        this.list = list;
      }
    }
  }
})
export default class FileSystemTypeSelector extends Vue{
  fileSystemTypeList: Array<FileSystemTypeEnum>
  list: Array<FileSystemTypeEnum>
  value: FileSystemTypeEnum
  inputValue: FileSystemTypeEnum
  allAvailableFileSystemTypeList: Array<FileSystemTypeEnum>
  titleMap = FileSystemTypeTitle;

  data(): any{
    return {
      list: this.fileSystemTypeList,
      inputValue: this.value
    }
  }

  async created(): Promise<void>{
    if(!this.list.length){
      if(!this.allAvailableFileSystemTypeList){
        this.allAvailableFileSystemTypeList = await NetDiskFileService.getAvailableFileSystemTypeList();
      }
      this.list = this.allAvailableFileSystemTypeList.concat();
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
