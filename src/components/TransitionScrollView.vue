<template>
    <div
        :class="classList"
        v-on:transitionstart="$_onTransitionstart"
        v-on:transitionend="$_onTransitionend"
        v-on:animationstart="$_onAnimationstart"
        v-on:animationend="$_onAnimationend"
    >
      <slot />
    </div>
</template>

<script lang="ts">
import Debounce from "@/decorators/Debounce";
import {Component, Vue} from "vue-property-decorator";
import ElementUtils from "@/utils/ElementUtils";

declare interface Data{
  show: boolean
  classList: string
}


@Component({
  name: "TransitionScrollView",
  props: {
    /**
     * 动画名称
     */
    name: {
      type: String,
      default: "transition-from-top"
    },
    /**
     * 距离多少移入和移出
     */
    distanceRange: {
      type: Number,
      default: 100
    }
  },
  data(): Data{
    return {
      show: false,
      classList: (this as TransitionScrollView).name + TransitionScrollView.CLASS_ENTER
    }
  },
  watch: {
    show(value: boolean){
      if(value){
        this.classList = (this as TransitionScrollView).name + TransitionScrollView.CLASS_ENTER_ACTIVE + " " + this.name + TransitionScrollView.CLASS_ENTER_TO
      }else{
        this.classList = (this as TransitionScrollView).name + TransitionScrollView.CLASS_LEAVE_ACTIVE + " " + this.name + TransitionScrollView.CLASS_LEAVE_TO
      }
    }
  }
})
export default class TransitionScrollView extends Vue{
  static CLASS_ENTER = "-enter"
  static CLASS_ENTER_ACTIVE = "-enter-active"
  static CLASS_ENTER_TO = "-enter-to"
  static CLASS_LEAVE = "-leave"
  static CLASS_LEAVE_ACTIVE = "-leave-active"
  static CLASS_LEAVE_TO = "-leave-to"

  name!: string
  show!: boolean
  distanceRange!: number
  classList!: string

  created(): void{
    this.onScroll = this.onScroll.bind(this)
    TransitionScrollView.addScrollListener(this.onScroll)
  }
  mounted(): void{
    this.show = this.$_inScreen(this.distanceRange)
  }
  destroyed(): void{
    TransitionScrollView.deleteScrollListener(this.onScroll)
  }

  onScroll(): void{
    this.show = this.$_inScreen(this.distanceRange)
  }

  private $_inScreen(distanceRange: number): boolean{
    if(!document) return true;
    const el = this.$el as HTMLElement
    const position = ElementUtils.getElementPosition(el)
    return position.clientTop + el.clientHeight > distanceRange && position.clientTop + distanceRange < document.scrollingElement.clientHeight
  }

  $_onTransitionstart(): void{
    if(this.show){
      this.classList = this.name + TransitionScrollView.CLASS_ENTER_ACTIVE + " " + this.name + TransitionScrollView.CLASS_ENTER_TO
    }else{
      this.classList = this.name + TransitionScrollView.CLASS_LEAVE_ACTIVE + " " + this.name + TransitionScrollView.CLASS_LEAVE_TO
    }
  }
  $_onTransitionend(): void{
    if(this.show){
      this.classList = this.name + TransitionScrollView.CLASS_ENTER_TO
    }else {
      this.classList = this.name + TransitionScrollView.CLASS_LEAVE_TO
    }
  }
  $_onAnimationstart(): void{
    this.$_onTransitionstart()
  }
  $_onAnimationend(): void{
    this.$_onTransitionend()
  }

  private static scrollEventListenerSet = new Set<()=>void>()
  private static addScrollListener(method: ()=>void) {
    if(!TransitionScrollView.scrollEventListenerSet.size && document){
      document.addEventListener("scroll", TransitionScrollView.scrollEventListener)
    }
    TransitionScrollView.scrollEventListenerSet.add(method)
  }
  private static deleteScrollListener(method: ()=>void){
    TransitionScrollView.scrollEventListenerSet.delete(method)
    if(!TransitionScrollView.scrollEventListenerSet.size && document){
      document.removeEventListener("scroll", TransitionScrollView.scrollEventListener)
    }
  }
  @Debounce()
  private static scrollEventListener(){
    for (let method of TransitionScrollView.scrollEventListenerSet) {
      try{
        method()
      }catch (e){
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
