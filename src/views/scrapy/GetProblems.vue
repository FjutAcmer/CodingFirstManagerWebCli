<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，如非必要，请尽量在网络空闲时期爬取题目。如需设置自动爬取策略，请到爬虫管理模块设置</span>
    </div>
    <SpiderStatusCard />
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div slot="header">全站爬取</div>
          <div>
            <el-row :gutter="5">
              <el-col v-for="item in fullOjs" :key="item.id" :span="4">
                <OJSiteCard :data="item" @click.native="selectSpiderItem(item)" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">范围爬取</div>
          <div>
            <el-row :gutter="5">
              <el-col v-for="item in specOjs" :key="item.id" :span="4">
                <OJSiteCard :data="item" @click.native="selectSpiderItem(item)" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <div>
        <el-row :gutter="5">
          <el-col :span="6">
            爬取站点:
            <el-input v-model="selectedItem.targetWebsiteName" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            站点网址:
            <el-input v-model="selectedItem.targetWebsiteUrl" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            执行爬虫:
            <el-input v-model="selectedItem.spiderName" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            可执行范围:
            <el-input v-model="selectedItem.range" style="width: 200px" disabled />
          </el-col>
          <el-col :span="24">
            爬取范围：
            <el-input v-model="selectRange" :disabled="selectedItem.spiderType===1" />
            <span
              style="color: red"
            >接收参数：单题直接输入题号，范围使用“[起始题号-结束题号]”（范围格式仅支持数字题号），用“,”隔开。例：1000,1001,[1002-1009],1010</span>
          </el-col>
          <div v-show="showBtn">
            <el-button type="info" @click="checkNetStatus()">跳转目标站点</el-button>
            <el-button type="warning" @click="checkRange()">检查爬取范围</el-button>
            <el-button type="primary" @click="startSpider()">开始爬取</el-button>
          </div>
        </el-row>

        <el-input
          v-show="rangeCheckShow"
          v-model="rangeCheckText"
          resize="none"
          autosize
          disabled
          type="textarea"
        />
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <span>执行结果</span>
      </div>
      <div v-if="jobInfo">
        <div v-if="jobInfo.status==='ok'">
          <p style="color: green">爬虫启动成功！TODO 本次任务ID</p>
          <p>
            爬虫服务器节点：
            <strong>{{ jobInfo.node_name }}</strong>
          </p>
          <p>
            本次爬虫任务标记：
            <strong style="color: blue">{{ jobInfo.jobid }}</strong>
            <el-button type="primary" size="small" @click="showRealTimeLog()">查看实时日志文件</el-button>
            <el-button type="primary" size="small">查看本次任务爬取题目</el-button>
          </p>
        </div>
        <div v-else>
          <p style="color:red">爬虫服务器启动失败！</p>
          <p>报错信息：{{ jobInfo }}</p>
        </div>
      </div>
      <div v-else>
        <span style="color: red">本次任务未开始</span>
      </div>
      <!-- <el-dialog title="本次任务实时日志" :visible.sync="showLog">
        <el-button icon="el-icon-refresh" type="primary" size="mini" @click="refreshLog()">刷新</el-button>
        <pre>{{ jobLog }}</pre>
      </el-dialog>-->
    </el-card>
  </div>
</template>

<script>
import OJSiteCard from './components/OJSiteCard'
import SpiderStatusCard from './components/SpiderStatusCard'

import { getItems, startSpider } from '@/api/spider'
export default {
  name: 'GetProblems',
  components: {
    OJSiteCard,
    SpiderStatusCard
  },
  data() {
    return {
      fullOjs: [],
      specOjs: [],
      selectedItem: '',
      selectRange: '',
      showBtn: false,
      rangeCheckShow: false,
      rangeCheckText: '',
      jobInfo: ''
      // showLog: false,
      // jobLog: ''
    }
  },
  mounted() {
    this.getSpiderItems()
  },
  methods: {
    getSpiderItems() {
      getItems({
        pageNum: '1',
        pageSize: '100'
      }).then(response => {
        const res = response.data
        for (const i of res.datas[0]) {
          if (i.spiderType === 1) {
            this.fullOjs.push(i)
          } else if (i.spiderType === 2) {
            this.specOjs.push(i)
          }
        }
      })
    },
    selectSpiderItem(item) {
      item.range = item.spiderType === 1 ? '全站爬取' : '范围爬取'
      this.selectRange = item.spiderType === 1 ? 'All' : ''
      this.selectedItem = item
      this.showBtn = true
    },
    checkNetStatus() {
      window.open('http://' + this.selectedItem.targetWebsiteUrl)
    },
    checkRange() {
      //  TODO: 让后端检查爬取范围有效性
      this.rangeCheckShow = true
      this.rangeCheckText = 'TODO 还没做完'
    },
    startSpider() {
      if (this.selectRange === '') {
        this.$message.error('未指定范围！')
        return
      }
      startSpider({
        spiderName: this.selectedItem.spiderName,
        range: this.selectRange
      }).then(response => {
        const res = response.data
        this.jobInfo = res.datas[0]
      })
    },
    showRealTimeLog() {
      //  TODO: 路由跳转
      this.$router.push('/spiderlog')
      // this.showLog = true
      // this.refreshLog()
    },
    refreshLog() {
      // getSpiderLog({
      //   spiderName: this.selectedItem.spiderName,
      //   jobId: this.jobInfo.jobid
      // }).then(response => {
      //   const res = response.data
      //   this.jobLog = res.datas[0]
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .warning-title {
    background-color: lightyellow;
    color: red;
  }
  & >>> .el-card__header {
    background-color: #eef1f6;
  }
  .el-card {
    margin-bottom: 14px;
    >>> .el-row {
      margin-bottom: 10px;
      .el-col {
        margin-bottom: 10px;
      }
    }
  }
  >>> .pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>

