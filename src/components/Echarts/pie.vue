<template>
<div ref="echarts" style="width: 48%;height: 350px;"></div>
</template>
<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'
import { debounce } from '@/utils'

export default {
    props: {
        opinion: {
            type: Array,
            default: []
        },
        opinionData: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        }
    },
    name: '',
    data() {
        return {
            charts: '',
        }
    },
    methods: {
        drawPie() {
            this.charts = echarts.init(this.$refs.echarts, 'macarons');
            // this.charts = echarts.init(document.getElementById(id), 'macarons')
            this.charts.off('click'); //饼图点击事件
            this.charts.on('click', event => {
                console.log("maa:", event)
                if (event.seriesType == 'pie') {
                    this.$emit('func', event.data)  //给父组件传值
                }
            })
            this.charts.setOption({
                title: {
                    text: this.title,
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} <br/> 数量: {c} 个，占比： {d}%'
                }, //自定义悬停内容
                legend: {
                    left: 'center',
                    bottom: '0',
                    data: this.opinion,
                }, //导航数据
                series: [
                    {
                        name: '标题',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.9)'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.opinionData
                    }
                ]
            })
        }
    },
    //调用
    mounted() {
        this.$nextTick(function () {
            setTimeout(this.drawPie('main'), 200);
        })
    },
    watch: {
        opinionData: {
            deep: true,
            handler(val) {
                console.log('监听', val)
                if (val) {
                    setTimeout(this.drawPie('main'), 200);
                }
            }
        }
    }
}
</script>
<style scoped>
* {

margin-top: 100px;
padding: 0;
list-style: none;
}
</style>
