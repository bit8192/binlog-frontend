<template>
  <div id="nav">
    <h1 style="flex: 1;">{{profile && profile.name || "Blog"}}</h1>
    <slot/>
    <el-menu mode="horizontal" router :default-active="$route.path" class="hidden-sm-and-down">
      <template v-for="item in menu">
        <el-menu-item v-if="!item.children || !item.children.length" :key="item.title" :index="item.route">{{item.title}}</el-menu-item>
        <el-submenu v-else :key="item.name" index="0">
          <template slot="title">{{item.title}}</template>
          <el-menu-item v-for="submenu in item.children" :key="submenu.title" :index="item.route">{{submenu.title}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
    <el-menu mode="horizontal" router :default-active="$route.path" class="hidden-md-and-up" menu-trigger="click">
      <el-submenu index="">
        <template slot="title"><font-awesome-icon :icon="['fas', 'bars']" size="lg"/></template>
        <template v-for="item in menu">
          <el-menu-item v-if="!item.children || !item.children.length" :key="item.title" :index="item.route">{{item.title}}</el-menu-item>
          <el-submenu v-else :key="item.name" index="0">
            <template slot="title">{{item.title}}</template>
            <el-menu-item v-for="submenu in item.children" :key="submenu.title" :index="item.route">{{submenu.title}}</el-menu-item>
          </el-submenu>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script lang="ts">
import NavMenuItem from "@/domain/NavMenuItem";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faBars} from "@fortawesome/free-solid-svg-icons";
library.add(faBars)

interface Data{
  menu: NavMenuItem[]
}
export default {
  name: "NavMenu",
  props: ['profile'],
  data(): Data{
    return {
      menu: [
        {
          id: 0,
          title: "首页",
          route: "/"
        },
        {
          id: 1,
          title: "笔记",
          visible: true,
          route: "/article-list/note"
        },
        {
          id: 6,
          title: "项目",
          visible: true,
          route: "/article-list/project"
        },
        {
          id: 7,
          title: "杂谈",
          visible: true,
          route: "/article-list/other"
        },
        {
          id: 9,
          title: "工具",
          visible: true,
          route: "/tools"
        },
        {
          id: 10,
          title: "草稿",
          visible: true,
          route: "/draft"
        },
        {
          id: 11,
          title: "音乐",
          visible: true,
          route: "/music"
        },
        {
          id: 12,
          title: "软件",
          visible: true,
          route: "/article-list/program"
        },
        {
          id: 13,
          title: "生活",
          visible: true,
          route: "/article-list/life"
        },
        {
          id: 14,
          title: "关于",
          visible: true,
          route: "/about"
        }
      ]
    }
  }
}
</script>
<style scoped lang="scss">
@import "src/style/common";

$nav-padding-horizontal: 1em;
#nav{
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
</style>
