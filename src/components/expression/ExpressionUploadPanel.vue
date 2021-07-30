<template>
  <div>
    <el-button class="el-icon-plus mr-2" slot="trigger" v-on:click="$refs.uploadInput.click()">添加文件</el-button>
    <el-button type="success" v-on:click="doUpload" :disabled="!expressionList.length || uploading">上传</el-button>
    <input type="file" multiple="multiple" accept="image/*" class="d-none" ref="uploadInput" v-on:change="onFileInputChange" />
    <ul class="list-style-none">
      <li v-for="(file, index) of expressionList" class="flex-row position-relative file-item mb-2" :key="file.uid">
        <div class="flex-1 text-center flex-row justify-content-center">
          <el-image :src="file.url" fit="contain" v-on:error="onLoadImageError(file, index)" />
        </div>
        <el-button type="text" icon="el-icon-delete" class="p-1 color-secondary color-warning-hover position-absolute" style="top: 5px; right: 5px" v-on:click="expressionList.splice(index, 1)" />
        <div class="p-3 flex-1 pt-5">
          <el-input placeholder="唯一标题,引用时的替换值,请用下划线连接关键字" class="width-100 mb-2" v-model="file.dto.title" v-on:blur="checkTitle(file)" >
            <el-popover v-if="!!file.titleErrorMsg" trigger="hover" slot="suffix">
              <i slot="reference" class="el-icon-error color-danger el-input__icon" />
              <div class="text-center">
                <span class="d-block color-warning">{{file.titleErrorMsg}}</span>
                <el-image v-if="!!file.repetitiveExpressionUrl" :src="file.repetitiveExpressionUrl" />
              </div>
            </el-popover>
          </el-input>
          <tag-select v-model="file.tags" :tags="tagList" :add-action="tagAction" class="mb-2" :add-item-min-len="1" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ExpressionDto from "@/domain/ExpressionDto";
import TagSelect from "@/components/TagSelect.vue";
import ExpressionTag from "@/domain/ExpressionTag";
import {URL_EXPRESSION, URL_EXPRESSION_TAG} from "@/constants/UrlApiExpression";
import ExpressionService from "@/service/ExpressionService";
import NetworkError from "@/error/NetworkError";
import {REG_EXP_EXPRESSION_TITLE} from "@/constants/RegExp";
import CommonUtils from "@/utils/CommonUtils";

//最大上传文件大小
const MAX_FILE_SIZE = 200 * 1024;
declare interface ExpressionInfo{
  uid: number,
  file: File,
  url: string,
  tags: ExpressionTag[],
  dto: ExpressionDto,
  titleErrorMsg?: string,
  repetitiveExpressionUrl?: string //如果发现有相同标题的表情时将放在这里
}
@Component({
  components: {TagSelect}
})
export default class ExpressionUploadPanel extends Vue{
  expressionList: ExpressionInfo[]
  tagAction: string
  tagList: ExpressionTag[]
  expressionUrl: string
  uploading: boolean

  data(): any{
    return {
      expressionList: [],
      tagAction: URL_EXPRESSION_TAG,
      tagList: [],
      expressionUrl: URL_EXPRESSION,
      uploading: false
    }
  }

  async created(): Promise<void>{
    this.tagList = await ExpressionService.getAllTags()
  }

  /**
   * 文件选择之后触发
   */
  onFileInputChange(e: InputEvent): void{
    const timestamp = new Date().getTime()
    const files = new Array<File>()
    for (let file of (e.target as HTMLInputElement).files) {
      if(this.expressionList.some(e=>e.file.name === file.name)){
        this.$message.warning("文件[" + file.name + "]重复")
      }else if(file.size > MAX_FILE_SIZE){
        this.$message.warning("表情[" + file.name + "]太大了(" + CommonUtils.formatDecimal(file.size / 1024, 2) + "kb), 不得超过" + MAX_FILE_SIZE / 1024 + "kb")
      }else{
        files.push(file);
      }
    }
    const expressionList = files.map((f, i)=>({
      uid: timestamp + i,
      file: f,
      url: URL.createObjectURL(f),
      tags: [],
      dto: {title: "", fileName: f.name, tagIds: []},
      titleErrorMsg: "",
      repetitiveExpressionUrl: null
    }))
    this.expressionList.push(...expressionList)
  }

  /**
   * 如果加载图片失败，说明不支持这个格式，提示并删掉
   */
  onLoadImageError(file: ExpressionInfo, index: number): void{
    this.$message.warning("无效图片:" + file.file.name)
    this.expressionList.splice(index, 1)
  }

  /**
   * 检测标题是否可用
   */
  async checkTitle(file: ExpressionInfo): Promise<void>{
    if(!file.dto.title) return;
    if(!file.dto.title.match(REG_EXP_EXPRESSION_TITLE)){
      file.titleErrorMsg = "标题不合法，仅支持数字、字母、文字、下划线和“-”符号";
      file.repetitiveExpressionUrl = "";
      return;
    }
    //先找本地的
    const expression = this.expressionList.find(e=>e !== file && e.dto.title === file.dto.title);
    if(expression){
      file.repetitiveExpressionUrl = expression.url
      file.titleErrorMsg = "标题重复";
      return;
    }
    try {
      await ExpressionService.getExpression(file.dto.title)
      file.repetitiveExpressionUrl = this.expressionUrl + "/" + file.dto.title
      file.titleErrorMsg = "标题已经被使用啦";
    }catch (e) {
      if(e instanceof NetworkError && (e as NetworkError).response.status === 404){
        file.repetitiveExpressionUrl = ""
        file.titleErrorMsg = "";
        return;
      }
      throw e
    }
  }

  /**
   * 上传
   */
  async doUpload(): Promise<void>{
    for (const expressionInfo of this.expressionList) {
      if(expressionInfo.repetitiveExpressionUrl) {
        this.$message.warning("标题有重复，请修改一哈")
        return;
      }
      if(!expressionInfo.dto.title.trim().length){
        this.$message.warning("标题必填哟")
        return;
      }
      if(!expressionInfo.dto.title.match(REG_EXP_EXPRESSION_TITLE)){
        this.$message.warning("标题[" + expressionInfo.dto.title + "]不合法");
        return;
      }
    }
    if(this.uploading) return;
    this.uploading = true
    try {
      const result = await ExpressionService.upload(
          this.expressionList.reduce((map, e) => (map[e.file.name] = e.file) && map, {}),
          this.expressionList.map(e => {
            e.dto.tagIds = e.tags.map(t => t.id)
            return e.dto
          })
      )
      this.$emit("complete", result)
      this.expressionList = []
    }finally {
      this.uploading = false
    }
  }

}
</script>

<style scoped lang="scss">
@import "src/style/var-color";

.file-item{
  border: solid 1px $color-secondary;
  border-radius: 5px;
}
</style>
