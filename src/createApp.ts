import Binlog from './App.vue'
import router from './router'
import configAxios from "@/config/config-axios"
import './style/index.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'nprogress/nprogress.css'
import configNProgress from "@/config/config-nprogress";
import {Router} from "vue-router";
import {Store} from "vuex";
import createStore, {BinlogStore} from './createStore'
import DateUtils from "@/utils/DateUtils";
import {createApp as createVueApp, App} from "vue";

export default function createApp(): {app: App, router: Router, store: Store<BinlogStore>}{
    //配置Vuex
    const store = createStore();

    const app = createVueApp(Binlog);

    //配置路由
    app.use(router);

    //配置Vuex
    app.use(store);

    app.component('font-awesome-icon', FontAwesomeIcon);

    //配置NProgress
    configNProgress();

    //配置ElementUI
    app.use(ElementPlus);

    //全局工具
    app.config.globalProperties.DateUtils = DateUtils;

    //axios配置
    configAxios({});

    return {app, router, store};
}
