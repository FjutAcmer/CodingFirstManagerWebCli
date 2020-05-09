<template>
  <div class="app-container">
    <el-card>
      <div slot="header">【{{ spiderName }}】任务ID为【{{ jobId }}】的日志</div>
      <div>
        <el-row :gutter="5">
          <el-col :span="6">
            爬取记录ID：
            <el-input v-model="jobInfo.id" style="width: 180px;" disabled />
          </el-col>
          <el-col :span="8">
            任务ID：
            <el-input v-model="jobInfo.jobId" style="width: 290px;" disabled />
          </el-col>
          <el-col :span="6">
            爬虫名：
            <el-input v-model="jobInfo.spiderName" style="width: 180px;" disabled />
          </el-col>
          <el-col :span="6">
            当前状态：
            <el-input v-model="jobInfo.currentStatusStr" style="width: 180px;" disabled />
          </el-col>
          <el-col :span="6">
            创建用户：
            <el-input v-model="jobInfo.createUser" style="width: 180px;" disabled />
          </el-col>
          <el-col :span="12">
            到达计划结束时间是否强制停止爬虫运行：
            <el-input v-model="jobInfo.forceCancelStr" style="width: 200px;" disabled />
          </el-col>
          <el-col :span="6">
            计划开始时间：
            <el-date-picker v-model="jobInfo.planStartTime" type="datetime" disabled />
          </el-col>
          <el-col :span="6">
            计划结束时间：
            <el-date-picker v-model="jobInfo.planEndTime" type="datetime" disabled />
          </el-col>
          <el-col :span="6">
            实际开始时间：
            <el-date-picker v-model="jobInfo.actualStartTime" type="datetime" disabled />
          </el-col>
          <el-col :span="6">
            实际结束时间：
            <el-date-picker v-model="jobInfo.actualEndTime" type="datetime" disabled />
          </el-col>
          <el-col :span="24">
            题目爬取范围：
            <el-input v-model="jobInfo.problemRange" disabled />
          </el-col>
        </el-row>

        <!-- {{ jobInfo }} -->
      </div>
      <span class="title-font">数据库记录日志</span>
      <span style="color: red">（本日志记录于数据库中，不一定与实时日志同步，如需要，请点击下方【重新获取】按钮进行更新）</span>

      <pre>{{ jobInfo.result }}</pre>
      <el-divider />
      <span class="title-font">爬虫服务器实时日志</span>
      <span style="color: green">（最后获取于：{{ lastUpdateAt }}）</span>

      <el-switch
        v-model="autoQuery"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="自动轮询"
        inactive-text="手动查询"
        @change="switchChange"
      />
      <el-button
        v-show="!autoQuery"
        type="primary"
        size="mini"
        icon="el-icon-refresh"
        @click="queryLog()"
      >重新获取</el-button>
      <pre>{{ jobLog }}</pre>
    </el-card>
  </div>
</template>

<script>
import { getSpiderLogRealtime, getSpiderJobInfo } from '@/api/spider'
export default {
  name: 'SpiderLog',
  data() {
    return {
      autoQuery: false,
      timer: '',
      spiderName: '',
      jobId: '',
      jobInfo: '',
      jobLog: '',
      lastUpdateAt: ''
    }
  },
  watch: {
    // autoQuery(val) {
    // }
  },
  mounted() {
    this.spiderName = this.$route.query.spiderName
    this.jobId = this.$route.query.jobId
    this.queryLog()
    this.queryJobInfo()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    switchChange(val) {
      if (val) {
        this.queryLog()
        this.timer = setInterval(() => {
          this.queryLog()
        }, 3 * 1000)
      } else {
        if (this.timer) {
          clearInterval(this.timer)
        }
      }
    },
    queryLog() {
      getSpiderLogRealtime({
        spiderName: this.spiderName,
        jobId: this.jobId
      }).then(response => {
        const res = response.data
        this.jobLog = res.datas[0]
        this.lastUpdateAt = new Date().toLocaleString()
      })
    },
    queryJobInfo() {
      getSpiderJobInfo({
        jobId: this.jobId
      }).then(response => {
        const res = response.data
        this.jobInfo = res.datas[0]
        this.jobInfo.currentStatusStr =
          this.jobInfo.currentStatus === '1' ? '正常' : '未知'
        this.jobInfo.forceCancelStr =
          this.jobInfo.forceCancel === '1' ? '是' : '否'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  >>> .el-card__header {
    background-color: #eef1f6;
  }
  .el-card {
    .el-row {
      margin-bottom: 10px;
      .el-col {
        margin-bottom: 10px;
      }
    }
    .title-font {
      font-size: 20px;
      font-weight: bold;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 16px;
      color: grey;
      font-weight: bolder;
    }
  }
}
</style>
