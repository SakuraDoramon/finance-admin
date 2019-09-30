import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import router from './router'
import store from './store'
import config from './config'
import { request } from './api'
import dayjs from 'dayjs'
import * as filters from '@/libs/filters'
import './assets/css/index.less'
import './index.less'

Vue.use(iView)

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false

/**
 * @description 全局注册请求变量
 */
Vue.prototype.$request = request

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * @description 全局注册dayjs
 */
Vue.prototype.$dayjs = dayjs

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
