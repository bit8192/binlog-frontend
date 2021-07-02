<template>
  <el-row class="container" type="flex" :gutter="10">
    <el-col :md="18" :xs="24">
      <article-page />
    </el-col>
    <el-col :md="6" :xs="24" class="home-panel-right">
      <user-state-panel style="margin-bottom: .5em" />
      <tag-list-hot class="tag-list" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import ArticlePage from "@/components/article/ArticlePage.vue";
import TagListHot from "@/components/TagListHot.vue";
import CommonService from "@/service/CommonService";
import UserStatePanel from "@/components/UserStatePanel.vue";
import {Component, Vue} from "vue-property-decorator";

@Component({
  components: {UserStatePanel, TagListHot, ArticlePage},
  inject: ['app']
})
export default class Home extends Vue{
  async created() : Promise<void>{
    const systemProfile = await CommonService.getSystemProfile()
    document.title = systemProfile.name
  }
}
</script>
<style lang="scss">
@import "src/style/var-device-width";
.container{
  align-items: stretch;
}
.tag-list{
  position: -webkit-sticky;
  position: sticky;
  top: 1em;
}
.home-panel-right{
}
@media screen and (max-width: $device-width-xs){
  .container{
    flex-flow: column-reverse wrap;
  }
  .tag-list{
    position: unset;
    top: unset;
    margin-bottom: 1em;
  }
}
</style>
