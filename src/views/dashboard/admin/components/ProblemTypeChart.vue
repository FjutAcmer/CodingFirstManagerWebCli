<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getSubmitTypeCount } from '@/api/problems'

const animationDuration = 3000

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
      typeData: [
        { name: '', max: 1300 },
        { name: '', max: 1300 },
        { name: '', max: 1300 },
        { name: '', max: 1300 },
        { name: '', max: 1300 },
        { name: '', max: 1300 }
      ],
      userTypeNum: [],
      problemTypeNum: [],
      submitTemp: '',
      typeTemp: ''
    }
  },
  mounted() {
    this.getProblemType()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getProblemType() {
      getSubmitTypeCount().then(response => {
        const res = response.data
        this.submitTemp = res.datas[0]
        this.typeTemp = res.datas[1]
        for (let i = 0; i < 6; i++) {
          this.typeData[i].name = this.submitTemp[i].problemTypeName
          this.userTypeNum.push(this.submitTemp[i].count)
          this.problemTypeNum.push(this.typeTemp[i].totalCount)
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
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: this.typeData
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['用户热门题型']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: this.userTypeNum,
              name: '用户热门题型'
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
