<template>
  <div class="app-container">
    <SpiderStatusCard />
    <el-card>
      <div slot="header">
        已有爬虫程序
        <span style="color: red">（双击图标选取）</span>
      </div>
      <div>
        <el-row :gutter="5">
          <el-col v-for="item in scrapys" :key="item" :span="2">
            <ScrapyCard :data="item" @dblclick.native="selectItem(item)" />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header">爬虫状态</div>
      <div>
        <el-row :gutter="5">
          <el-col :span="6">
            爬虫名:
            <el-input v-model="selectedItem.spiderName" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            爬虫程序名:
            <el-input v-model="selectedItem.spiderName" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            目标站点名:
            <el-input v-model="selectedItem.targetWebsiteName" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            站点地址:
            <el-input v-model="selectedItem.targetWebsiteUrl" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            部署状态:
            <el-input v-model="selectedItem.deploy" style="width: 200px" disabled />
          </el-col>
          <el-col :span="6">
            爬虫类型:
            <el-input v-model="selectedItem.type" style="width: 200px" disabled />
          </el-col>
          <el-col :span="24">
            反反爬措施:
            <el-input v-model="selectedItem.antiMeasures" disabled />
          </el-col>

          <el-col :span="24">
            爬取日志记录:
            <div v-if="showLogList" class="log-list">
              <p v-for="item in selectedItem.jobs" :key="item" class="log-list-item">
                <span>
                  爬取记录ID：
                  <strong>{{ item.id }}；</strong>
                </span>
                <span>
                  爬取任务ID：
                  <strong>{{ item.jobId }}；</strong>
                </span>
                <span>
                  由
                  <strong>{{ item.createUser?item.createUser:'未知' }}</strong>
                  执行；
                </span>
                <el-button
                  size="mini"
                  type="primary"
                  @click="toLog(selectedItem.spiderName, item.jobId)"
                >查看详细日志</el-button>
              </p>
              <p v-if="selectedItem.jobs.length===0" class="log-list-item">无记录</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import ScrapyCard from './components/ScrapyCard'
import SpiderStatusCard from './components/SpiderStatusCard.vue'
import { getItems, getSpiderJobList } from '@/api/spider'
export default {
  name: 'QueryScrapy',
  components: {
    ScrapyCard,
    SpiderStatusCard
  },
  data() {
    return {
      scrapys: [],
      selectedItem: '',
      showLogList: false
    }
  },
  mounted() {
    this.getSpiderItems()
  },
  methods: {
    getSpiderItems() {
      this.scrapys = []
      getItems({
        pageNum: '1',
        pageSize: '100'
      }).then(response => {
        const res = response.data
        for (const item of res.datas[0]) {
          item.deploy = item.deployStatus === 1 ? '已部署' : '未知状态'
          item.type = item.spiderType === 1 ? '全站爬取' : '范围爬取'
          this.scrapys.push(item)
        }
      })
    },
    getSpiderJobList() {
      this.selectedItem.jobs = []
      this.showLogList = false
      getSpiderJobList({
        spiderName: this.selectedItem.spiderName
      }).then(response => {
        const res = response.data
        this.selectedItem.jobs = res.datas[0]
        console.log(this.selectedItem.jobs)
        this.showLogList = true
      })
    },
    selectItem(item) {
      this.selectedItem = item
      this.getSpiderJobList()
    },
    toLog(spiderName, jobId) {
      this.$router.push({
        name: 'SpiderLog',
        query: {
          spiderName: spiderName,
          jobId: jobId
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
  & >>> .el-card__header {
    background-color: #eef1f6;
  }
  .el-card {
    margin-bottom: 14px;
    >>> .el-col {
      margin-bottom: 10px;
    }
    .log-list {
      background-color: #f5f7fa;
      border: 1px solid #dfe4ed;
      color: #c0c4cc;
      padding: 10px;
      .log-list-item {
        color: grey;
        margin: 4px;
      }
    }
  }
}
</style>
