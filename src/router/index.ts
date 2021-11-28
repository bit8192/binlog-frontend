import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import CommonService from "@/service/CommonService";
import ArchiveView from "@/views/ArchiveView.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/test',
    name: "Test",
    meta: {title: "测试"},
    component: ()=>import('../views/Test.vue')
  },
  {
    path: '/',
    name: 'Home',
    meta: {title: "首页"},
    component: Home
  },
  {
    path: '/archives',
    name: 'Archives',
    meta: {title: "归档"},
    component: ArchiveView
  },
  {
    path: '/about',
    name: 'About',
      meta: {title: "关于"},
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/article/:id",
    name: "Article",
    meta: {title: "文章"},
    component: () => import('../views/ArticleView.vue')
  },
  {
    path: "/article/edit/:id",
    name: "ArticleEdit",
    meta: {title: "编辑文章"},
    component: () => import('../views/ArticleEditView.vue')
  },
  {
    path: "/draft",
    name: "DraftList",
    meta: {title: "草稿列表"},
    component: () => import('../views/DraftList.vue')
  },
  {
    path: "/draft/:id",
    name: "Draft",
    meta: {title: "草稿"},
    component: () => import('../views/Draft.vue')
  },
  {
    path: "/music",
    name: "Music",
    meta: {title: "音乐"},
    component: () => import('../views/Music.vue')
  },
  {
    path: "/tools",
    name: "Tools",
    meta: {title: "工具"},
    component: () => import('../views/Tools.vue')
  },
  {
    path: "/user/change-head-image",
    name: "ChangeHeadImage",
    meta: {title: "修改头像"},
    component: () => import('../views/UserChangeHeadImageView.vue')
  },
  {
    path: "/net-disk-file/*",
    name: "NetDiskFile",
    meta: {title: "网盘"},
    component: () => import('../views/NetDiskFileView.vue')
  },
  {
    path: "/message",
    name: "Message",
    meta: {title: "消息"},
    component: () => import('../views/MessageView.vue')
  },
  {
    path: "/expression",
    name: "Expression",
    meta: {title: "表情"},
    component: () => import('../views/Expression.vue')
  },
  {
    path: "/admin",
    name: "Admin",
    meta: {title: "管理"},
    component: () => import('../views/admin/AdminIndex.vue'),
    children: [
      {
        path: "overview",
        meta: {title: "概览"},
        component: () => import('../views/admin/Overview.vue')
      },
      {
        path: "request-log",
        meta: {title: "请求日志"},
        component: () => import('../views/admin/RequestLogView.vue')
      },
      {
        path: "user-management",
        meta: {title: "用户管理"},
        component: () => import('../views/admin/UserManagement.vue')
      },
      {
        path: "system-setting",
        meta: {title: "系统设置"},
        component: () => import('../views/admin/SystemSetting.vue')
      }
    ]
  },
  {
    path: "*",
    name: "404",
    meta: {title: "404"},
    component: () => import('../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 * 修改标题
 */
router.afterEach(async to => {
  if(to.meta.title && document){
    document.title = to.meta.title
    try {
      const systemProfile = await CommonService.getSystemProfile()
      document.title = systemProfile.name + "|" + to.meta.title
    }catch (e) {
      //ignore
    }
  }
})

export default router
