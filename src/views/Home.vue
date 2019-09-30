<template>
  <div>
    首页{{dateTime}}
    <vDatePicker v-model="dateTime" @on-change="onChange" type="datetimerange" placeholder="Select date and time" style="width: 300px"></vDatePicker>
  </div>
</template>

<script>
import vDatePicker from '_c/v-date-picker'
export default {
  components: {
    vDatePicker
  },
  data () {
    return {
      dateTime: [new Date('2019-09-01 08:30:30'), new Date('2019-09-02 01:30:40')]
    }
  },
  methods: {
    onChange (val) {
      this.dateTime = val
    }
  }
}
</script>

<style lang="less" scoped>

</style>
