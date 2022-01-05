<template>
  <p class="my-0">
    <component v-for="(item, index) of renderContent" :key="index" :is="item"/>
  </p>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import UserInfo from "@/domain/UserInfo";
import {REG_EXP_COMMENT_EXPRESSION, REG_EXP_MEMBERS} from "@/constants/RegExp";
import {URL_EXPRESSION} from "@/constants/UrlApiExpression";
import {Component, defineComponent, h} from "vue";

@Options({
  props: {
    content: {
      type: String,
      required: true
    },
    members: Array
  },
  watch: {
    content(): void{
      this.renderContent = this.handleContent()
    }
  }
})
export default class CommentContent extends Vue{
  content: string
  members: UserInfo[]
  renderContent: Array<Component>

  data(): any{
    return {
      renderContent: this.handleContent()
    }
  }

  /**
   * 处理内容
   */
  handleContent(): Array<Component>{
    let result: Array<string|Component> = [this.content];
    const replaceInfoArr = this.getReplaceInfo();
    for (let replaceInfo of replaceInfoArr) {
      for (let i = 0; i < result.length; i++) {
        const targetStr = result[i]//正在替换的字符串
        if(typeof targetStr !== "string") continue;//只有字符串才进行替换
        const replaceResult = []//替换结果
        const regExpMatchArrays = [...targetStr.matchAll(replaceInfo.regexp)]
        if(!regExpMatchArrays.length) continue;
        let index = 0;//记录上一次匹配的位置，用于依次取出字符串
        for (const matchResult of regExpMatchArrays) {
          if(!replaceInfo.isReplace(matchResult)) continue;
          let matchStart = matchResult.index
          let matchLength = matchResult[replaceInfo.replaceGroup].length

          if(replaceInfo.getReplaceIndex){
            matchStart = matchResult.index + replaceInfo.getReplaceIndex(matchResult)
          }else if(replaceInfo.replaceGroup){
            matchStart = matchResult.index + matchResult[0].indexOf(matchResult[replaceInfo.replaceGroup])
          }

          if(matchStart > index){//如果没有匹配到开始位置，那么把前面不匹配的字符串放回去
            replaceResult.push(targetStr.substring(index, matchStart))
          }
          replaceResult.push(replaceInfo.replaceResult(matchResult))
          index = matchStart + matchLength
        }
        if(index < targetStr.length){//没有匹配完的字符串放回去
          result.push(targetStr.substring(index))
        }
        const surplusItems = result.splice(i + 1, result.length - i - 1);//剩下没匹配的项目
        result = result.splice(0, i).concat(replaceResult, surplusItems);//已经完成匹配的拼接匹配结果和没匹配的
        if(replaceResult.length){
          i += replaceResult.length - 1
        }
      }
    }
    for (let i = 0; i < result.length; i++) {
      const content = result[i];
      if(typeof content === "string"){
        result[i] = defineComponent({
          render: ()=>h("span", content)
        })
      }
    }
    return result as Array<Component>;
  }

  /**
   * 替换信息
   */
  getReplaceInfo(): ReplaceInfo[]{
    const result = [];
    //换行
    result.push({
      regexp: /\n/g,
      replaceGroup: 0,
      isReplace: ()=>true,
      replaceResult: ()=>defineComponent({
        render: ()=>h("br")
      })
    })
    //删除的评论
    result.push({
      regexp: /^$/g,
      replaceGroup: 0,
      isReplace: ()=>true,
      replaceResult: ()=>defineComponent({
        render: ()=>h("span", {class: "color-text-sub"}, "评论已删除")
      })
    })
    //  @到的用户
    if(this.members && this.members.length){
      result.push(
          {
            regexp: REG_EXP_MEMBERS,
            replaceGroup: 0,
            isReplace: (matchResult: RegExpMatchArray): boolean =>{
              return this.members.some(m=>m.username === matchResult[2])
            },
            replaceResult(matchResult: RegExpMatchArray): Component | string {
              return defineComponent({
                render: ()=>h("ElButton", {class: "comment-member mx-1", props: {type: "text"}}, "@" + matchResult[2])
              })
            }
          }
      )
    }
    // 表情
    result.push({
      regexp: REG_EXP_COMMENT_EXPRESSION,
      replaceGroup: 0,
      isReplace: ()=>true,
      replaceResult(matchResult: RegExpMatchArray): Component | string {
        return defineComponent({
          render: () => {
            return h("ElImage", {
              props: {
                src: URL_EXPRESSION + '/' + decodeURIComponent(matchResult[1]),
              }
            }, [
              h("span", {slot: "placeholder"}, matchResult[0]),
              h("span", {slot: "error"}, matchResult[0])
            ])
          }
        })
      }
    })
    return result;
  }
}

declare interface ReplaceInfo{
  regexp: RegExp//替换正则
  replaceGroup: number//进行替换的子匹配项, 如果非0, 那么会从第0个group中搜索当前子匹配项来获取替换位置
  getReplaceIndex?(matchResult: RegExpMatchArray): number//如果通过replaceGroup无法正确获取替换位置，那么可以提供这个方法自定义获取
  isReplace(matchResult: RegExpMatchArray): boolean//判断是否进行替换
  replaceResult(matchResult: RegExpMatchArray): Component|string//替换结果
}
</script>

<style scoped>

</style>
