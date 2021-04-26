<template>
  <div id="app">
    <el-header id="header">
      <nav-menu :profile="systemProfile" />
    </el-header>
    <el-main id="main">
      <el-row type="flex" justify="center">
        <el-col :sm="16" :xs="24" id="content">
          <router-view/>
        </el-col>
      </el-row>
    </el-main>
    <el-footer id="footer">
      <span class="text-sub">{{systemProfile.copyRight}}</span>
      <span class="text-sub">powered by <a  target="_blank" href="//bincker.cn">bincker</a></span>
      <span><a href="https://beian.miit.gov.cn/" target="_blank" class="text-sub">{{systemProfile.ipc}}</a></span>
      <span>
        <a class="text-sub" target="_blank" :href="systemProfile.github" v-if="systemProfile.github">
          <font-awesome-icon :icon="['fab', 'github']" size="2x" />
        </a>
      </span>
    </el-footer>
  </div>
</template>
<script lang="ts">
import SystemProfile from "@/domain/SystemProfile";
import CommonService from "@/service/CommonService";
import NavMenu from "@/components/NavMenu.vue";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

library.add(faGithub)

interface Data{
  systemProfile: SystemProfile
}
export default {
  components: {NavMenu},
  data(): Data {
    return {
      systemProfile: {}
    }
  },
  async created(): Promise<void> {
    this.systemProfile = await CommonService.getSystemProfile()
  }
}
</script>