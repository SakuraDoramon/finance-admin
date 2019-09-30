<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <common-icon :type="parentItem.icon || ''"/>
      <Badge dot v-if="parentItem.meta.title === '结算管理' && backlog.workitem_num !== 0"><span>{{ showTitle(parentItem) }}</span></Badge>
      <span v-else>{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
          <common-icon :type="item.children[0].icon || ''"/>
          <template v-if="item.meta.title === '支付申请' || item.meta.title === '支付审核' || item.meta.title === '支付结算'">
            <Badge :offset="[0, -14]" :count="backlog.apply_num" v-if="item.meta.title === '支付申请'"><span>{{ showTitle(item.children[0]) }}</span></Badge>
            <Badge :offset="[0, -14]" :count="backlog.review_num" v-if="item.meta.title === '支付审核'"><span>{{ showTitle(item.children[0]) }}</span></Badge>
            <Badge :offset="[0, -14]" :count="backlog.settle_num" v-if="item.meta.title === '支付结算'"><span>{{ showTitle(item.children[0]) }}</span></Badge>
          </template>
          <span v-else>{{ showTitle(item.children[0]) }}</span>
        </menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
          <common-icon :type="item.icon || ''"/>
          <template v-if="item.meta.title === '支付申请' || item.meta.title === '支付审核' || item.meta.title === '支付结算'">
            <Badge :offset="[0, -14]" :count="backlog.apply_num" v-if="item.meta.title === '支付申请'"><span>{{ showTitle(item) }}</span></Badge>
            <Badge :offset="[0, -14]" :count="backlog.review_num" v-if="item.meta.title === '支付审核'"><span>{{ showTitle(item) }}</span></Badge>
            <Badge :offset="[0, -14]" :count="backlog.settle_num" v-if="item.meta.title === '支付结算'"><span>{{ showTitle(item) }}</span></Badge>
          </template>
          <span v-else>{{ showTitle(item) }}</span>
        </menu-item>
      </template>
    </template>
  </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
import { mapState } from 'vuex'
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ],
  computed: {
    ...mapState({
      backlog: state => state.app.backlog
    })
  }
}
</script>
