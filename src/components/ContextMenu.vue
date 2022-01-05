<template>
  <transition name="transition-from-top-fast">
    <div class="context-menu" tabindex="0" @blur="onContextMenuBlur" :style="'left:' + left + 'px; top: ' + top + 'px;'" v-show="show">
      <ul>
        <li :class="'context-menu-item ' + (items[key].disabled ? 'context-menu-item-disabled ' : '')" v-for="key in Object.keys(items)" :key="key" @click="()=>onClick(key, items[key])">{{items[key].title}}</li>
      </ul>
    </div>
  </transition>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ElementUtils from "@/utils/ElementUtils";

declare interface Data{
  left: number
  top: number
  show: boolean
}
@Options({
  props: {
    items: Object,
  }
})
export default class ContextMenu extends Vue{
  items!: {[k: string]: ContextMenuItem}
  left!: number
  top!: number
  el: HTMLElement
  menuParentElement: HTMLElement
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
    this.menuParentElement = (this.el.parentElement || document) as HTMLElement
    this.el.focus()
    this.menuParentElement.oncontextmenu = ()=>false
    this.menuParentElement.addEventListener("contextmenu", this.onContextMenu)
  }

  beforeDestroy(): void{
    this.menuParentElement.removeEventListener("contextmenu", this.onContextMenu)
  }

  /**
   * 打开菜单事件
   * @param e
   */
  onContextMenu(e: MouseEvent | any): void{
    if(ElementUtils.inElement(e.target, this.el)) return
    const parentPosition = ElementUtils.getElementPosition(this.menuParentElement)
    this.left = e.clientX - parentPosition.offsetLeft
    this.top = e.clientY - parentPosition.offsetTop
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
  min-width: 100px;
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
