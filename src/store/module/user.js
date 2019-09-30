import { request } from '@/api'
import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled
} from '@/libs/util'
import {
  session
} from '@/libs/location'
import beforeClose from '@/router/before-close'
import router from '@/router'
import { routes, routesMap } from '@/router/routes'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

// 定义方法过滤权限路由
const getAccessRouter = (routes, rules) => {
  return routes.filter(item => {
    if (rules[item.name]) {
      // 当有children路由的时候回调方法
      if (item.children) item.children = getAccessRouter(item.children, rules)
      return true
    } else {
      if (item.name === '_home' || item.name === 'home') {
        // 首页路由权限放开
        return true
      } else if (rules['approval_flow'] && (item.name === 'deploy_approval_flow' || item.name === 'create_approval_flow' || item.name === 'update_approval_flow' || item.name === 'copy_approval_flow')) {
        // 当权限有自定义审批，则编辑和创建审批，配置适用范围，复制审批也有权限
        return true
      } else if (rules['pay_apply'] && (item.name === 'create_apply' || item.name === 'update_apply')) {
        // 当权限有支付申请，则编辑和创建申请也有权限
        return true
      } else if (rules['bank_manage'] && (item.name === 'create_account' || item.name === 'update_account')) {
        // 当权限有账户管理，则创建账户也有权限
        return true
      } else if (rules['group_manage'] && (item.name === 'create_group' || item.name === 'update_group')) {
        // 当权限有分组管理，则创建、编辑分组，编辑账户也有权限
        return true
      } else {
        return false
      }
    }
  })
}

export default {
  state: {
    userName: '',
    userId: '',
    rootEnterpriseName: '',
    rootEnterpriseId: '',
    avatorImgPath: '',
    hasGetInfo: false,
    access: [],
    routes: routes,
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    backlog: {}
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(state.routes, state.access),
    uploadToken: (state) => {
      let token = session.parseJSON()
      return {
        'authorization-token': token === null ? '' : token,
        'Access-Control-Allow-Origin': '*'
      }
    }
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setRootEnterpriseId (state, id) {
      state.rootEnterpriseId = id
    },
    setRootEnterpriseName (state, name) {
      state.rootEnterpriseName = name
    },
    setUserName (state, name) {
      state.userName = name
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setAccessRoutes (state, routesList) {
      state.routes = routesList.concat(routes)
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    // 更改待办数量
    setBacklog (state, params) {
      state.backlog = params
    }
  },
  actions: {
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return request.get('/index/token/get').then(res => {
        const data = res.data.data
        // 保存后台返回的token
        session.setObject(data.token)
        commit('setAvator', data.avator)
        commit('setUserName', data.user_name)
        commit('setUserId', data.user_id)
        commit('setRootEnterpriseId', data.root_enterprise_id)
        commit('setRootEnterpriseName', data.root_enterprise_name)
        commit('setHasGetInfo', true)
        let _authList = data.actions.split(',') // 接口返回权限数组
        let _rules = {} // 传给过滤方法的对象
        let _routerList = [] // 过滤方法返回的权限路由列表
        // 接口传过来的所有权限页面为key值，属性值为true，为了getAccessRouter方法过滤
        _authList.forEach(n => {
          _rules[n] = true
        })

        if (data.actions.indexOf(',admin,') > -1) {
          // 当接口出现,admin,返回所有权限
          _routerList = routesMap
        } else {
          // 当接口返回的权限不是所有
          _routerList = getAccessRouter(routesMap, _rules)
        }
        commit('setAccessRoutes', _routerList)
        return state.routes
      })
    },
    // 获取待办数量
    getBocklog ({ state, commit }) {
      request.get('/index/todo/count').then(res => {
        const resData = res.data
        commit('setBacklog', resData)
      })
    }
  }
}
