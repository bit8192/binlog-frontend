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

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

//配置NProgress
configNProgress()

//配置ElementUI
Vue.use(ElementUI)

//系统配置
configAxios({baseURL: "http://localhost:8080"})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

