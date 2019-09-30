import Main from '_c/main'
/**
 * routes 不受权限约束的路由
 * routerMap 受权限约束的路由
 * hideInMenu 控制不在菜单栏显示的路由，不受权限约束的子路由，如：增删改查等
 * 路由name设置与统一门户权限设置的字段对应（用于控制页面级别权限）
 */
export const routesMap = [
  {
    path: '/organization',
    name: 'organization',
    meta: {
      icon: 'md-git-network',
      title: '组织机构'
    },
    component: Main,
    children: [
      {
        path: 'company',
        name: 'organization_company',
        meta: {
          title: '公司'
        },
        component: () => import('_v/organization/company.vue')
      },
      {
        path: 'element',
        name: 'organization_element',
        meta: {
          title: '业务单元'
        },
        component: () => import('_v/organization/element.vue')
      },
      {
        path: 'element',
        name: 'organization_set',
        meta: {
          title: '业财组织设置'
        },
        component: () => import('_v/organization/set.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-help-buoy',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'auth',
        name: 'system_auth',
        meta: {
          title: '岗位权限'
        },
        component: () => import('_v/system/auth.vue')
      },
      {
        path: 'post_user',
        name: 'system_post_user',
        meta: {
          title: '岗位用户'
        },
        component: () => import('_v/system/post-user.vue')
      },
      {
        path: 'company_user',
        name: 'system_company_user',
        meta: {
          title: '公司用户'
        },
        component: () => import('_v/system/company-user.vue')
      },
      {
        path: 'report',
        name: 'system_report',
        meta: {
          title: '用户权限报表'
        },
        component: () => import('_v/system/report.vue')
      },
      {
        path: 'information',
        name: 'system_information',
        meta: {
          title: '基础资料策略'
        },
        component: () => import('_v/system/information.vue')
      },
      {
        path: 'rules',
        name: 'system_rules',
        meta: {
          title: '编码规则'
        },
        component: () => import('_v/system/rules.vue')
      },
      {
        path: 'log',
        name: 'system_log',
        meta: {
          title: '日志管理'
        },
        component: () => import('_v/system/log.vue')
      }
    ]
  }
]

export const routes = [
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: '_menu_icon_'
      },
      component: () => import('_v/home')
    }]
  },
  {
    path: '/organization',
    name: 'organization',
    meta: {
      icon: 'md-git-network',
      title: '组织机构'
    },
    component: Main,
    children: [
      {
        path: 'company',
        name: 'organization_company',
        meta: {
          title: '公司'
        },
        component: () => import('_v/organization/company.vue')
      },
      {
        path: 'element',
        name: 'organization_element',
        meta: {
          title: '业务单元'
        },
        component: () => import('_v/organization/element.vue')
      },
      {
        path: 'element',
        name: 'organization_set',
        meta: {
          title: '业财组织设置'
        },
        component: () => import('_v/organization/set.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-help-buoy',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'auth',
        name: 'system_auth',
        meta: {
          title: '岗位权限'
        },
        component: () => import('_v/system/auth.vue')
      },
      {
        path: 'post_user',
        name: 'system_post_user',
        meta: {
          title: '岗位用户'
        },
        component: () => import('_v/system/post-user.vue')
      },
      {
        path: 'company_user',
        name: 'system_company_user',
        meta: {
          title: '公司用户'
        },
        component: () => import('_v/system/company-user.vue')
      },
      {
        path: 'report',
        name: 'system_report',
        meta: {
          title: '用户权限报表'
        },
        component: () => import('_v/system/report.vue')
      },
      {
        path: 'information',
        name: 'system_information',
        meta: {
          title: '基础资料策略'
        },
        component: () => import('_v/system/information.vue')
      },
      {
        path: 'rules',
        name: 'system_rules',
        meta: {
          title: '编码规则'
        },
        component: () => import('_v/system/rules.vue')
      },
      {
        path: 'log',
        name: 'system_log',
        meta: {
          title: '日志管理'
        },
        component: () => import('_v/system/log.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('_v/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('_v/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('_v/error-page/404.vue')
  }
]
