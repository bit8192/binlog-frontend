<template>
<el-form :model="passwordGroup" :rules="rules" ref="form">
  <el-form-item label="标题" prop="title" required>
    <el-input v-model="passwordGroup.title" placeholder="标题" />
  </el-form-item>
  <el-form-item label="备注" prop="remark">
    <el-input v-model="passwordGroup.remark" placeholder="备注" />
  </el-form-item>
</el-form>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import PasswordGroup from "@/domain/PasswordGroup";
import PasswordGroupService from "@/service/PasswordGroupService";

@Options({
  name: "PasswordGroupEdit",
  props: {
    value: Object
  },
  model: {
    prop: "value",
    event: "save"
  },
  watch: {
    value(val: PasswordGroup): void{
      this.passwordGroup = val || {};
    }
  }
})
export default class PasswordGroupEdit extends Vue{
  value: PasswordGroup
  passwordGroup: PasswordGroup
  rules = {
    title: {required: true, message: '请填写标题'},
  }

  data() :any{
    return {
      passwordGroup: this.value || {title: '', remark: ''}
    }
  }

  public async save(): Promise<PasswordGroup>{
    const form = this.$refs.form as any
    if(!(await form.validate())) return null;
    let result: PasswordGroup;
    if(this.passwordGroup.id){
      result = await PasswordGroupService.update(this.passwordGroup);
    }else{
      result = await PasswordGroupService.add(this.passwordGroup);
    }
    this.passwordGroup.id = result.id;
    this.$emit('save', result);
    return result;
  }
}
</script>

<style scoped>

</style>
