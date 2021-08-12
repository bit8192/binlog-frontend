<template>
  <el-tree node-key="id" :props="{label: 'name', isLeaf: 'isLeaf'}" lazy :load="loadChildren" v-on:node-click="onNodeClick" ref="tree" :expand-on-click-node="false">
    <span slot-scope="{node, data}">
      <font-awesome-icon icon="folder" v-if="data.isDirectory" />
      <font-awesome-icon icon="file" v-else />
      {{data.name}}
    </span>
  </el-tree>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {TreeNode} from "element-ui/types/tree";
import NetDiskFile from "@/domain/NetDiskFile";
import NetDiskFileService from "@/service/NetDiskFileService";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faFile, faFolder} from "@fortawesome/free-solid-svg-icons";

library.add(faFolder, faFile)

declare interface NodeInfo extends NetDiskFile{
  isLeaf: boolean
  children: NodeInfo[]
}
@Component({
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

  async loadChildren(node: TreeNode<number, NodeInfo>, resolve: (_:NodeInfo[])=>void): Promise<void>{
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
