<template>
  <div>
    <div class="flex-row" @keyup="onInputKeyUp">
      <el-input type="textarea" v-model="inputValue" :rows="2" :placeholder="placeholder" ref="input" autofocus />
      <el-button class="ml-2" @click="()=>this.$emit('submit')">{{btnTitle}}</el-button>
    </div>
    <emoji-popover @select="emoji=>inputValue+=emoji" class="mr-3" />
    <slot name="action" />
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faSmile} from "@fortawesome/free-solid-svg-icons";
import EmojiPopover from "@/components/comment/EmojiPopover.vue";
library.add(faSmile)

@Options({
  components: {EmojiPopover},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String,
    placeholder: String,
    autofocus: Boolean,
    btnTitle: {
      type: String,
      default: "回复"
    }
  },
  watch: {
    value(val: string): void{
      this.inputValue = val
    },
    inputValue(val: string): void{
      this.$emit('change', val)
    }
  },
  mounted() :void{
    if(this.autofocus) (this.$refs.input as any).focus()
  }
})
export default class CommentReplyInput extends Vue{
  value: string
  inputValue: string
  btnTitle: string
  data(): any{
    return {
      inputValue: this.value
    }
  }

  /**
   * Ctrl+Enter 提交
   * @param e
   */
  onInputKeyUp(e: KeyboardEvent): boolean{
    if(e.ctrlKey && e.key === "Enter") {
      this.$emit("submit")
      return false;
    }
    return true;
  }
}
</script>

<style scoped>

</style>
