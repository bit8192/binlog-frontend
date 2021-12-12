import Vue from 'vue'
import App from './App.vue'
import router from './router'
import configAxios from "@/config/config-axios"
import './style/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'nprogress/nprogress.css'
import configNProgress from "@/config/config-nprogress";
import VueRouter from "vue-router";
import {Store} from "vuex";
import createStore from './createStore'
import DateUtils from "@/utils/DateUtils";

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

//配置NProgress
configNProgress()

//配置ElementUI
Vue.use(ElementUI)
//全局工具
Vue.prototype.DateUtils = DateUtils;

//配置Vuex
const store = createStore()

//系统配置
configAxios({})

export default function createApp(): {app: Vue, router: VueRouter, store: Store<any>}{
    const app = new Vue({
        router,
        render: h => h(App),
        store
    });
    return {app, router, store}
}
