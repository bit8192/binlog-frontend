<template>
  <el-select
      v-model="selectedTags"
      placeholder="标签"
      style="width: 100%"
      value-key="id"
      :filter-method="tagSelectFilterFun"
      v-on:change="onTagSelectChange"
      :loading="tagSelectLoading"
      multiple
      filterable
      default-first-option
  >
    <template v-if="selectedTags.length">
      <el-option-group label="可选" ref="selectableGroup">
        <el-option v-for="tag of tagSearchResult" :key="tag.id" :value="tag" :label="tag[titlePropName]">
          <span v-if="tag.id === -1" class="color-primary" style="font-size: .85em; margin-right: 1em">新建</span>
          <span>{{tag[titlePropName]}}</span>
        </el-option>
      </el-option-group>
      <el-option-group label="已选">
        <el-option v-for="tag of selectedTags" :key="tag.id" :value="tag" :label="tag[titlePropName]">
          <span>{{tag[titlePropName]}}</span>
        </el-option>
      </el-option-group>
    </template>
    <template v-else>
      <el-option v-for="tag of tagSearchResult" :key="tag.id" :value="tag" :label="tag[titlePropName]">
        <span v-if="tag.id === -1" class="color-primary" style="font-size: .85em; margin-right: 1em">新建</span>
        <span>{{tag[titlePropName]}}</span>
      </el-option>
    </template>
  </el-select>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import {ElOptionGroup} from "element-ui/types/option-group";

@Component({
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    titlePropName: {
      type: String,
      default: "title"
    },
    action: String,
    tags: Array,
    addAction: {
      type: String,
      required: true
    },
    addItemMinLen: {
      type: Number,
      default: 2
    },//添加词条的最短长度
    value: Array
  },
  watch: {
    selectedTags(value: any[]): void{
      this.$emit("change", value)
    },
    tags(value: any[]): void{
      this.tagList = value;
    }
  }
})
export default class TagSelect extends Vue{
  value: any[]
  tagList: any[]
  titlePropName: string
  action: string
  tags: any[]//如果提供了tags, 那么就不用请求数据，这是为了让多个选择框不会重复去获取数据
  addAction: string
  tagSearchResult: any[]
  selectedTags: any[]
  tagSelectLoading: boolean
  addItemMinLen: number//添加词条的最短长度

  data(): any{
    return {
      tagList: [],
      tagSearchResult: [],
      selectedTags: this.value || [],
      tagSelectLoading: false
    }
  }

  created(): void{
    this.loadTags()
  }

  async loadTags(): Promise<void>{
    if(this.tags){
      this.tagList = this.tags;
      this.tagSearchResult = this.tagList;
      return;
    }
    this.tagSelectLoading = true
    try {
      this.tagList = await axios.get(this.action)
      this.tagSearchResult = this.tagList
    }finally {
      this.tagSelectLoading = false;
    }
  }

  /**
   * 标签列表过滤方法，添加新增选项
   */
  private tagSelectFilterFun(keyword: string){
    keyword = keyword.trim()
    let isFound = false
    const result = this.tagList.filter(tag=>{
      const title = tag[this.titlePropName]
      const index = title.indexOf(keyword)
      if(!isFound) isFound = index === 0 && title.length === keyword.length
      return index > -1 && !this.selectedTags.some(t=>t.id === tag.id);
    });
    if(!isFound && keyword !== "" && keyword.length >= this.addItemMinLen) result.unshift({id: -1, [this.titlePropName]: keyword})
    this.tagSearchResult = result;
    //这个分组总在意想不到的时候隐藏自己
    this.$nextTick(()=>{
      if(this.$refs.selectableGroup) (this.$refs.selectableGroup as ElOptionGroup).$emit("queryChange")
    })
  }

  /**
   * 当select改变时，查询是否选择了新增条目，如果选择了新增条目，那么进行创建操作
   * @param data
   * @private
   */
  private async onTagSelectChange(data: any[]): Promise<void>{
    const newItem = data.find(i=>i.id === -1);
    if(!newItem) {
      this.tagSearchResult = this.tagList.filter(t=>!this.selectedTags.some(t1=>t1.id === t.id))
      return;
    }
    this.tagSelectLoading = true
    try {
      const result = await axios.post(this.addAction, {[this.titlePropName]: newItem[this.titlePropName]})
      const valueIndex = this.selectedTags.findIndex(tag=>tag.id === -1)
      this.selectedTags[valueIndex] = result
      this.tagList.push(result)
      this.tagSearchResult = this.tagList.filter(t=>!this.selectedTags.some(t1=>t1.id === t.id))
    }finally {
      this.tagSelectLoading = false
    }
  }
}
</script>

<style scoped>

</style>
