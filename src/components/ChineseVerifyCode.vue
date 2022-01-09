<template>
<div class="chinese-verify-code">
  <div class="chinese-verify-code-image-box" @click="onVerifyCodeClick">
    <el-image :src="verifyCodeUrl + '?t=' + verifyCodeTimestamp" >
      <template #placeholder>
        <el-skeleton loading animated>
          <el-skeleton-item variant="image" style="width: 300px; height: 300px" />
        </el-skeleton>
      </template>
    </el-image>
    <div
        class="chinese-verify-code-point"
        v-for="(point, index) in points" :key="point.x + '-' + point.y" :style="'left: ' + point.x + 'px; top: ' + point.y + 'px'"
        :data-index="index"
    >
      {{index + 1}}
    </div>
  </div>
  <div>
    <el-button type="text" @click="refresh">看不清？换一张</el-button>
  </div>
</div>
</template>

<script lang="ts">
import CommonUtils from "@/utils/CommonUtils";
import NotificationError from "@/error/NotificationError";
import {Options, Vue} from "vue-class-component";
import ElementUtils from "@/utils/ElementUtils";
import {URL_VERIFY_CODE} from "@/constants/UrlApiCommon";

interface Point{
  x: number
  y: number
}


const instanceList: Array<ChineseVerifyCode> = []
let verifyCodeTimestamp = new Date().getTime()
export function refreshVerifyCode(): void{
  verifyCodeTimestamp = new Date().getTime();
  instanceList.forEach(i=>{
    i.verifyCodeTimestamp = verifyCodeTimestamp;
    i.points = []
  })
}
export function refreshVerifyCodeIfExpire(): void{
  if(new Date().getTime() - verifyCodeTimestamp > 600000){
    refreshVerifyCode()
  }
}

@Options({
  props: {
    minPointLen: {
      type: Number,
      default: 2
    },
    maxPointLen: {
      type: Number,
      default: 4
    }
  },
  data(): any{
    return {
      verifyCodeTimestamp: verifyCodeTimestamp,
      points: [],
      verifyCodeUrl: URL_VERIFY_CODE,
    }
  },
  created() {
    instanceList.push(this)
  },
  beforeDestroy() {
    instanceList.splice(instanceList.indexOf(this), 1)
  }
})
export default class ChineseVerifyCode extends Vue{
  minPointLen: number
  maxPointLen: number
  verifyCodeTimestamp: number
  points: Point[]

  clear(): void{
    this.points = []
  }

  refresh(): void{
    this.points = []
    refreshVerifyCode()
  }

  onVerifyCodeClick(e: MouseEvent | any): void{
    const target = e.target as HTMLElement
    //点到已经选择的点，那么删除点
    if(target.className === "chinese-verify-code-point"){
      const index = parseInt(target.dataset.index)
      if(index >= 0 && index < this.points.length){
        this.points.splice(index, this.points.length - index)
      }
      return;
    }
    //如果超出数量那么不再添加
    if(this.points.length >= this.maxPointLen) return
    if(e.layerX !== undefined && e.layerY !== undefined){
      this.points.push({
        x: e.layerX,
        y: e.layerY
      })
    }else{
      const position = ElementUtils.getElementPosition(target)
      this.points.push({
        x: e.clientX - position.clientLeft,
        y: e.clientY - position.clientTop
      })
    }
  }

  /**
   * 获取验证提交所需数据
   */
  getParams(): any{
    if(this.points.length < this.minPointLen){
      throw new NotificationError("请输入验证码")
    }
    return CommonUtils.map2obj(new Map(this.points.map((p, i)=>['point' + i, p.x + ',' + p.y])))
  }
}
</script>

<style scoped lang="scss">
.chinese-verify-code-image-box{
  display: inline-block;
  position: relative;
}
.chinese-verify-code-point{
  position: absolute;
  width: 16px;
  height: 16px;
  border: white solid 3px;
  border-radius: 16px;
  text-align: center;
  overflow: hidden;
  background-color: #0099ff;
  color: white;
  box-shadow: #333333 0 0 10px 3px;
  margin-left: -11px;
  margin-top: -11px;
  line-height: 15px;
  user-select: none;
}
</style>
