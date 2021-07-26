<template>
<div class="flex-column">
  <div class="flex-row align-items-center net-disk-file-view-tools-bar">
    <el-button-group style="margin-right: 1em">
      <el-button size="small" :disabled="!(currentHistoryIndex !== -1 && currentHistoryIndex !== 0 && history.length > 1)" v-on:click="back">
        <font-awesome-icon icon="angle-left" />
      </el-button>
      <el-button size="small" :disabled="!(currentHistoryIndex > -1 && currentHistoryIndex < history.length - 1)" v-on:click="forward">
        <font-awesome-icon icon="angle-right" />
      </el-button>
    </el-button-group>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="flex: 1">
      <el-breadcrumb-item v-for="(item, index) of parents" :key="item.id">
        <el-button type="text" v-on:click="()=>goto(item.id)" :disabled="index === parents.length - 1">
          {{item.name}}
        </el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="搜索" style="width: auto" size="small">
      <el-button slot="append" icon="el-icon-search"/>
    </el-input>
  </div>
  <!--suppress HtmlDeprecatedAttribute -->
  <div ref="files" class="net-disk-file-view-files flex-1 flex-row align-items-start" v-on:click="onBoxClick" v-on:contextmenu="onBoxContextmenu">
    <template v-if="fileList.length">
      <!--suppress HtmlDeprecatedAttribute -->
      <net-disk-file-item
          v-for="file in fileList"
          :key="file.id"
          :file="file"
          :rename="renameFileId === file.id"
          :selected="selectedFileIds.has(file.id)"
          v-on:renameComplete="name=>onRenameComplete(file, name)"
          v-on:renameCancel="()=>onRenameCancel(file)"
          v-on:click="e=>onItemClick(e, file)"
          v-on:contextmenu="e=>onItemContextMenu(e, file)"
          v-on:dblclick="e=>onItemDblclick(e, file)"
      />
    </template>
    <empty-data v-else />
    <context-menu :items="menuItems" v-on:click-item="onContextMenuItemClick" />
    <el-dialog :visible="showUploadPanel" v-on:close="showUploadPanel = false" append-to-body>
      <net-disk-file-upload-panel :additional-permission="currentDirectory && currentDirectory.writable" :parent-id="currentDirectory ? currentDirectory.id : null" v-on:complete="onUploadComplete" />
    </el-dialog>
    <el-dialog :visible="showMoveToDirSelectDialog" v-on:close="showMoveToDirSelectDialog = false" append-to-body>
      <net-disk-file-tree ref="moveToDirSelect" :is-directory="true" v-on:clickItem="moveSelectedTo" show-root />
    </el-dialog>
    <el-dialog :visible="showPropertiesDialog" v-on:close="showPropertiesDialog = false" append-to-body>
      <net-disk-file-properties :id="showPropertiesTargetId" v-if="showPropertiesTargetId" />
    </el-dialog>
  </div>
</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import NetDiskFile from "@/domain/NetDiskFile";
import NetDiskFileService from "@/service/NetDiskFileService";
import EmptyData from "@/components/EmptyData.vue";
import ContextMenu, {ContextMenuItem} from "@/components/ContextMenu.vue";
import NetDiskFileItem from "@/components/net-disk-file/NetDiskFileItem.vue";
import NetDiskFileUploadPanel from "@/components/net-disk-file/NetDiskFileUploadPanel.vue";
import NetDiskFileTree from "@/components/net-disk-file/NetDiskFileTree.vue";
import NetDiskFileProperties from "@/components/net-disk-file/NetDiskFileProperties.vue";
library.add(faAngleLeft, faAngleRight)

@Component({
  components: {NetDiskFileProperties, NetDiskFileTree, NetDiskFileUploadPanel, NetDiskFileItem, ContextMenu, EmptyData},
  props: {
    initPathId: Number
  },
  watch: {
    /**
     * 监听当前目录，设置菜单可用
     */
    async currentDirectory(value: NetDiskFile): Promise<void>{
      if(!value) return
      if(value.writable){
        this.menuItems.createDirectory.disabled = false
        this.menuItems.upload.disabled = false
      }else{
        this.menuItems.createDirectory.disabled = true
        this.menuItems.upload.disabled = true
      }
      this.$emit("change", value)
    },
    selectedFileIds(value: Set<number>): void{
      const hasSelected = !!value.size
      this.menuItems.rename.disabled = !hasSelected
      this.menuItems.delete.disabled = !hasSelected
      this.menuItems.download.disabled = !(value.size === 1 && !this.fileList.find(f=>value.has(f.id)).isDirectory);
      this.menuItems.move.disabled = !hasSelected
      this.menuItems.properties.disabled = !hasSelected
    }
  }
})
export default class NetDiskFileList extends Vue{
  currentHistoryIndex!: number
  history!: number[]
  initPathId!: number
  fileList!: NetDiskFile[]
  parents!: NetDiskFile[]
  menuItems!: {[key:string]: ContextMenuItem}
  renameFileId!: number;
  selectedFileIds!: Set<number>;
  currentDirectory!: NetDiskFile
  showUploadPanel!: boolean
  showMoveToDirSelectDialog: boolean
  showPropertiesDialog: boolean
  showPropertiesTargetId: number

  data(): any{
    return {
      currentHistoryIndex: -1,
      history: [],
      fileList: [],
      parents: [],
      renameFileId: null,
      selectedFileIds: new Set<number>(),
      currentDirectory: null,
      showUploadPanel: false,
      showMoveToDirSelectDialog: false,
      showPropertiesDialog: false,
      showPropertiesTargetId: null,
      menuItems: {
        refresh: {
          title: '刷新'
        },
        download: {
          title: '下载',
          disabled: true
        },
        createDirectory: {
          title: '新建文件夹'
        },
        upload: {
          title: '上传'
        },
        rename: {
          title: '重命名',
          disabled: true
        },
        delete: {
          title: '删除',
          disabled: true
        },
        move: {
          title: '移动',
          disabled: true
        },
        properties: {
          title: '属性',
          disabled: true
        }
      }
    }
  }

  created(): void{
    this.goto(this.initPathId)
  }

  /**
   * 跳转到
   */
  private async goto(id: number, record = true): Promise<void>{
    if(record) {
      if(this.currentHistoryIndex !== this.history.length - 1){//当前不是历史的最顶端，那么对当前位置到顶端进行翻转
        const lastHistory = this.history.splice(this.currentHistoryIndex);
        this.history = this.history.splice(0).concat(lastHistory.reverse())
      }
      this.history.push(id)
      this.currentHistoryIndex = this.history.length - 1
    }
    if(this.history.length > 20){
      this.history.shift()
      this.currentHistoryIndex --
    }
    if(!id){
      this.parents = [{name: "/", isDirectory: true, readable: true, writable: true}]
      this.currentDirectory = this.parents[0]
    }else{
      this.currentDirectory = await NetDiskFileService.getDetail(id)
      this.parents = [{name: "/", isDirectory: true}, ...await NetDiskFileService.getParents(id), this.currentDirectory]
    }
    this.fileList = await NetDiskFileService.listChildren(id)
    this.selectedFileIds = new Set<number>()
    this.renameFileId = null
  }

  /**
   * 后退
   */
  private async back(): Promise<void>{
    if(this.currentHistoryIndex < 1) return
    this.currentHistoryIndex--
    await this.goto(this.history[this.currentHistoryIndex], false)
  }

  /**
   * 前进
   */
  private async forward(): Promise<void>{
    if(this.currentHistoryIndex > this.history.length - 2) return
    this.currentHistoryIndex ++
    await this.goto(this.history[this.currentHistoryIndex], false)
  }

  /**
   * 刷新
   */
  private refresh(): void{
    this.goto(this.history[this.currentHistoryIndex], false)
  }

  /**
   * 菜单点击
   */
  onContextMenuItemClick(key: string): void{
    switch (key){
      case "refresh":
        this.refresh()
        break;
      case "download":
        this.downloadSelectedFile()
        break;
      case "createDirectory":
        this.fileList.push({
          id: -1,
          name: "新建文件夹",
          isDirectory: true
        })
        this.renameFileId = -1
        break;
      case "upload":
        this.showUploadPanel = true
        break;
      case "rename":
        this.renameFileId = this.selectedFileIds.values().next().value
        break;
      case "delete":
        this.deleteSelected()
        break;
      case "move":
        this.showMoveToDirSelectDialog = true
        break;
      case "properties":
        this.showPropertiesTargetId = this.selectedFileIds.values().next().value
        this.showPropertiesDialog = true
        break;
    }
  }

  async downloadSelectedFile(): Promise<void>{
    const value = await NetDiskFileService.getDownloadUrl(this.selectedFileIds.values().next().value);
    window.open(value.value, "_blank")
  }

  async deleteSelected(): Promise<void>{
    const files = this.fileList.filter(f=>this.selectedFileIds.has(f.id));
    if(!files.length) return;
    let msg: string
    if(files.length > 3){
      msg = "是否删除[" + files.concat().splice(0, 3).map(f=>f.name).join("、") + "]等 " + files.length + " 个文件";
    }else{
      msg = "是否删除文件[" + files.map(f=>f.name).join("、") + "]";
    }
    const result = await this.$alert(msg)
    if(result !== "confirm") return
    for (let file of files) {
      try{
        await NetDiskFileService.delete(file.id)
      }catch (e) {
        if((await this.$alert("删除文件[" + file.name + "]失败, 是否继续")) !== "confirm") return
      }
      this.fileList.splice(this.fileList.findIndex(f=>f===file), 1)
      this.selectedFileIds.delete(file.id)
    }
  }

  /**
   * 完成重命名
   */
  async onRenameComplete(file: NetDiskFile, name: string): Promise<void>{
    try {
      if (file.id === undefined || file.id === -1) {
        try {
          const result = await NetDiskFileService.createDirectory({
            name,
            parentId: this.currentDirectory.id
          })
          Object.assign(file, result)
        } catch (e) {
          this.fileList.splice(this.fileList.findIndex(i => i === file, 1))
          throw e
        }
      } else {
        const detail = await NetDiskFileService.getDetail(file.id);
        await NetDiskFileService.put({
          id: detail.id,
          name: name,
          everyoneReadable: detail.everyoneReadable,
          everyoneWritable: detail.everyoneWritable,
          readableUserList: detail.readableUserList.map(i => i.id),
          writableUserList: detail.writableUserList.map(i => i.id)
        })
      }
      file.name = name
    }finally {
      this.renameFileId = null
    }
  }

  /**
   * 取消重命名
   */
  onRenameCancel(file: NetDiskFile): void{
    this.renameFileId = null
    if(file.id == -1){
      const fileIndex = this.fileList.findIndex(f=>f === file);
      if(fileIndex){
        this.fileList.splice(fileIndex, 1)
      }
    }
  }

  /**
   * 点击事件
   * 处理选择
   */
  private onItemClick(e: TouchEvent, file: NetDiskFile): void{
    if(e.ctrlKey){
      if(this.selectedFileIds.has(file.id)){
        this.selectedFileIds.delete(file.id)
      }else{
        this.selectedFileIds.add(file.id)
      }
      this.selectedFileIds = new Set<number>(this.selectedFileIds)
    }else{
      this.selectedFileIds = new Set<number>([file.id])
    }
  }

  private onItemContextMenu(_: TouchEvent, file: NetDiskFile): void{
    if(!this.selectedFileIds.has(file.id)){
      this.selectedFileIds = new Set<number>([file.id])
    }
  }

  /**
   * 双击事件
   * 进入目录或者下载文件
   */
  private onItemDblclick(e: TouchEvent, file: NetDiskFile): void{
    if(e.ctrlKey) return
    if(file.isDirectory) {
      this.goto(file.id)
    }else{
      this.$emit("open", file)
    }
  }

  /**
   * 点击盒子事件
   * 当选中时点击移除选中
   */
  private onBoxClick(e: TouchEvent): void{
    const target = e.target as HTMLElement
    if(target.classList.contains('net-disk-file-view-files')){
      this.selectedFileIds = new Set<number>()
    }
  }

  /**
   * 当盒子右键
   */
  private onBoxContextmenu(e: TouchEvent): void{
    const target = e.target as HTMLElement
    if(target.classList.contains('net-disk-file-view-files')){
      this.selectedFileIds = new Set<number>()
    }
  }

  /**
   * 上传文件完成后刷新
   */
  private onUploadComplete(): void{
    this.refresh()
  }

  /**
   * 移动当前选中的文件到指定的文件夹
   * @param targetDir 目的文件夹
   */
  private async moveSelectedTo(targetDir: NetDiskFile): Promise<void>{
    this.showMoveToDirSelectDialog = false
    const files = this.fileList.filter(f=>this.selectedFileIds.has(f.id));
    let msg: string
    if(files.length > 3){
      msg = "是否确定将[" + files.concat().splice(0, 3).map(f=>f.name).join("、") + "...等" + files.length + "个文件]移动到[" + targetDir.name + "]?"
    }else{
      msg = "是否确定将[" + files.map(f=>f.name).join("、") + "]移动到[" + targetDir.name + "]?"
    }
    if((await this.$alert(msg)) !== "confirm") return;
    for (let file of files) {
      const detail = await NetDiskFileService.getDetail(file.id);
      try {
        await NetDiskFileService.put({
          id: detail.id,
          name: detail.name,
          parentId: targetDir.id,
          everyoneWritable: detail.everyoneWritable,
          everyoneReadable: detail.everyoneReadable,
          writableUserList: detail.writableUserList.map(u => u.id),
          readableUserList: detail.writableUserList.map(u => u.id)
        })
      }catch (e){
        if((await this.$alert("文件[" + file.name + "]移动失败，是否继续?")) !== "confirm") return;
      }
      this.fileList.splice(this.fileList.findIndex(f=>f.id === file.id), 1)
      this.selectedFileIds.delete(file.id)
    }
  }
}
</script>

<style scoped lang="scss">

.net-disk-file-view-files{
  min-height: 100px;
  position: relative;
}
</style>
