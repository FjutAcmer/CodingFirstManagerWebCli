<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts主题风格
import resize from './mixins/resize'
import { getContestTypeCount } from '@/api/contest'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      contestType: [],
      contestTypeCount: [],
      tempData: ''
    }
  },
  mounted() {
    this.getContestTypeData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getContestTypeData() {
      getContestTypeCount().then(response => {
        const res = response.data
        this.tempData = res.datas[0]
        for (let i = 0; i < this.tempData.length; i++) {
          this.contestType.push(this.tempData[i].contestTypeName)
          this.contestTypeCount.push(this.tempData[i].count)
        }
        this.$nextTick(() => {
          this.initChart()
        })
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.contestType,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '比赛总数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.contestTypeCount,
          animationDuration
        }]
      })
    }
  }
}
</script>
