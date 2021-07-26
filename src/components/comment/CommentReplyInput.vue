<template>
  <div class="flex-row" v-on:keyup="onInputKeyUp">
    <el-input type="textarea" v-model="inputValue" :rows="2" :placeholder="placeholder" ref="input" autofocus />
    <el-button class="ml-2" v-on:click="()=>this.$emit('submit')">{{btnTitle}}</el-button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ElInput} from "element-ui/types/input";

@Component({
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
    if(this.autofocus) (this.$refs.input as ElInput).focus()
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
