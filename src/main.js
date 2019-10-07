import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import router from './router'
import store from './store'
import config from './config'
import { request } from './api'
import dayjs from 'dayjs'
import * as filters from '@/libs/filters'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import './assets/css/index.less'
import './index.less'

VXETable.setup({
  // 默认表格参数
  size: 'mini',
  showOverflow: true,
  showHeaderOverflow: true,
  align: null,
  headerAlign: null,
  stripe: false,
  border: false,
  resizable: true,
  fit: true,
  showHeader: true,
  highlightCurrentRow: true,
  highlightHoverRow: true,
  highlightCurrentColumn: false,
  highlightHoverColumn: false,
  rowId: '_XID',
  sortConfig: {
    trigger: 'default'
  },
  validConfig: {
    message: 'default'
  },
  // 版本号（对于某些带 Storage 数据储存的功能有用到，上升版本号可以用于重置 Storage 数据）
  version: 0,
  // 配置式表格的默认参数
  grid: {
    proxyConfig: {
      autoLoad: true,
      message: true,
      props: {
        list: null,
        result: 'result',
        total: 'page.total'
      }
    }
  },
  // 默认快捷菜单
  menu: {},
  // 默认 tooltip 主题样式
  tooltip: {
    trigger: 'hover',
    theme: 'dark'
  },
  // 默认分页参数
  pager: {
    pageSize: 10,
    pagerCount: 7,
    pageSizes: [10, 15, 20, 50, 100],
    layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total'] // 非常灵活的分页布局，支持任意位置随意换
  },
  // 默认工具栏参数
  toolbar: {
    refresh: false,
    resizable: {
      storage: false
    },
    setting: {
      storage: false
    },
    buttons: []
  },
  // 默认模态窗口参数
  modal: {
    zIndex: 2000,
    minWidth: 340,
    minHeight: 200,
    lockView: true,
    lockScroll: true,
    mask: true,
    duration: 3000,
    animat: true
  },
  // 默认优化配置项
  optimization: {
    animat: true,
    delayHover: 250,
    scrollX: {
      gt: 100
    },
    scrollY: {
      gt: 500
    }
  }
})

Vue.use(VXETable)

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
