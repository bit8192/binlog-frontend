<template>
  <transition name="transition-from-top-fast">
    <div class="context-menu" tabindex="0" v-on:blur="onContextMenuBlur" :style="'left:' + left + 'px; top: ' + top + 'px;'" v-show="show">
      <ul>
        <li :class="'context-menu-item ' + (items[key].disabled ? 'context-menu-item-disabled ' : '')" v-for="key in Object.keys(items)" :key="key" v-on:click="()=>onClick(key, items[key])">{{items[key].title}}</li>
      </ul>
    </div>
  </transition>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import CommonUtils from "@/utils/CommonUtils";

declare interface Data{
  left: number
  top: number
  show: boolean
}
@Component({
  props: {
    items: Object,
  }
})
export default class ContextMenu extends Vue{
  items!: {[k: string]: ContextMenuItem}
  left!: number
  top!: number
  el: HTMLElement
  offsetParent: HTMLElement
  show!: boolean

  data(): Data{
    return {
      left: 0,
      top: 0,
      show: false
    }
  }

  onContextMenuBlur(): void{
    this.show = false
  }

  mounted(): void{
    this.el = this.$el as HTMLElement
    this.offsetParent = (this.el.parentElement || document) as HTMLElement
    this.el.focus()
    this.offsetParent.oncontextmenu = ()=>false
    this.offsetParent.addEventListener("contextmenu", this.onContextMenu)
  }

  beforeDestroy(): void{
    this.offsetParent.removeEventListener("contextmenu", this.onContextMenu)
  }

  /**
   * 打开菜单事件
   * @param e
   */
  onContextMenu(e: MouseEvent | any): void{
    if(CommonUtils.inElement(e.target, this.el)) return
    if(e.layerX !== undefined && e.layerY !== undefined){
      this.left = e.layerX
      this.top = e.layerY
    }else{
      const parentPosition = CommonUtils.getElementPosition(this.offsetParent)
      this.left = e.clientX - parentPosition.clientLeft
      this.top = e.clientY - parentPosition.clientTop
    }
    this.show = true
    this.$nextTick(()=>this.el.focus())
  }

  /**
   * 点击事件处理
   */
  onClick(key: string, item: ContextMenuItem): void{
    if(item.disabled) return
    this.$emit("click-item", key, item)
    this.show = false
  }
}
export interface ContextMenuItem{
  title: string
  disabled?: boolean
  icon?: string | string[]
}
</script>

<style scoped lang="scss">
@import "src/style/var-color";
.context-menu{
  position: absolute;
  display: inline-block;
  background-color: white;
  box-shadow: black 0 0 6px -2px;
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
.context-menu-item{
  padding: .5em 1em;
  cursor: pointer;
}
.context-menu-item-disabled{
  cursor: not-allowed;
  color: $color-text-disabled;
}
.context-menu-item:hover{
  color: white;
  background-color: $color-primary;
}
.context-menu-item-disabled:hover{
  color: $color-text-disabled;
  background-color: transparent;
}
.context-menu:focus{
  outline: none;
}
</style>