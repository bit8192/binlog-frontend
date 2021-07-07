<template>
  <el-form ref="form" :model="articleClass" :rules="formRules">
    <el-form-item prop="title">
      <el-input placeholder="标题" v-model="articleClass.title" v-on:change="$_onChange" />
    </el-form-item>
    <el-form-item>
      <el-switch v-model="articleClass.visible" v-on:change="$_onChange" active-text="可见"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-input-number v-model="articleClass.orderNum" :min="0" :max="999" placeholder="排序" v-on:change="$_onChange" ></el-input-number>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import ArticleClass from "@/domain/ArticleClass";
import {Component, Vue} from "vue-property-decorator";
import {ElForm} from "element-ui/types/form";

@Component({
  name: "ArticleClassForm",
  props: {
    value: Object
  },
  watch: {
    value(v: ArticleClass): void{
      this.articleClass = v
    }
  },
  model: {
    prop: "value",
    event: "change"
  }
})
export default class ArticleClassForm extends Vue{
  value!: ArticleClass
  articleClass!: ArticleClass
  formRules!: any

  data(): any{
    return {
      articleClass: {title: "", visible: true},
      formRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 2, message: "至少输入两个字符", trigger: "blur"}
        ],
      }
    }
  }
  $_onChange(): void{
    this.$emit("change", this.articleClass)
  }
  created(): void{
    this.articleClass = this.value;
  }
  validate(): Promise<boolean>{
    return new Promise<boolean>(resolve => {
      const form = this.$refs.form as ElForm;
      form.validate((valid: boolean)=>{
        if(valid){
          resolve(true)
        }else {
          resolve(false)
          return false
        }
      })
    });
  }
}
</script>

<style scoped>

</style>