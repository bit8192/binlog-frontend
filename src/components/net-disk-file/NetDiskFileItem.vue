<!--suppress HtmlDeprecatedAttribute -->
<template>
  <div
      :class="'net-disk-file-item' + (selected ? ' net-disk-file-item-selected' : '')"
      :title="title"
      v-on:click="e=>$emit('click', e)"
      v-on:dblclick="e=>$emit('dblclick', e)"
      v-on:contextmenu="e=>$emit('contextmenu', e)"
  >
    <div class="inline-block"><font-awesome-icon :icon="file.isDirectory ? 'folder' : 'file'" size="4x" /></div>
    <div>
      <input ref="renameInput" v-if="rename" class="net-disk-file-item-rename-input" v-model="renameValue" v-on:blur="renameComplete" v-on:keydown="e=>e.key === 'Enter' && renameComplete()" autofocus />
      <span v-else class="net-disk-file-item-title">{{file.name}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NetDiskFile from "@/domain/NetDiskFile";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faFile, faFolder} from "@fortawesome/free-solid-svg-icons";
import CommonUtils from "@/utils/CommonUtils";
library.add(faFolder, faFile)

declare interface Data{
  renameValue: string
  title: string
}
@Component({
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
    }
  }
})
export default class NetDiskFileItem extends Vue{
  file!: NetDiskFile
  rename!: boolean
  renameValue!: string

  data(): Data{
    return {
      renameValue: this.file.name,
      title: this.getTitle()
    }
  }

  getTitle(): string{
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
  display: inline-block;
  width: 100px;
  text-align: center;
  line-height: initial;
}
.net-disk-file-item-title{
  margin-left: .5em;
  margin-right: .5em;
  @include text-ellipsis(2)
}
.net-disk-file-item-rename-input{
  max-width: 100%;
}
.net-disk-file-item-selected .net-disk-file-item-title{
  background-color: $color-selected;
  color: $color-text-selected;
}
</style>