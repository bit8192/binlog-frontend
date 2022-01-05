<template>
  <div
      :class="'net-disk-file-item' + (selected ? ' net-disk-file-item-selected' : '')"
      :title="title"
      @click="e=>$emit('click', e)"
      @dblclick="e=>$emit('dblclick', e)"
      @contextmenu="e=>$emit('contextmenu', e)"
  >
    <div>
      <el-image
          v-if="!file.isDirectory && file.mediaType && file.mediaType.includes('image')"
          :src="thumbnailUrl.replace('{id}', file.id).replace('{size}', size.toFixed(0))"
          :style="'display: inline-block; width: ' + size + 'px; height: ' + size + 'px'"
          fit="contain"
      >
        <span :style="'display: contents; font-size: ' + size + 'px'" slot="error" >
          <font-awesome-icon icon="file" class="icon-file"/>
        </span>
        <el-skeleton loading animated>
          <el-skeleton-item variant="image" :style="'height: ' + size + 'px'" />
        </el-skeleton>
      </el-image>
      <span v-else :style="'display: contents; font-size: ' + size + 'px'"><font-awesome-icon :icon="file.isDirectory ? 'folder' : 'file'" :class="file.isDirectory ? ' icon-folder' : ' icon-file'" /></span>
  </div>
    <div class="px-1">
      <input
          ref="renameInput"
          v-if="rename"
          class="net-disk-file-item-rename-input"
          v-model="renameValue"
          @blur="()=>$emit('renameCancel')"
          @keydown="e=>e.key === 'Enter' && renameComplete()"
          autofocus
      />
      <span v-else class="net-disk-file-item-title">{{file.name}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import NetDiskFile from "@/domain/NetDiskFile";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faFile, faFolder} from "@fortawesome/free-solid-svg-icons";
import CommonUtils from "@/utils/CommonUtils";
import {URL_NET_DISK_FILE_THUMBNAIL} from "@/constants/UrlApiNetDiskFile";
library.add(faFolder, faFile)

@Options({
  props: {
    file: {
      type: Object,
      required: true
    },
    rename: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 80
    }
  }
})
export default class NetDiskFileItem extends Vue{
  file!: NetDiskFile
  rename!: boolean
  renameValue!: string
  thumbnailUrl = URL_NET_DISK_FILE_THUMBNAIL

  data(): any{
    return {
      renameValue: this.file.name,
      title: this.getTitle()
    }
  }

  getTitle(): string{
    if(this.file.isDirectory) return this.file.name;
    return this.file.name + "," + CommonUtils.humanReadableSize(this.file.size)
  }

  mounted(): void{
    if(this.rename){
      const renameInput = this.$refs.renameInput as HTMLElement
      renameInput.focus()
    }
  }

  renameComplete(): void{
    if(this.renameValue) this.$emit("renameComplete", this.renameValue)
  }
}
</script>

<style scoped lang="scss">
@import "src/style/mixin-common";
@import "src/style/var-color";

.net-disk-file-item{
  width: 100px;
  text-align: center;
}
.net-disk-file-item-title{
  @include text-ellipsis(1)
}
.net-disk-file-item-rename-input{
  max-width: 100%;
}
.net-disk-file-item-selected .net-disk-file-item-title{
  background-color: $color-selected;
  color: $color-text-selected;
  word-wrap: anywhere;
  @include text-ellipsis(2)
}
.icon-folder{
  color: orange;
}
.icon-file{
  color: gray;
}
</style>
