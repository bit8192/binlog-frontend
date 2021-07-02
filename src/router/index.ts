import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import CommonService from "@/service/CommonService";

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
    path: '/about',
    name: 'About',
      meta: {title: "关于"},
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/article/article-class",
    name: "ArticleClass",
    meta: {title: "分类列表"},
    component: () => import('../views/ArticleClassListView.vue')
  },
  {
    path: "/article/article-class/:id",
    name: "ArticleListByClass",
    meta: {title: "分类"},
    component: () => import('../views/ArticlePageByClassView.vue')
  },
  {
    path: "/article/tags",
    name: "TagList",
    meta: {title: "标签列表"},
    component: () => import('../views/TagListView.vue')
  },
  {
    path: "/article/tags/:id",
    name: "ArticleListByTag",
    meta: {title: "标签"},
    component: () => import('../views/ArticlePageByTagView.vue')
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
    try {
      const systemProfile = await CommonService.getSystemProfile()
      document.title = systemProfile.name + "|" + to.meta.title
    }catch (e) {
      //ignore
    }
  }
  next()
})

export default router
