<template>
  <div id="nav">
    <img :src="logo" alt="logo" height="50" />
    <h1 id="nav-title" style="flex: 1;">{{profile && profile.name || "Blog"}}</h1>
    <slot/>
    <el-menu mode="horizontal" router :default-active="$route.path" class="hidden-sm-and-down">
      <template v-for="item in menuList">
        <el-menu-item v-if="!item.children || !item.children.length" :key="item.title" :index="item.route">{{item.title}}</el-menu-item>
        <el-submenu v-else :key="item.route" index="0">
          <template slot="title">{{item.title}}</template>
          <el-menu-item v-for="submenu in item.children" :key="submenu.title" :index="item.route">{{submenu.title}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
    <el-menu mode="horizontal" router :default-active="$route.path" class="hidden-md-and-up" menu-trigger="click">
      <el-submenu index="">
        <template slot="title"><font-awesome-icon :icon="['fas', 'bars']" size="lg"/></template>
        <template v-for="item in menuList">
          <el-menu-item v-if="!item.children || !item.children.length" :key="item.title" :index="item.route">{{item.title}}</el-menu-item>
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
library.add(faBars)

declare interface Menu{
  title: string,
  route: string,
  children?: Menu[]
}

@Component({
  props: ['profile'],
  inject: ['app'],
  created(): void{
    this.app.addUserInfoChangeListener(this.onUserInfoChange)
    if(this.app.isLogged() && this.app.getLoggedUserInfo().isBlogger){
      this.addNetDiskFileMenu()
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
  static netDiskFileMenu = {
    title: "网盘",
    route: "/net-disk-file/"
  } as Menu;

  data(): any{
    return {
      logo: require("@/assets/logo.png"),
      menuList: [
        {
          title: "首页",
          route: "/"
        },
        {
          title: "分类",
          route: "/article/article-class"
        },
        {
          title: "标签",
          route: "/article/tags"
        },
        {
          title: "关于",
          route: "/about"
        }
      ]
    }
  }

  onUserInfoChange(userInfo: UserInfo): void{
    const netDiskFileMenuIndex = this.menuList.findIndex(i=>i === NavMenu.netDiskFileMenu);
    if(userInfo && userInfo.isBlogger && netDiskFileMenuIndex !== -1){
      this.menuList.splice(netDiskFileMenuIndex, 1)
    }else{
      this.addNetDiskFileMenu()
    }
  }

  addNetDiskFileMenu(): void{
    this.insertMenu(NavMenu.netDiskFileMenu, 1)
  }

  insertMenu(menu: Menu, index: number): void{
    if(index < 1){
      this.menuList.unshift(menu)
    }else if(index >= this.menuList.length){
      this.menuList.push(menu)
    }else{
      const lastMenuArr = this.menuList.splice(index)
      this.menuList = this.menuList.splice(0, index).concat([menu], lastMenuArr)
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
