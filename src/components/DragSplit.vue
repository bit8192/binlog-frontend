<template>
  <div
      :class="'drag-split-' + orientation"
      @mousedown="onMousedown"
  >
    <div :class="'drag-split-icon ' + 'drag-split-icon-' + orientation" />
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

declare interface Data{
  left: number
  top: number
}

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;

@Options({
  name: "DragSplit",
  data(): Data{
    return {
      left: 0,
      top: 0
    }
  },
  props: {
    orientation: {
      type: String,
      default: 'vertical'
    }
  },
  created() :void{
    this.onMouseup = this.onMouseup.bind(this)
    this.onMousemove = this.onMousemove.bind(this)
    this.onMouseleave = this.onMouseleave.bind(this)
  },
})
export default class DragSplit extends Vue{
  top: number
  left: number
  orientation: string

  onMousedown(e: MouseEvent): void{
    const target = e.currentTarget as HTMLElement
    dragging = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    target.offsetParent.addEventListener("mouseup", this.onMouseup)
    target.offsetParent.addEventListener("mousemove", this.onMousemove)
    target.offsetParent.addEventListener("mouseleave",this.onMouseleave)
    this.$emit("dragstart")
  }
  onMouseup(): void{
    this.dragover()
    this.$emit("dragover")
  }
  onMouseleave(): void{
    this.dragover()
    this.$emit("dragleave")
  }
  dragover(): void{
    dragging = false
    this.top = 0
    this.left = 0
    const target = this.$el as HTMLElement
    target.offsetParent.removeEventListener("mouseup", this.onMouseup)
    target.offsetParent.removeEventListener("mousemove", this.onMousemove)
    target.offsetParent.removeEventListener("mouseleave", this.onMouseleave)
  }
  onMousemove(e: MouseEvent): void{
    if(dragging){
      if(this.orientation === "horizontal"){
        this.$emit("drag", e.clientY - dragStartY)
      }else if(this.orientation === "vertical"){
        this.$emit("drag", e.clientX - dragStartX)
      }
    }
  }
}
</script>

<style scoped>
.drag-split-horizontal{
  height: 10px;
  cursor: row-resize;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.drag-split-vertical{
  width: 10px;
  cursor: col-resize;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.drag-split-icon{
  background-color: #666666;
  border-radius: 3px;
}
.drag-split-icon-horizontal{
  height: 3px;
  width: 3em;
}
.drag-split-icon-vertical{
  height: 3em;
  width: 3px;
}
</style>
