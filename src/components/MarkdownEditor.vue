<template>
<div class="markdown-editor">
  <div class="markdown-editor-tools-bar">
    <el-tooltip content="粗体">
      <el-button size="small" v-on:click="bold"><font-awesome-icon icon="bold" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="斜体">
      <el-button size="small" v-on:click="italic"><font-awesome-icon icon="italic" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="删除线">
      <el-button size="small" v-on:click="removeLine"><font-awesome-icon icon="strikethrough" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="上标">
      <el-button size="small" v-on:click="superscript"><font-awesome-icon icon="superscript" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="下标">
      <el-button size="small" v-on:click="subscript"><font-awesome-icon icon="subscript" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="升级标题">
      <el-button size="small" v-on:click="upHeading"><font-awesome-icon icon="heading" size="lg" /><font-awesome-icon icon="long-arrow-alt-up" size="xs" /></el-button>
    </el-tooltip>
    <el-tooltip content="降级标题">
      <el-button size="small" v-on:click="downHeading"><font-awesome-icon icon="heading" size="lg" /><font-awesome-icon icon="long-arrow-alt-down" size="xs" /></el-button>
    </el-tooltip>
    <el-tooltip content="链接">
      <el-button size="small" v-on:click="link"><font-awesome-icon icon="link" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="代码">
      <el-button size="small" v-on:click="code"><font-awesome-icon icon="code" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="上传图像/附件">
      <el-button size="small" v-on:click="showUploadPanel = !showUploadPanel"><font-awesome-icon icon="upload" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip :content="isPreview ? '取消预览' : '预览'">
      <el-button size="small" v-on:click="preview"><font-awesome-icon :icon="isPreview ? 'eye-slash' : 'eye'" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip :content="isFullscreen ? '取消全屏' : '全屏'">
      <el-button size="small" v-on:click="fullscreen"><font-awesome-icon :icon="fullscreen ? 'compress' : 'expand'" size="lg" /></el-button>
    </el-tooltip>
    <el-dialog :visible="showUploadPanel" v-on:close="showUploadPanel = false">
      <net-disk-file-list v-on:open="onSelectFile" />
    </el-dialog>
  </div>
  <div class="markdown-editor-main">
    <vue-codemirror
        ref="editor"
        v-model="content"
        :options="{mode: 'markdown', tabSize: 4, lineNumbers: true, theme: 'idea', foldGutter: true}"
        :style="((editorWidth && isPreview) ? 'width: ' + editorWidth + 'px; ' : 'flex: 1; ') + (isFullscreen ? 'max-height: 100vh;' : '')"
        v-on:blur="onBlur"
    />
    <div class="markdown-editor-viewer-box" v-if="isPreview">
      <drag-split
          v-on:dragstart="onSplitDragstart"
          v-on:dragleave="onSplitDragleave"
          v-on:drag="onSplitDrag"
      />
      <markdown-it-vue
          class="markdown-editor-viewer"
          ref="viewer"
          :content="content"
          :style="((previewWidth && isPreview) ? 'width: ' + previewWidth + 'px;' : 'flex: 1;')"
      />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator"
import MarkdownItVue from "markdown-it-vue"
import 'markdown-it-vue/dist/markdown-it-vue.css'
import {Component as VueComponent} from "vue"
import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/theme/idea.css'
import DragSplit from "@/components/DragSplit.vue"
import {library} from "@fortawesome/fontawesome-svg-core";
import {
  faBold,
  faItalic,
  faStrikethrough,
  faSuperscript,
  faSubscript,
  faHeading,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faCode,
  faLink,
  faImage,
  faUpload,
  faEye,
  faEyeSlash,
  faExpand,
  faCompress
} from "@fortawesome/free-solid-svg-icons";
import CodeMirror from "codemirror";
import NetDiskFile from "@/domain/NetDiskFile";
import {URL_NET_DISK_FILE} from "@/constants/UrlApiNetDiskFile";
import {REG_EXP_IMAGE_FILE} from "@/constants/RegExp";
import NetDiskFileList from "@/components/net-disk-file/NetDiskFileList.vue";
library.add(
    faBold,
    faItalic,
    faStrikethrough,
    faSuperscript,
    faSubscript,
    faHeading,
    faLongArrowAltUp,
    faLongArrowAltDown,
    faCode,
    faLink,
    faImage,
    faUpload,
    faEye,
    faEyeSlash,
    faExpand,
    faCompress
)

interface Data{
  content: string
  editorWidth: number
  previewWidth: number
  isPreview: boolean
  isFullscreen: boolean
  showUploadPanel: boolean
}

/**
 * 上次view的宽度, 开始调整时记录
 */
let prevEditorWidth = 0
@Component({
  components: {
    NetDiskFileList,
    DragSplit, MarkdownItVue: MarkdownItVue as VueComponent, VueCodemirror: codemirror as VueComponent},
  props: {
    value: String
  },
  model: {
    prop: "value",
    event: "change"
  },
  data(): Data{
    return {
      content: "",
      previewWidth: 0,
      editorWidth: 0,
      isPreview: false,
      isFullscreen: false,
      showUploadPanel: false
    }
  },
  watch: {
    content(val): void{
      this.$emit("change", val)
    },
    value(val): void{
      if(val !== this.content){
        this.content = val
      }
    }
  }
})
export default class MarkdownEditor extends Vue{
  previewWidth!: number
  editorWidth!: number
  isPreview!: boolean
  isFullscreen!: boolean
  content!: string
  value!: string
  showUploadPanel!: boolean

  created(): void{
    this.content = this.value
  }

  /**
   * 分割条拖动开始
   */
  private onSplitDragstart(): void{
    prevEditorWidth = ((this.$refs.editor as Vue).$el as HTMLElement).clientWidth
  }
  /**
   * 分割条拖动中途结束
   */
  private onSplitDragleave(): void{
    this.editorWidth = prevEditorWidth
    this.previewWidth = this.$el.clientWidth - prevEditorWidth - 10
  }
  /**
   * 分割条拖动
   */
  private onSplitDrag(size: number): void{
    this.editorWidth = prevEditorWidth + size
    this.previewWidth = this.$el.clientWidth - this.editorWidth - 10
  }

  /**
   * 获取CodeMirror
   */
  private getCodeMirror(): CodeMirror.Editor{
    return (this.$refs.editor as any).codemirror as CodeMirror.Editor
  }

  /**
   * 替换选中内容的两侧文字
   */
  private replaceSelection(start: string, end: string): void{
    const cm = this.getCodeMirror()
    cm.focus()
    const selections = cm.getSelections()
    const ranges = cm.listSelections()
    if(ranges.every(r=>r.empty())){
      cm.replaceSelection(end, "start")
      cm.replaceSelections(selections.map(s=>start + s), "end")
    }else{
      cm.replaceSelections(selections.map(s=>start + s + end), "around")
    }
  }

  /**
   * 粗体
   */
  private bold(): void{
    this.replaceSelection("**", "**")
  }

  /**
   * 斜体
   */
  private italic(): void{
    this.replaceSelection("*", "*")
  }

  /**
   * 删除线
   */
  private removeLine(): void{
    this.replaceSelection("~~", "~~")
  }

  /**
   * 上标
   */
  private superscript() :void{
    this.replaceSelection("^", "^")
  }

  /**
   * 下标
   */
  private subscript(): void{
    this.replaceSelection("~", "~")
  }

  // noinspection JSMethodCanBeStatic
  /**
   * 升级内容标题
   * @param content
   */
  private upContentHeading(content: string): string{
    const regex = /((>+|\*+|\++|-+) )?(#+ )?([^\n]*\n?\r?)/
    let matchResult: RegExpMatchArray
    let tmpStr = content;
    let result = ""
    while (tmpStr && (matchResult = tmpStr.match(regex)) != null){
      result += tmpStr.substr(0, matchResult.index)
      if(matchResult[1]) result += matchResult[1]
      if(matchResult[3]) {
        //超出范围
        if(matchResult[3] === "###### "){
          result += matchResult[3]
        }else{
          result += "#" + matchResult[3]
        }
      }else {
        result += "# "
      }
      result += matchResult[4]
      tmpStr = tmpStr.substr(matchResult[0].length)
    }
    return result
  }

  // noinspection JSMethodCanBeStatic
  /**
   * 降级内容标题
   * @param content
   */
  private downContentHeading(content: string): string{
    const regex = /((>+|\*+|\++|-+) )?(#+ )([^\n]*\n?\r?)/
    let matchResult: RegExpMatchArray
    let tmpStr = content
    let result = ""
    let matched = false
    while (tmpStr && (matchResult = tmpStr.match(regex)) != null){
      result += tmpStr.substr(0, matchResult.index)
      if(matchResult[1]) result += matchResult[1]
      //只剩1级时删除
      if(matchResult[3] !== "# ") {
        result += matchResult[3].substr(1)
      }
      result += matchResult[4]
      tmpStr = tmpStr.substr(matchResult[0].length)
      matched = true
    }
    return matched ? result : content
  }

  /**
   * 升级标题
   */
  private upHeading(): void{
    const cm = this.getCodeMirror()
    const selections = cm.getSelections()
    const ranges = cm.listSelections()
    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i]
      const range = ranges[i]
      if(range.empty()){
        const line = cm.getLine(range.head.line)
        if(line == "" || line == "\n"){
          selections[i] = "# "
        }else{
          selections[i] = ""
          const r = this.upContentHeading(line)
          cm.replaceRange(r,{line: range.head.line, ch: 0}, {line: range.head.line, ch: line.length})
        }
      }else {
        selections[i] = this.upContentHeading(selection)
      }
    }
    cm.replaceSelections(selections, "around")
    cm.focus()
  }

  /**
   * 降级标题
   */
  private downHeading(): void{
    const cm = this.getCodeMirror()
    const selections = cm.getSelections()
    const ranges = cm.listSelections()
    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i]
      const range = ranges[i]
      if(range.empty()){
        const line = cm.getLine(range.head.line)
        if(line){
          const r = this.downContentHeading(line)
          cm.replaceRange(r,{line: range.head.line, ch: 0}, {line: range.head.line, ch: line.length})
        }
      }else{
        selections[i] = this.downContentHeading(selection)
      }
    }
    cm.replaceSelections(selections, "around")
    cm.focus()
  }

  /**
   * 链接
   */
  private link(): void{
    this.replaceSelection("[", `](${location.href})`)
  }

  /**
   * 代码
   */
  private code(): void{
    this.replaceSelection("```\n", "\n```")
  }

  /**
   * 预览
   */
  private preview(): void{
    this.isPreview = !this.isPreview
    this.getCodeMirror().focus()
  }

  /**
   * 全屏
   */
  private fullscreen(): void{
    this.isFullscreen = !this.isFullscreen
    if(this.isFullscreen){
      this.$el.requestFullscreen({
        navigationUI: "auto"
      })
    }else {
      document.exitFullscreen()
    }
    this.getCodeMirror().focus()
  }

  /**
   * 当选中了图片/文件
   */
  private onSelectFile(file: NetDiskFile): void{
    this.showUploadPanel = false
    const cm = this.getCodeMirror()
    cm.focus()
    if(file.name.match(REG_EXP_IMAGE_FILE)){
      cm.replaceSelections(cm.getSelections().map(()=>`![image](${URL_NET_DISK_FILE}/get/${file.id})\n`), 'around')
    }else{
      cm.replaceSelections(cm.getSelections().map(()=>`[file](${URL_NET_DISK_FILE}/get/${file.id})\n`), 'around')
    }
  }

  private onBlur(e: Event): void{
    this.$emit("blur", e)
  }
}
</script>

<style lang="scss">
@import "src/style/var-color";

.vue-codemirror{
  max-width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  min-height: 300px;
}
.vue-codemirror-fullscreen{
  max-height: 100vh;
}
.markdown-editor-main>.vue-codemirror>div{
  height: 100%;
}
.markdown-editor{
  border: #d5d5d5 solid 1px;
  overflow: hidden;
  background-color: white;
}
.is-error .markdown-editor{
  border: $color-danger solid 1px;
}
.markdown-editor-main{
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
}
.markdown-editor-viewer-box{
  display: flex;
  flex-direction: row;
  align-items: stretch;
  z-index: 1;
  box-shadow: -5px 0 5px -4px;
}
.markdown-editor-tools-bar{
  padding: .5em;
  border-bottom: #d5d5d5 1px solid;
}
.markdown-editor-tools-bar>.el-button{
  border: none;
  padding: 6px 9px;
}
.markdown-editor-viewer{
  max-height: 80vh;
  flex: 1;
  overflow-y: auto;
}
</style>