<template>
  <div class="user-avator-dropdown">
    <Avatar :src="userAvator" v-if="userAvator"/>
    <Avatar icon="ios-person" v-else/>
    {{ userName }}
  </div>
</template>

<script>
import './user.less'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    }
  },
  methods: {
  }
}
</script>
