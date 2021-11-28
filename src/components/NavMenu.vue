<template>
  <div id="nav">
    <router-link to="/" class="d-contents">
      <img :src="logo" alt="logo" height="50" />
      <h1 id="nav-title">{{profile && profile.name || "Blog"}}</h1>
    </router-link>
    <div class="flex-1">
      <slot/>
    </div>
    <el-menu mode="horizontal" router :default-active="$route.path" class="hidden-sm-and-down" v-on:select="onSelectMenu">
      <template v-for="item in menuList.filter(i=>i.visible)">
        <el-menu-item v-if="!item.children || !item.children.length" :key="item.title" :index="item.route">
          <el-badge v-if="item.title === '消息' && unreadMessageCount && $route.path !== '/message'" :value="unreadMessageCount" style="line-height: initial">{{item.title}}</el-badge>
          <span v-else>{{item.title}}</span>
        </el-menu-item>
        <el-submenu v-else :key="item.route" index="0">
          <template slot="title">{{item.title}}</template>
          <el-menu-item v-for="submenu in item.children" :key="submenu.title" :index="item.route">{{submenu.title}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
    <el-menu mode="horizontal" router :default-active="$route.path" class="hidden-md-and-up" menu-trigger="click">
      <el-submenu index="">
        <template slot="title"><font-awesome-icon :icon="['fas', 'bars']" size="lg"/></template>
        <template v-for="item in menuList.filter(i=>i.visible)">
          <el-menu-item v-if="!item.children || !item.children.length" :key="item.title" :index="item.route">
            <el-badge v-if="item.title === '消息' && unreadMessageCount && $route.path !== '/message'" :value="unreadMessageCount">{{item.title}}</el-badge>
            <span v-else>{{item.title}}</span>
          </el-menu-item>
          <el-submenu v-else :key="item.route" index="0">
            <template slot="title">{{item.title}}</template>
            <el-menu-item v-for="submenu in item.children" :key="submenu.title" :index="item.route">{{submenu.title}}</el-menu-item>
          </el-submenu>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script lang="ts">
import {library} from "@fortawesome/fontawesome-svg-core";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {Component, Vue} from "vue-property-decorator";
import {AppProvider} from "@/App.vue";
import UserInfo from "@/domain/UserInfo";
import MessageService from "@/service/MessageService";
library.add(faBars)

declare interface Menu{
  title: string,
  route: string,
  children?: Menu[],
  visible: boolean
}

@Component({
  props: ['profile'],
  inject: ['app'],
  created(): void{
    this.app.addUserInfoChangeListener(this.onUserInfoChange)
    if(this.app.isLogged()){
      const userInfo = this.app.getLoggedUserInfo()
      if(userInfo.isBlogger || userInfo.isAdmin){
        this.netDiskFileMenu.visible = true
      }
      if(userInfo.isAdmin){
        this.adminMenu.visible = true
      }
      this.messageMenu.visible = true
      this.refreshUnreadMessageCount()
    }
  },
  beforeDestroy(): void{
    this.app.removeUserInfoChangeListener(this.onUserInfoChange)
  }
})
export default class NavMenu extends Vue{
  menuList: Menu[]
  app: AppProvider
  logo: any
  unreadMessageCount: number
  netDiskFileMenu: Menu
  messageMenu: Menu
  adminMenu: Menu;

  data(): any{
    this.netDiskFileMenu = {
      title: "网盘",
      route: "/net-disk-file/",
      visible: false
    };
    this.messageMenu = {
      title: "消息",
      route: "/message",
      visible: false
    };
    this.adminMenu = {
      title: "管理",
      route: "/admin/overview",
      visible: false
    };
    return {
      logo: require("@/assets/logo.png"),
      unreadMessageCount: 0,
      menuList: [
        {
          title: "首页",
          route: "/",
          visible: true
        },
        {
          title: "归档",
          route: "/archives",
          visible: true
        },
        this.messageMenu,
        this.adminMenu,
        this.netDiskFileMenu,
        {
          title: "表情",
          route: "/expression",
          visible: true
        },
        {
          title: "关于",
          route: "/about",
          visible: true
        }
      ]
    }
  }

  onUserInfoChange(userInfo: UserInfo): void{
    if(userInfo){
      this.netDiskFileMenu.visible = userInfo.isBlogger || userInfo.isAdmin
      this.adminMenu.visible = userInfo.isAdmin
      this.messageMenu.visible = true
    }else{
      this.netDiskFileMenu.visible = false
      this.messageMenu.visible = false
    }
  }

  /**
   * 刷新未读消息
   */
  async refreshUnreadMessageCount(): Promise<void>{
    const value = await MessageService.unreadCount();
    let total = 0;
    for (let k in value) total += value[k];
    this.unreadMessageCount = total;
  }

  /**
   * 切换菜单事件
   * @param index 下标
   */
  onSelectMenu(index: number): void{
    if(this.menuList[index] !== this.messageMenu && this.app.isLogged()){
      this.refreshUnreadMessageCount()
    }
  }
}
</script>
<style scoped lang="scss">
@import "src/style/mixin-common";
@import "src/style/var-device-width";
@import "src/style/var-layout";

$nav-padding-horizontal: 1em;
#nav{
  height: $nav-height;
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: $nav-padding-horizontal;
  padding-right: $nav-padding-horizontal;
  @include background-nav;
  .el-menu{
    border-bottom: none;
  }
}

@media (max-width: $device-width-md) {
  #nav-title{
    font-size: 1.5em;
  }
}
</style>
