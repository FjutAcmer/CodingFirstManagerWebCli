<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，如非必要，请尽量在网络空闲时期爬取题目。如需设置自动爬取策略，请到爬虫管理模块设置</span>
    </div>
    <el-card>
      <div slot="header">站点名</div>
      <div>
        <el-row :gutter="5">
          <el-col v-for="item in websites" :key="item.id" :span="2">
            <el-popover placement="top">
              <el-button type="warning" @click="selectSpiderItem(item[0])">全站爬取</el-button>
              <el-button v-show="item[1]" type="success" @click="selectSpiderItem(item[1])">范围爬取</el-button>
              <OJSiteCard slot="reference" :data="item[0]" />
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div>
        <el-row :gutter="10">
          <el-col :span="6">
            目前选中爬虫：
            <el-avatar :size="24" :src="selectedItem.targetWebsiteLogoUrl" fit="cover" />
            {{ selectedItem.targetWebsiteName }}
          </el-col>
          <el-col :span="18">
            目前选中模式：
            <el-tag
              effect="dark"
              :type="selectedItem.spiderType===1?'warning':'success'"
            >{{ selectedItem.range }}</el-tag>
          </el-col>
          <el-col :span="24">
            目前执行方式：
            <el-tag effect="dark" type="success">立即爬取</el-tag>
          </el-col>
          <el-col :span="6">
            爬取站点:
            <el-input v-model="selectedItem.targetWebsiteName" disabled />
          </el-col>
          <el-col :span="6">
            站点网址:
            <el-input v-model="selectedItem.targetWebsiteUrl" disabled>
              <el-button slot="append" @click="checkNetStatus()">跳转查看</el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            执行爬虫:
            <el-input v-model="selectedItem.spiderName" disabled />
          </el-col>
          <el-col :span="6">
            反反爬策略:
            <el-input v-model="selectedItem.antiMeasures" disabled />
          </el-col>
          <el-col :span="24">
            爬取范围：
            <el-input
              v-model="selectRange"
              placeholder="形如 1000,1001,[1002-1009],1010"
              :disabled="selectedItem.spiderType===1"
            />
            <span
              style="color: red"
            >接收参数：单题直接输入题号，范围使用“[起始题号-结束题号]”（范围格式仅支持数字题号），用“,”隔开。例：1000,1001,[1002-1009],1010</span>
          </el-col>
          <!-- <el-col>定时任务：</el-col> -->
        </el-row>
        <el-divider />
        <div class="title-font">设置为定时任务：</div>
        <el-row :gutter="10">
          <el-col :span="24">
            选择执行时间：
            <el-date-picker
              v-model="timeBetween"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束"
            />
            <span style="color: blue">设置本项，即可在开始时间触发该任务，并在结束时间强制关闭该任务。为空则立即执行</span>
          </el-col>
        </el-row>
        <el-divider />
        <div v-show="showBtn">
          <el-button type="warning" @click="checkRange()">检查爬取范围</el-button>
          <el-button v-loading="loading" type="primary" @click="startSpider()">执行爬取</el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <span>执行结果</span>
      </div>
      <div v-if="jobInfo">
        <div v-if="jobInfo.status==='ok'">
          <p style="color: green">
            爬虫启动成功！本次任务的数据库ID为
            <strong>{{ jobInfo2.id }}</strong>
            ，
            实际启动时间为{{ new Date(jobInfo2.actualStartTime).toLocaleString() }}
          </p>
          <p>
            爬虫服务器节点：
            <strong>{{ jobInfo.node_name }}</strong>
          </p>
          <p>
            本次爬虫任务标记：
            <strong style="color: blue">{{ jobInfo.jobid }}</strong>
            <el-button type="primary" size="small" @click="showRealTimeLog()">查看实时日志文件</el-button>
            <el-button type="primary" size="small" @click="toTempProblems()">查看本次任务爬取题目</el-button>
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
    </el-card>
  </div>
</template>

<script>
import OJSiteCard from './components/OJSiteCard'
import store from '@/store'
import {
  getSites,
  startFullSpider,
  startSpecSpider,
  rangeCheck
} from '@/api/spider'
export default {
  name: 'GetProblems',
  components: {
    OJSiteCard
  },
  data() {
    return {
      popVisiable: false,
      loading: false,
      websites: [],
      selectedItem: '',
      selectRange: '',
      timeBetween: '',
      showBtn: false,
      rangeCheckText: '',
      jobInfo: '',
      jobInfo2: ''
    }
  },
  mounted() {
    this.getSpiderItems()
  },
  methods: {
    getSpiderItems() {
      getSites({
        pageNum: '1',
        pageSize: '100'
      }).then(response => {
        const res = response.data
        this.websites = res.datas[0]
        console.log(this.websites)
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
      if (this.selectRange === '') {
        this.$message.error('未指定范围！')
        return
      }
      rangeCheck(this.selectRange).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.rangeCheckText = '范围正常！解析为：' + res.datas[0]
          this.$message.success(this.rangeCheckText)
        } else {
          this.rangeCheckText = '范围解析失败！请检查范围是否符合要求！'
          this.$message.error(this.rangeCheckText)
        }
      })
    },
    startSpider() {
      if (this.selectRange === '') {
        this.$message.error('未指定范围！')
        return
      }
      this.loading = true
      if (this.selectedItem.spiderType === 1) {
        startFullSpider({
          spiderName: this.selectedItem.spiderName,
          range: this.selectRange,
          username: store.getters.name
        }).then(response => {
          const res = response.data
          this.jobInfo = res.datas[0]
          this.jobInfo2 = res.datas[1]
          this.loading = false
        })
      } else if (this.selectedItem.spiderType === 2) {
        startSpecSpider({
          spiderName: this.selectedItem.spiderName,
          range: this.selectRange,
          username: store.getters.name
        }).then(response => {
          const res = response.data
          this.jobInfo = res.datas[0]
          this.jobInfo2 = res.datas[1]
          this.loading = false
        })
      }
    },
    showRealTimeLog() {
      this.$router.push({
        name: 'SpiderLog',
        query: {
          spiderName: this.selectedItem.spiderName,
          jobId: this.jobInfo.jobid
        }
      })
    },
    toTempProblems() {
      this.$router.push({
        name: 'TempProblems',
        query: {
          spiderJob: this.jobInfo2.id
        }
      })
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
  >>> .el-card__header {
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
    .title-font {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
}
</style>

