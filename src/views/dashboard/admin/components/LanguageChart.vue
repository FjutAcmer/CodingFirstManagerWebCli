<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getLanguageCount } from '@/api/judge'

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
      tempData: null,
      languageData: [
        { name: '', value: '' },
        { name: '', value: '' },
        { name: '', value: '' },
        { name: '', value: '' },
        { name: '', value: '' }
      ]
    }
  },
  mounted() {
    this.getLanguageData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getLanguageData() {
      getLanguageCount().then(response => {
        const res = response.data
        this.tempData = res.datas[0]
        for (let i = 0; i < 5; i++) {
          this.languageData[i].name = this.tempData[i].languageName
          this.languageData[i].value = this.tempData[i].usedNum
        }
        console.log(this.languageData.name)
        this.$nextTick(() => {
          this.initChart()
        })
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.languageData.name
        },
        series: [
          {
            name: '热门语言Top5',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.languageData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
