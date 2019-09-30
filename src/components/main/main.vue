<template>
  <Layout style="height: 100%" class="main">
    <Sider  hide-trigger collapsible :width="200" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <div class="logo-con-title">
            <img v-show="!collapsed" :src="maxLogo" class="max-logo" />
            <p class="title">餐立方·财务后台系统</p>
          </div>
          <img v-show="collapsed" :src="minLogo" class="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <div class="header-icon-set" @click="toSetting"><common-icon type="md-power" :size="16" color="#535353"/></div>
          <user :user-avator="userAvator" :user-name="userName"/>
          <div class="header-icon-notice">
            <Badge :count="12" :offset="[16, 15]" class-name="header-badge">
              <common-icon type="md-notifications" :size="16" color="#535353"/>
            </Badge>
            <common-icon type="md-help-circle" :size="16" color="#535353"/>
          </div>
          <p>{{ rootEnterpriseName }}</p>
        </header-bar>
      </Header>
      <Content class="main-content-con" >
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <div class="box-container">
              <router-view/>
              <!-- <keep-alive>
                <router-view/>
              </keep-alive> -->
            </div>
            <ABackTop :height="100" :bottom="40" :right="40" container=".box-container"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import CommonIcon from '_c/common-icon'
import { mapState, mapMutations } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    User,
    ABackTop,
    CommonIcon
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo
    }
  },
  computed: {
    ...mapState({
      routes: state => state.user.routes
    }),
    tagNavList () {
      return this.$store.state.user.tagNavList
    },
    tagRouter () {
      return this.$store.state.user.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    userName () {
      return this.$store.state.user.userName
    },
    userId () {
      return this.$store.state.user.userId
    },
    rootEnterpriseId () {
      return this.$store.state.user.rootEnterpriseId
    },
    rootEnterpriseName () {
      return this.$store.state.user.rootEnterpriseName
    },
    menuList () {
      return this.$store.getters.menuList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setHomeRoute'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    toSetting () {
      //
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      if (!meta.hideInBread) {
        this.addTag({
          route: { name, query, params, meta },
          type: 'push'
        })
      }
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(this.routes)
    this.addTag({
      route: this.$store.state.user.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   })
    // }
  }
}
</script>
