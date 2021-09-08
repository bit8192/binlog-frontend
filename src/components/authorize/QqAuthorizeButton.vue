<template>
  <oauth2-authorize-button :authorize-url="authorizeUrl" :check-notice="checkNotice" v-on:authorized="u=>$emit('authorized', u)" v-on:success="$emit('success')" ref="btn">
    <div style="line-height: 30px">
      <img alt="qq-logo" :src="qqImage" style="width: 25px; height: 30px; float: left" class="pr-2" /> QQ帐号登录
    </div>
  </oauth2-authorize-button>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { URL_AUTHORIZE_QQ } from "@/constants/UrlApiAuthentication";
import Oauth2AuthorizeButton from "@/components/authorize/Oauth2AuthorizeButton.vue";
import Oauth2AuthorizeService from "@/service/Oauth2AuthorizeService";

@Component({
  components: {Oauth2AuthorizeButton}
})
export default class QqAuthorizeButton extends Vue{
  qqImage = require('@/assets/qq.png')
  authorizeUrl = URL_AUTHORIZE_QQ
  checkNotice = Oauth2AuthorizeService.checkNoticeQQ

  authorize(): void{
    (this.$refs.btn as Oauth2AuthorizeButton).authorize();
  }
}
</script>

<style scoped>

</style>
