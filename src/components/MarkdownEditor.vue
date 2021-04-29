<template>
<div class="markdown-editor">
  <div class="markdown-editor-tools-bar">
    <el-tooltip content="粗体">
      <el-button size="small" v-on:click="$_bold"><font-awesome-icon icon="bold" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="斜体">
      <el-button size="small" v-on:click="$_italic"><font-awesome-icon icon="italic" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="删除线">
      <el-button size="small" v-on:click="$_removeLine"><font-awesome-icon icon="strikethrough" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="上标">
      <el-button size="small" v-on:click="$_superscript"><font-awesome-icon icon="superscript" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="下标">
      <el-button size="small" v-on:click="$_subscript"><font-awesome-icon icon="subscript" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="升级标题">
      <el-button size="small" v-on:click="$_upHeading"><font-awesome-icon icon="heading" size="lg" /><font-awesome-icon icon="long-arrow-alt-up" size="xs" /></el-button>
    </el-tooltip>
    <el-tooltip content="降级标题">
      <el-button size="small" v-on:click="$_downHeading"><font-awesome-icon icon="heading" size="lg" /><font-awesome-icon icon="long-arrow-alt-down" size="xs" /></el-button>
    </el-tooltip>
    <el-tooltip content="链接">
      <el-button size="small" v-on:click="$_link"><font-awesome-icon icon="link" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="代码">
      <el-button size="small" v-on:click="$_code"><font-awesome-icon icon="code" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip content="上传图像/附件">
      <el-button size="small"><font-awesome-icon icon="upload" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip :content="preview ? '取消预览' : '预览'">
      <el-button size="small" v-on:click="$_preview"><font-awesome-icon :icon="preview ? 'eye-slash' : 'eye'" size="lg" /></el-button>
    </el-tooltip>
    <el-tooltip :content="fullscreen ? '取消全屏' : '全屏'">
      <el-button size="small" v-on:click="$_fullscreen"><font-awesome-icon :icon="fullscreen ? 'compress' : 'expand'" size="lg" /></el-button>
    </el-tooltip>
  </div>
  <div class="markdown-editor-main">
    <vue-codemirror
        ref="editor"
        v-model="content"
        :options="{mode: 'markdown', tabSize: 4, lineNumbers: true, theme: 'idea', foldGutter: true}"
        :style="((editorWidth && preview) ? 'width: ' + editorWidth + 'px; ' : 'flex: 1; ')"
    />
    <div class="markdown-editor-viewer-box" v-if="preview">
      <drag-split
          v-on:dragstart="$_onSplitDragstart"
          v-on:dragleave="$_onSplitDragleave"
          v-on:drag="$_onSplitDrag"
      />
      <markdown-it-vue
          class="markdown-editor-viewer"
          ref="viewer"
          :content="content"
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
  preview: boolean
  fullscreen: boolean
}

/**
 * 上次view的宽度, 开始调整时记录
 */
let prevEditorWidth = 0
@Component({
  components: {DragSplit, MarkdownItVue: MarkdownItVue as VueComponent, VueCodemirror: codemirror as VueComponent},
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
      editorWidth: 0,
      preview: true,
      fullscreen: false
    }
  },
  watch: {
    content(val): void{
      this.$emit("change", val)
    }
  }
})
export default class MarkdownEditor extends Vue{
  editorWidth!: number
  preview!: boolean
  fullscreen!: boolean
  content!: string
  value!: string

  created(): void{
    this.content = this.value
  }

  /**
   * 分割条拖动开始
   */
  $_onSplitDragstart(): void{
    prevEditorWidth = ((this.$refs.editor as Vue).$el as HTMLElement).clientWidth
  }
  /**
   * 分割条拖动中途结束
   */
  $_onSplitDragleave(): void{
    this.editorWidth = prevEditorWidth
  }
  /**
   * 分割条拖动
   */
  $_onSplitDrag(size: number): void{
    this.editorWidth = prevEditorWidth + size
  }

  /**
   * 获取CodeMirror
   */
  $_getCodeMirror(): CodeMirror.Editor{
    return (this.$refs.editor as any).codemirror as CodeMirror.Editor
  }

  /**
   * 替换选中内容的两侧文字
   */
  $_replaceSelection(start: string, end: string): void{
    const cm = this.$_getCodeMirror()
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
  $_bold(): void{
    this.$_replaceSelection("**", "**")
  }

  /**
   * 斜体
   */
  $_italic(): void{
    this.$_replaceSelection("*", "*")
  }

  /**
   * 删除线
   */
  $_removeLine(): void{
    this.$_replaceSelection("~~", "~~")
  }

  /**
   * 上标
   */
  $_superscript() :void{
    this.$_replaceSelection("^", "^")
  }

  /**
   * 下标
   */
  $_subscript(): void{
    this.$_replaceSelection("~", "~")
  }

  /**
   * 升级内容标题
   * @param content
   */
  $_upContentHeading(content: string): string{
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

  /**
   * 降级内容标题
   * @param content
   */
  $_downContentHeading(content: string): string{
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
  $_upHeading(): void{
    const cm = this.$_getCodeMirror()
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
          const r = this.$_upContentHeading(line)
          cm.replaceRange(r,{line: range.head.line, ch: 0}, {line: range.head.line, ch: line.length})
        }
      }else {
        selections[i] = this.$_upContentHeading(selection)
      }
    }
    cm.replaceSelections(selections, "around")
    cm.focus()
  }

  /**
   * 降级标题
   */
  $_downHeading(): void{
    const cm = this.$_getCodeMirror()
    const selections = cm.getSelections()
    const ranges = cm.listSelections()
    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i]
      const range = ranges[i]
      if(range.empty()){
        const line = cm.getLine(range.head.line)
        if(line){
          const r = this.$_downContentHeading(line)
          cm.replaceRange(r,{line: range.head.line, ch: 0}, {line: range.head.line, ch: line.length})
        }
      }else{
        selections[i] = this.$_downContentHeading(selection)
      }
    }
    cm.replaceSelections(selections, "around")
    cm.focus()
  }

  /**
   * 链接
   */
  $_link(): void{
    this.$_replaceSelection("[", `](${location.href})`)
  }

  /**
   * 代码
   */
  $_code(): void{
    this.$_replaceSelection("```\n", "\n```")
  }

  /**
   * 预览
   */
  $_preview(): void{
    this.preview = !this.preview
    this.$_getCodeMirror().focus()
  }

  /**
   * 全屏
   */
  $_fullscreen(): void{
    this.fullscreen = !this.fullscreen
    if(this.fullscreen){
      this.$el.requestFullscreen({
        navigationUI: "auto"
      })
    }else {
      document.exitFullscreen()
    }
    this.$_getCodeMirror().focus()
  }
}
</script>

<style lang="scss">
.vue-codemirror{
  max-width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  min-height: 300px;
}
.markdown-editor-main>.vue-codemirror>div{
  height: 100%;
}
.markdown-editor{
  border: #d5d5d5 solid 1px;
  overflow: hidden;
  background-color: white;
}
.markdown-editor-main{
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
}
.markdown-editor-viewer-box{
  flex: 1;
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