<template>
    <div :class="[prefixCls + '-confirm']" @keydown.tab.capture="handleTab">
        <!-- <i-button :class="timeClasses" size="small" type="text" :disabled="timeDisabled" v-if="showTime" @click="handleToggleTime">
            {{labels.time}}
        </i-button> -->
        <i-button size="small" @click.native="handleClear" @keydown.enter.native="handleClear">
            {{labels.clear}}
        </i-button>
        &nbsp;
        <i-button size="small" type="primary" @click.native="handleSuccess" @keydown.enter.native="handleSuccess">
            {{labels.ok}}
        </i-button>
    </div>
</template>
<script>
    import Emitter from '../emitter';

    const prefixCls = 'ivu-picker';

    export default {
        mixins: [Emitter],
        props: {
            showTime: false,
            isTime: false,
            timeDisabled: false
        },
        data() {
            return {
                prefixCls: prefixCls
            };
        },
        computed: {
            timeClasses () {
                return  `${prefixCls}-confirm-time`;
            },
            labels(){
                const labels = ['time', 'clear', 'ok'];
                const values = [(this.isTime ? '选择日期' : '选择时间'), '清空', '确定'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = values[i];
                    return obj;
                }, {});
            }
        },
        methods: {
            handleClear () {
                this.$emit('on-pick-clear');
            },
            handleSuccess () {
                this.$emit('on-pick-success');
            },
            handleToggleTime () {
                if (this.timeDisabled) return;
                this.$emit('on-pick-toggle-time');
                this.dispatch('CalendarPicker', 'focus-input');
                this.dispatch('CalendarPicker', 'update-popper');
            },
            handleTab(e) {
                const tabbables = [...this.$el.children];
                const expectedFocus = tabbables[e.shiftKey ? 'shift' : 'pop']();

                if (document.activeElement === expectedFocus) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.dispatch('CalendarPicker', 'focus-input');
                }
            }
        }
    };
</script>
