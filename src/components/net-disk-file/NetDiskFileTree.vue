<template>
  <el-tree node-key="id" :props="{label: 'name', isLeaf: 'isLeaf'}" lazy :load="loadChildren" @node-click="onNodeClick" ref="tree" :expand-on-click-node="false">
    <template #default="{data}">
      <span>
        <font-awesome-icon icon="folder" v-if="data.isDirectory" />
        <font-awesome-icon icon="file" v-else />
        {{data.name}}
      </span>
    </template>
  </el-tree>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import NetDiskFile from "@/domain/NetDiskFile";
import NetDiskFileService from "@/service/NetDiskFileService";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faFile, faFolder} from "@fortawesome/free-solid-svg-icons";
import Node from "element-plus/es/components/tree/src/model/node";

library.add(faFolder, faFile)

declare interface NodeInfo extends NetDiskFile{
  isLeaf: boolean
  children: NodeInfo[]
}
@Options({
  props: {
    isDirectory: Boolean,
    showRoot: Boolean,
    filterFun: Function
  }
})
export default class NetDiskFileTree extends Vue{
  isDirectory: boolean
  showRoot: boolean
  filterFun: (file: NetDiskFile)=>boolean

  async loadChildren(node: Node, resolve: (_:NodeInfo[])=>void): Promise<void>{
    let files = (await NetDiskFileService.listChildren(node.data ? node.data.id : null, this.isDirectory))
        .map(f=>({isLeaf: !f.isDirectory || !f.childrenNum, ...f} as NodeInfo))
    if(this.filterFun) files = files.filter(this.filterFun)
    if(node.level === 0 && this.showRoot){
      resolve([{id: null, name: "/", children: files, isLeaf: false, isDirectory: true}]);
      await (node.childNodes[0] as any).expand()
    }else{
      resolve(files)
    }
  }

  onNodeClick(file: NodeInfo): void{
    this.$emit("clickItem", file)
  }
}
</script>

<style scoped>

</style>
