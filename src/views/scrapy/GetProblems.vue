<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，如非必要，请尽量在网络空闲时期爬取题目。如需设置自动爬取策略，请到爬虫管理模块设置</span>
    </div>
    <ScrapyStatusCard />
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
            >接收参数：单题直接输入题号，范围使用“[起始题号-结束题号]”（范围仅支持数字题号），用“,”隔开。例：1000,1001,[1002-1009],1010</span>
          </el-col>
          <div v-show="showBtn">
            <el-button type="info" @click="checkNetStatus()">跳转目标站点</el-button>
            <el-button type="warning" @click="checkRange()">检查爬取范围有效性</el-button>
            <el-button type="primary">开始爬取</el-button>
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
      <div slot="header">执行结果</div>
      <span style="color: red">本次任务未开始</span>
    </el-card>
  </div>
</template>

<script>
import OJSiteCard from './components/OJSiteCard'
import ScrapyStatusCard from './components/ScrapyStatusCard'
import { getItems } from '@/api/spider'
export default {
  name: 'GetProblems',
  components: {
    OJSiteCard,
    ScrapyStatusCard
  },
  data() {
    return {
      fullOjs: [],
      specOjs: [],
      selectedItem: '',
      selectRange: '',
      showBtn: false,
      rangeCheckShow: false,

      rangeCheckText: ''
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
      this.rangeCheckText = 'All - 全站爬取 - 已爬取XXX'
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
}
</style>

