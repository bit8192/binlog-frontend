<template>
  <el-button-group>
    <el-button v-for="type of list" :type="value === type ? 'primary' : undefined" :key="type" @click="()=>onClick(type)">
      {{titleMap[type] || ''}}
    </el-button>
  </el-button-group>
</template>

<script lang="ts">
import NetDiskFileService from "@/service/NetDiskFileService";
import {FileSystemTypeEnum, FileSystemTypeTitle} from "@/domain/FileSystemTypeEnum";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    value: String,
    fileSystemTypeList: {
      type: Array,
      default: ():any[] => []
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    async fileSystemTypeList(list: any[]): Promise<void>{
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
