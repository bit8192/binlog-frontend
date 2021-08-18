<template>
  <oauth2-authorize-button :authorize-url="authorizeUrl" :check-notice="checkNotice" v-on:authorized="u=>$emit('authorized', u)" ref="btn">
    <div style="line-height: 30px">
      <font-awesome-icon :icon="['fab', 'github']" size="2x" style="vertical-align: middle" />
      Github帐号登录
    </div>
  </oauth2-authorize-button>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {URL_AUTHORIZE_GITHUB} from "@/constants/UrlApiAuthentication";
import Oauth2AuthorizeService from "@/service/Oauth2AuthorizeService";
import Oauth2AuthorizeButton from "@/components/authorize/Oauth2AuthorizeButton.vue";

library.add(faGithub)

@Component({
  components: {Oauth2AuthorizeButton}
})
export default class GithubAuthorizeButton extends Vue{
  authorizeUrl = URL_AUTHORIZE_GITHUB
  checkNotice = Oauth2AuthorizeService.checkNoticeGithub

  authorize(): void{
    (this.$refs.btn as Oauth2AuthorizeButton).authorize()
  }
}
</script>

<style scoped>

</style>
