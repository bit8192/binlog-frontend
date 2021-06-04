<template>
  <el-row class="container" type="flex" :gutter="10">
    <el-col :md="18" :xs="24">
      <ArticleList style="margin-top: 1em" />
    </el-col>
    <el-col :md="6" :xs="24" class="home-panel-right">
      <user-state-panel style="margin-bottom: .5em" />
      <tag-list class="tag-list" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import ArticleList from "@/components/ArticleList.vue";
import TagList from "@/components/TagList.vue";
import CommonService from "@/service/CommonService";
import UserStatePanel from "@/components/UserStatePanel.vue";
import {Component, Vue} from "vue-property-decorator";

@Component({
  components: {UserStatePanel, TagList, ArticleList},
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
  padding-top: 1em;
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
