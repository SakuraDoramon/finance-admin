import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes'
import config from '@/config'
// import store from '@/store'
import iView from 'iview'

const { title } = config

Vue.use(Router)

const router = new Router({
  routes,
  mode: 'history',
  base: '/dist/'
})

router.beforeEach((to, from, next) => {
  // document.title = to.meta.title ? `财务后台管理系统-${to.meta.title}` : '财务后台管理系统-首页'
  document.title = title
  iView.LoadingBar.start()
  next()
  // if (store.state.user.hasGetInfo) {
  //   // 如果已经获取用户信息
  //   next()
  // } else {
  //   // 没有获取用户信息
  //   store.dispatch('getUserInfo').then(routes => {
  //     router.addRoutes(routes)
  //     next({ ...to,
  //       replace: true
  //     })
  //   })
  // }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
