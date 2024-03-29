<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="styles">
        <colgroup>
            <col v-for="(column, index) in columns" :width="setCellWidth(column)">
            <col v-if="$parent.showVerticalScrollBar" :width="$parent.scrollBarWidth"/>
        </colgroup>
        <thead>
            <tr v-for="(cols, rowIndex) in headRows">
                <th
                    v-for="(column, index) in cols"
                    :colspan="column.colSpan"
                    :rowspan="column.rowSpan"
                    :class="alignCls(column)"
                    @mouseup="handleMouseUp"
                    @mousemove="handleMouseMove($event, column)"
                    @mouseout="handleMouseOut"
                    @mousedown="handleMouseDown($event, column)">
                    <div :class="cellClasses(column)">
                        <template v-if="column.type === 'expand'">
                            <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                        </template>
                        <!-- indeterminate 解决表格半选状态 -->
                        <template v-else-if="column.type === 'selection'"><Checkbox :value="isSelectAll" :indeterminate="(Object.values(objData).findIndex(n => n._isChecked) > -1) && !isSelectAll" :disabled="!data.length" @on-change="selectAll"></Checkbox></template>
                        <template v-else>
                            <span v-if="!column.renderHeader" :class="{[prefixCls + '-cell-sort']: column.sortable}" @click="handleSortByHead(getColumn(rowIndex, index)._index)">{{ column.title || '#' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                            <span :class="[prefixCls + '-sort']" v-if="column.sortable">
                                <i class="ivu-icon ivu-icon-arrow-up-b" :class="{on: getColumn(rowIndex, index)._sortType === 'asc'}" @click="handleSort(getColumn(rowIndex, index)._index, 'asc')"></i>
                                <i class="ivu-icon ivu-icon-arrow-down-b" :class="{on: getColumn(rowIndex, index)._sortType === 'desc'}" @click="handleSort(getColumn(rowIndex, index)._index, 'desc')"></i>
                            </span>
                            <Poptip
                                v-if="isPopperShow(column)"
                                v-model="getColumn(rowIndex, index)._filterVisible"
                                placement="bottom"
                                popper-class="ivu-table-popper"
                                transfer
                                @on-popper-hide="handleFilterHide(getColumn(rowIndex, index)._index)">
                                <span :class="[prefixCls + '-filter']">
                                    <i class="ivu-icon ivu-icon-funnel" :class="{on: getColumn(rowIndex, index)._isFiltered}"></i>
                                </span>

                                <div slot="content" :class="[prefixCls + '-filter-list']" v-if="getColumn(rowIndex, index)._filterMultiple">
                                    <div :class="[prefixCls + '-filter-list-item']">

                                        <checkbox-group v-model="getColumn(rowIndex, index)._filterChecked">
                                            <checkbox v-for="(item, index) in column.filters" :key="index" :label="item.value">{{ item.label }}</checkbox>
                                        </checkbox-group>
                                    </div>
                                    <div :class="[prefixCls + '-filter-footer']">
                                        <i-button type="text" size="small" :disabled="!getColumn(rowIndex, index)._filterChecked.length" @click.native="handleFilter(getColumn(rowIndex, index)._index)">{{ t('i.table.confirmFilter') }}</i-button>
                                        <i-button type="text" size="small" @click.native="handleReset(getColumn(rowIndex, index)._index)">{{ t('i.table.resetFilter') }}</i-button>
                                    </div>
                                </div>
                                <div slot="content" :class="[prefixCls + '-filter-list']" v-else>
                                    <ul :class="[prefixCls + '-filter-list-single']">
                                        <li
                                            :class="itemAllClasses(getColumn(rowIndex, index))"
                                            @click="handleReset(getColumn(rowIndex, index)._index)">{{ t('i.table.clearFilter') }}</li>
                                        <li
                                            :class="itemClasses(getColumn(rowIndex, index), item)"
                                            v-for="item in column.filters"
                                            @click="handleSelect(getColumn(rowIndex, index)._index, item.value)">{{ item.label }}</li>
                                    </ul>
                                </div>
                            </Poptip>
                        </template>
                    </div>
                </th>

                <th v-if="$parent.showVerticalScrollBar && rowIndex===0 && headRows.length > 1" :class='scrollBarCellClass()' :rowspan="headRows.length"></th>
            </tr>
        </thead>
    </table>
</template>
<script>
    import renderHeader from './header';
    import Mixin from './mixin';
    import { hasClass, addClass, removeClass } from './tools';

    export default {
        name: 'TableHead',
        mixins: [ Mixin ],
        components: { renderHeader },
        data () {
          return {
            draggingColumn: null,
            dragging: false,
            dragState: {}
          }
        },
        props: {
            prefixCls: String,
            styleObject: Object,
            columns: Array,
            objData: Object,
            data: Array,    // rebuildData
            columnsWidth: Object,
            fixed: {
                type: [Boolean, String],
                default: false
            },
            border: Boolean,
            columnRows: Array,
            fixedColumnRows: Array
        },
        computed: {
            styles () {
                const style = Object.assign({}, this.styleObject);
                const width = parseInt(this.styleObject.width) ;
                style.width = `${width}px`;
                return style;
            },
            isSelectAll () {
                let isSelectAll = true;
                if (!this.data.length) isSelectAll = false;
                if (!this.data.find(item => !item._disabled)) isSelectAll = false;    // #1751
                for (let i = 0; i < this.data.length; i++) {
                    if (!this.objData[this.data[i]._index]._isChecked && !this.objData[this.data[i]._index]._isDisabled) {
                        isSelectAll = false;
                        break;
                    }
                }

                return isSelectAll;
            },
            headRows () {
                const isGroup = this.columnRows.length > 1;
                if (isGroup) {
                    return this.fixed ? this.fixedColumnRows : this.columnRows;
                } else {
                    return [this.columns];
                }
            }
        },
        methods: {
          doTableFixedStyle() {
            let _tableFixedLeft = document.querySelector('.ivu-table-fixed-right')
            let _tableOverflowX = document.querySelector('.ivu-table-overflowX')
            if (_tableOverflowX) {
              if (_tableFixedLeft !== null) {
                _tableFixedLeft.style.boxShadow = '-2px 0 6px -2px rgba(0, 0, 0, 0.2)'
              }
            } else {
              if (_tableFixedLeft !== null) {
                _tableFixedLeft.style.boxShadow = '0px 0 0px 0px rgba(255, 255, 255, 0)'
              }
            }
          },
          handleMouseUp () {
            setTimeout(() => {
              this.doTableFixedStyle()
            }, 100)
          },
            handleMouseDown (event, column) {
              if (this.$isServer) return
              // 解决操作列不支持自适应列宽
              if (this.headRows[0].findIndex(n => n.key === 'action') > -1) {
                if (this.headRows[0].findIndex(n => n.key === column.key) === (this.headRows[0].length - 2)) return
              }
              if (column.children && column.children.length > 0) return

              /* istanbul ignore if */
              if (this.draggingColumn && this.border) {
                this.dragging = true

                this.$parent.resizeProxyVisible = true

                const table = this.$parent
                const tableEl = table.$el
                const tableLeft = tableEl.getBoundingClientRect().left
                const columnEl = this.$el.querySelector(`th.${column.key}`)
                const columnRect = columnEl.getBoundingClientRect()
                const minLeft = columnRect.left - tableLeft + 30

                addClass(columnEl, 'noclick')

                this.dragState = {
                  startMouseLeft: event.clientX,
                  startLeft: columnRect.right - tableLeft,
                  startColumnLeft: columnRect.left - tableLeft,
                  tableLeft
                };

                const resizeProxy = table.$refs.resizeProxy
                resizeProxy.style.left = this.dragState.startLeft + 'px'

                document.onselectstart = function() { return false; }
                document.ondragstart = function() { return false; }

                const handleMouseMove = (event) => {
                  const deltaLeft = event.clientX - this.dragState.startMouseLeft
                  const proxyLeft = this.dragState.startLeft + deltaLeft
                  resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px'
                  this.$emit('on-update-size', column, resizeProxy.style.left)
                }

                const handleMouseUp = () => {
                  if (this.dragging) {
                    const {
                      startColumnLeft,
                      startLeft
                    } = this.dragState
                    const finalLeft = parseInt(resizeProxy.style.left, 10)
                    const columnWidth = finalLeft - startColumnLeft
                    column.width = column.realWidth = columnWidth
                    table.$emit('header-dragend', column.width, startLeft - startColumnLeft, column, event)

                    this.$parent.debouncedUpdateLayout()
                    document.body.style.cursor = ''
                    this.dragging = false
                    this.draggingColumn = null
                    this.dragState = {}

                    table.resizeProxyVisible = false
                  }

                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                  document.onselectstart = null
                  document.ondragstart = null

                  setTimeout(function() {
                    removeClass(columnEl, 'noclick')
                  }, 0)
                }

                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }
            },
            handleMouseMove (event, column) {
              this.doTableFixedStyle()
              // 解决操作列不支持自适应列宽
              if (this.headRows[0].findIndex(n => n.key === 'action') > -1) {
                if (this.headRows[0].findIndex(n => n.key === column.key) === (this.headRows[0].length - 2)) return
              }
              if (column.children && column.children.length > 0) return
              let target = event.target
              while (target && target.tagName !== 'TH') {
                target = target.parentNode
              }
              if (!column || !column.resizable) return
              if (!this.dragging && this.border) {
                let rect = target.getBoundingClientRect()

                const bodyStyle = document.body.style
                if (rect.width > 12 && rect.right - event.pageX < 8) {
                  bodyStyle.cursor = 'col-resize'
                  if (hasClass(target, 'is-sortable')) {
                    target.style.cursor = 'col-resize'
                  }
                  this.draggingColumn = column
                } else if (!this.dragging) {
                  bodyStyle.cursor = ''
                  if (hasClass(target, 'is-sortable')) {
                    target.style.cursor = 'pointer'
                  }
                  this.draggingColumn = null
                }
              }
            },
            handleMouseOut () {
              if (this.$isServer) return
              document.body.style.cursor = ''
            },
            cellClasses (column) {
                return [
                    `${this.prefixCls}-cell`,
                    {
                        [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right')
                    }
                ];
            },
            scrollBarCellClass(){
                let hasRightFixed = false;
                for(let i in this.headRows){
                    for(let j in this.headRows[i]){
                        if(this.headRows[i][j].fixed === 'right') {
                            hasRightFixed=true;
                            break;
                        }
                        if(hasRightFixed) break;
                    }
                }
                return [
                    {
                        [`${this.prefixCls}-hidden`]: hasRightFixed
                    }
                ];
            },
            itemClasses (column, item) {
                return [
                    `${this.prefixCls}-filter-select-item`,
                    {
                        [`${this.prefixCls}-filter-select-item-selected`]: column._filterChecked[0] === item.value
                    }
                ];
            },
            itemAllClasses (column) {
                return [
                    `${this.prefixCls}-filter-select-item`,
                    {
                        [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length
                    }
                ];
            },
            selectAll () {
                const status = !this.isSelectAll;
                this.$parent.selectAll(status);
            },
            handleSort (index, type) {
                const column = this.columns[index];
                const _index = column._index;

                if (column._sortType === type) {
                    type = 'normal';
                }
                this.$parent.handleSort(_index, type);
            },
            handleSortByHead (index) {
                const column = this.columns[index];
                if (column.sortable) {
                    const type = column._sortType;
                    if (type === 'normal') {
                        this.handleSort(index, 'asc');
                    } else if (type === 'asc') {
                        this.handleSort(index, 'desc');
                    } else {
                        this.handleSort(index, 'normal');
                    }
                }
            },
            handleFilter (index) {
                this.$parent.handleFilter(index);
            },
            handleSelect (index, value) {
                this.$parent.handleFilterSelect(index, value);
            },
            handleReset (index) {
                this.$parent.handleFilterReset(index);
            },
            handleFilterHide (index) {
                this.$parent.handleFilterHide(index);
            },
            // 因为表头嵌套不是深拷贝，所以没有 _ 开头的方法，在 isGroup 下用此列
            getColumn (rowIndex, index) {
                const isGroup = this.columnRows.length > 1;

                if (isGroup) {
                    const id = this.headRows[rowIndex][index].__id;
                    return this.columns.filter(item => item.__id === id)[0];
                } else {
                    return this.headRows[rowIndex][index];
                }
            }
        }
    };
</script>
