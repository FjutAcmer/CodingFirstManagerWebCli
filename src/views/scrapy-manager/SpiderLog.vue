<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        【{{ spiderName }}】-【{{ jobId }}】
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
      </div>
      <div>本次爬虫的内容</div>
      <el-divider />
      <pre>{{ jobLog }}</pre>
    </el-card>
  </div>
</template>

<script>
import { getSpiderLog } from '@/api/spider'
export default {
  name: 'SpiderLog',
  data() {
    return {
      autoQuery: false,
      timer: '',
      spiderName: '',
      jobId: '',
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
      getSpiderLog({
        spiderName: this.spiderName,
        jobId: this.jobId
      }).then(response => {
        const res = response.data
        this.jobLog = res.datas[0]
        this.lastUpdateAt = new Date().toLocaleString()
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
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 16px;
    color: black;
    font-weight: bolder;
  }
}
</style>
