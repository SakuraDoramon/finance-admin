<template>
  <div style="padding: 12px;">
    首页{{dateTime}}
    <vDatePicker v-model="dateTime" @on-change="onChange" type="datetimerange" placeholder="Select date and time" style="width: 300px"></vDatePicker>
    <br />
    <!-- <Spin fix v-show="spindLoading"></Spin>
    <div style="margin-top: 20px">
      <vxe-table
        highlight-hover-row
        ref="xTable"
        height="300"
        @select-all="doSelectAll"
        @select-change="onSelectChange">
        <vxe-table-column type="selection" width="60"></vxe-table-column>
        <vxe-table-column :field="item.key" :title="item.title" v-for="item in tableColumns" :key="item.key"></vxe-table-column>
        <vxe-table-column title="操作" fixed="right" width="240">
          <template>
            <Button type="primary" size="small">按钮1</Button>
            <Button size="small">按钮2</Button>
          </template>
        </vxe-table-column>
      </vxe-table>
      <table-auto border :height="600" :columns="tableColumns" :data="tableData"></table-auto>
    </div> -->
  </div>
</template>

<script>
import vDatePicker from '_c/v-date-picker'
// import tableAuto from '_c/tableAuto'
export default {
  components: {
    vDatePicker
    // tableAuto
  },
  data () {
    return {
      spindLoading: true,
      dateTime: [new Date('2019-09-01 08:30:30'), new Date('2019-09-12 01:30:40')],
      tableColumns: [
        {
          'title': '科目编码',
          'key': 'code',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '科目名称',
          'key': 'name',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '会计要素',
          'key': 'accountElementItemName',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '科目类别',
          'key': 'subjectCategoryName',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '余额方向',
          'key': 'balanceDirection',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '分类名称',
          'key': 'accountCategory',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '辅助核算名称',
          'key': 'auxiliaryNames',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '现金流量项目预设',
          'key': 'cashFlowNames',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '创建公司名称',
          'key': 'companyName',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '使用公司名称',
          'key': 'useCompanyName',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '内部往来',
          'key': 'isInterior',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '系统预置',
          'key': 'isInit',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '数据状态',
          'key': 'isEnable',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '创建人',
          'key': 'creatorName',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '创建时间',
          'key': 'createTime',
          'className': 'primary',
          'tooltip': true
        },
        {
          'title': '修改人',
          'key': 'updatorName',
          'className': 'primary',
          'tooltip': true
        },

        {
          'title': '禁用时间',
          'key': 'disabledTime',
          'className': 'primary',
          'tooltip': true
        }
      ],
      tableData: []
    }
  },
  methods: {
    doSelectAll (val) {
      console.log(val, 'lllllll')
    },
    onSelectChange (val) {
      console.log(val, '22222222')
    },
    onChange (val) {
      this.dateTime = val
    },
    doGetData () {
      let req = { // 解决bug 解决bug 12387 会计要素筛选条件不起作用
        baseSubjectId: 1, // 基准表ID
        codeOrName: '',
        // companyId: this.companyId,
        isEnterpriseAdmin: 0,
        page: {
          current: 1,
          size: 1000
        }
      }
      this.spindLoading = true
      this.$request.post('/financeback/accountSubject/findPage', req).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.$nextTick(() => {
            this.$refs.xTable.reloadData(this.tableData)
          })
          this.spindLoading = false
        }
      })
    }
  },
  created () {
    // this.doGetData()
  }
}
</script>

<style lang="less" scoped>

</style>
