<template>
  <div class="app-container">
    <div class="aside">
      <span>欢迎您，管理员 {{ username }} ！</span>
    </div>
    <el-card>
      <div slot="header">快捷菜单</div>
      <el-button type="primary" plain @click="toGetProblems()">爬取题目</el-button>
      <el-button type="warning" plain @click="toSimProblem()">相似度检测</el-button>
      <el-button type="success" plain @click="toProblemLocalized()">题目本地化</el-button>
    </el-card>
    <el-card>
      <div id="echart-1" />
    </el-card>
  </div>
</template>

<script>
import store from '@/store'
import echarts from 'echarts'
import { getSpiderJobCountDay } from '@/api/spider'
import formatDate from '@/utils/formatterDate'
export default {
  data() {
    return {
      username: store.getters.name,
      chart: '',
      query: {
        days: 20
      },
      data: ''
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    toGetProblems() {
      this.$router.push({
        name: 'GetProblems'
      })
    },
    toSimProblem() {
      this.$router.push({
        name: 'SimProblem'
      })
    },
    toProblemLocalized() {
      this.$router.push({
        name: 'ProblemLocalized'
      })
    },
    getData() {
      getSpiderJobCountDay({
        days: this.query.days
      }).then(response => {
        const res = response.data
        this.data = res.datas[0]
        console.log(this.data)
        this.initChart()
      })
    },
    initChart() {
      const startDates = []
      const totalCounts = []
      for (const i of this.data) {
        startDates.push(formatDate(i.startDate, 'yyyy-MM-dd'))
        totalCounts.push(i.totalCount)
      }
      console.log(startDates)
      console.log(totalCounts)
      this.chart = echarts.init(document.getElementById('echart-1'), 'macarons')
      this.chart.setOption({
        title: {
          text: '最近' + this.query.days + '天爬虫执行记录'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: startDates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: totalCounts,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .el-card {
    margin-bottom: 10px;
  }
  >>> .el-card__header {
    font-weight: bold;
    font-size: 18px;
    margin-left: 6px;
  }
  #echart-1 {
    width: 100%;
    height: 320px;
  }
}
</style>
