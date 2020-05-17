<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <order-table />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      />
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/ProblemTypeChart'
import PieChart from './components/LanguageChart'
import BarChart from './components/ContestChart'
import OrderTable from './components/OrderTable'
import { getUserActive } from '@/api/user'
import { getAcAndSubmit } from '@/api/judge'
import { getOrderNewAndCancel } from '@/api/mall'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    RaddarChart,
    PieChart,
    BarChart,
    OrderTable,
    LineChart
  },
  data() {
    return {
      dataLoading: true,
      allData: {
        userActive: {
          name: 'userActive',
          // 活跃人数
          firstData: [],
          // 新用户
          secondData: []
        },
        problemAcAndSubmit: {
          name: 'problemAcAndSubmit',
          firstData: [],
          secondData: []
        },
        contestAcAndSubmit: {
          name: 'contestAcAndSubmit',
          firstData: [],
          secondData: []
        },
        orderNewAndCancel: {
          name: 'orderNewAndCancel',
          firstData: [],
          secondData: []
        }
      },
      lineChartData: ''
    }
  },
  created() {
    this.getUserActive()
    this.getAcAndSubmit()
    this.getOrderNewAndCancel()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = this.allData[type]
    },
    getUserActive() {
      getUserActive().then(response => {
        const res = response.data
        this.allData.userActive.firstData = res.datas[0].active
        this.allData.userActive.secondData = res.datas[0].newRegister
        this.lineChartData = this.allData.userActive
      })
    },
    getAcAndSubmit() {
      getAcAndSubmit().then(response => {
        const res = response.data
        this.allData.problemAcAndSubmit.firstData = res.datas[0].totalAc
        this.allData.problemAcAndSubmit.secondData = res.datas[0].totalSubmit
        this.allData.contestAcAndSubmit.firstData = res.datas[0].contestAc
        this.allData.contestAcAndSubmit.secondData = res.datas[0].contestSubmit
      })
    },
    getOrderNewAndCancel() {
      getOrderNewAndCancel().then(response => {
        const res = response.data
        this.allData.orderNewAndCancel.firstData = res.datas[0].newCancel
        this.allData.orderNewAndCancel.secondData = res.datas[0].newOrder
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
