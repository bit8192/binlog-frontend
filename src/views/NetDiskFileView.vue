<template>
  <div class="net-disk-file-view">
    <net-disk-file-list :init-path-id="initPathId" v-on:change="onChange" style="height: 100%"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NetDiskFileList from "@/components/net-disk-file/NetDiskFileList.vue";
import NetDiskFile from "@/domain/NetDiskFile";

@Component({
  components: {NetDiskFileList},
  data: ()=>{
    return {
      initPathId: undefined
    }
  }
})
export default class NetDiskFileView extends Vue{
  initPathId: number
  created(): void{
    const pathMatch = this.$route.params.pathMatch as string
    if(pathMatch){
      if(pathMatch.match(/\d+/)){
        this.initPathId = +pathMatch
      }else{
        this.$router.replace({
          params: { pathMatch: "" }
        })
      }
    }
  }
  onChange(path: NetDiskFile): void{
    this.replacePathMatch(path.id ? path.id.toString() : "")
  }
  replacePathMatch(pathMatch: string): void{
    if(pathMatch === this.$route.params.pathMatch || (pathMatch === "" && this.$route.params.pathMatch === undefined)) return;
    this.$router.replace({
      params: {pathMatch}
    })
  }
}
</script>

<style lang="scss" scoped>
@import "src/style/var-layout";

.net-disk-file-view{
  height: $router-view-height;
}
</style>