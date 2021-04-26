<template>
<div>
  <div class="markdown-editor-tools-bar">
  </div>
  <div class="markdown-editor-main">
    <textarea :value="content" v-on:input="e=>content = e.target.value" />
    <markdown-it-vue :content="content" />
  </div>
</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import MarkdownItVue from "markdown-it-vue"
import 'markdown-it-vue/dist/markdown-it-vue.css'
import {Component as VueComponent} from "vue"

interface Data{
  content: string
}
@Component({
  components: {MarkdownItVue: MarkdownItVue as VueComponent},
  data(): Data{
    return {
      content: "# title  \nabcdefg"
    }
  },
})
export default class MarkdownEditor extends Vue{
}
</script>

<style scoped lang="scss">
.markdown-editor-main{
  display: flex;
  flex-flow: row nowrap;
}
</style>