<template>
  <div
      :class="'drag-split-' + orientation"
      v-on:mousedown="$_onMousedown"
  >
    <div :class="'drag-split-icon ' + 'drag-split-icon-' + orientation" />
  </div>
</template>

<script lang="ts">
declare interface Data{
  left: number
  top: number
}

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
export default {
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
    this.$_onMouseup = this.$_onMouseup.bind(this)
    this.$_onMousemove = this.$_onMousemove.bind(this)
    this.$_onMouseleave = this.$_onMouseleave.bind(this)
  },
  methods: {
    $_onMousedown(e: MouseEvent): void{
      const target = e.currentTarget as HTMLElement
      dragging = true
      dragStartX = e.clientX
      dragStartY = e.clientY
      target.offsetParent.addEventListener("mouseup", this.$_onMouseup)
      target.offsetParent.addEventListener("mousemove", this.$_onMousemove)
      target.offsetParent.addEventListener("mouseleave",this.$_onMouseleave)
      this.$emit("dragstart")
    },
    $_onMouseup(): void{
      this.$_dragover()
      this.$emit("dragover")
    },
    $_onMouseleave(): void{
      this.$_dragover()
      this.$emit("dragleave")
    },
    $_dragover(): void{
      dragging = false
      this.top = 0
      this.left = 0
      const target = this.$el as HTMLElement
      target.offsetParent.removeEventListener("mouseup", this.$_onMouseup)
      target.offsetParent.removeEventListener("mousemove", this.$_onMousemove)
      target.offsetParent.removeEventListener("mouseleave", this.$_onMouseleave)
    },
    $_onMousemove(e: MouseEvent): void{
      if(dragging){
        if(this.orientation === "horizontal"){
          this.$emit("drag", e.clientY - dragStartY)
        }else if(this.orientation === "vertical"){
          this.$emit("drag", e.clientX - dragStartX)
        }
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