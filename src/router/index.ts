import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import CommonService from "@/service/CommonService";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    meta: {title: "首页"},
    component: Home
  },
  {
    path: '/about',
    name: 'About',
      meta: {title: "关于"},
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/article-list/:type",
    name: "ArticleList",
    meta: {title: "文章列表"},
    component: () => import('../views/ArticleListView.vue')
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
router.beforeEach(async (to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title
    const systemProfile = await CommonService.getSystemProfile()
    document.title = systemProfile.name + "|" + to.meta.title
  }
  next()
})

export default router
