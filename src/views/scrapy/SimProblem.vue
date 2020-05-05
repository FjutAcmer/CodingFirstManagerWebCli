<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，爬取题目时已经保证了题目的唯一性，这里进行的查重是对题目题干进行相似度查重</span>
    </div>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            待本地化题目
            <span style="color: blue">（题号输入框内回车选择，右同）</span>
          </div>
          <div>
            <el-row :gutter="5">
              <el-col :span="8">
                题目来源库：
                <el-input placeholder="爬取临时题库" disabled />
              </el-col>
              <el-col :span="8">
                <strong>数据库题号：</strong>
                <el-input
                  v-model="getProblemId"
                  placeholder="数据库题号"
                  @keyup.enter.native="querySpiderGetProblem()"
                />
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="5">
              <el-col :span="12">
                来源站点：
                <el-input v-model="getProblemInfo.fromWebsite" style="width: 200px" disabled />
              </el-col>
              <el-col :span="12">
                源题号：
                <el-input v-model="getProblemInfo.problemId" style="width: 200px" disabled />
              </el-col>
              <el-col :span="24">
                题目标题：
                <el-input v-model="getProblemInfo.problemTitle" style="width: 500px" disabled />
              </el-col>
              <el-col :span="24">
                题目描述：
                <span style="color: green">（相似度主要针对该项进行检测）</span>
                <pre v-html="getProblemInfo.problemDescription" />
              </el-col>
              <el-col :span="24">
                输入描述：
                <span style="color: green">（该项作为参考）</span>
                <pre v-html="getProblemInfo.problemInput" />
              </el-col>
              <el-col :span="24">
                输入样例：
                <span style="color: red">（该项不作参考）</span>
                <pre v-html="getProblemInfo.problemSampleInput" />
              </el-col>
              <el-col :span="24">
                输出描述：
                <span style="color: green">（该项作为参考）</span>
                <pre v-html="getProblemInfo.problemOutput" />
              </el-col>
              <el-col :span="24">
                输出样例：
                <span style="color: red">（该项不作参考）</span>
                <pre v-html="getProblemInfo.problemSampleOutput" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            本地题目
            <span style="color: red">（可选择题目来源库的全部题目！数据库题号项填入“all”）</span>
          </div>
          <div>
            <el-row :gutter="5">
              <el-col :span="8">
                题目来源库：
                <el-input style="width: 180px" placeholder="本地题库" disabled />
              </el-col>
              <el-col :span="12">
                <strong>
                  题目题号
                  <span style="color: red">（非数据库题号！请甄别）</span>：
                </strong>
                <el-input
                  v-model="localProblemId"
                  placeholder="题目题号"
                  @keyup.enter.native="queryLocalProblem()"
                />
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="5">
              <el-col :span="12">
                来源站点：
                <el-input style="width: 200px" disabled />
              </el-col>
              <el-col :span="12">
                源题号：
                <el-input style="width: 200px" disabled />
              </el-col>
              <el-col :span="24">
                题目标题：
                <el-input v-model="localProblemInfo.title" style="width: 500px" disabled />
              </el-col>
              <el-col :span="24">
                题目描述：
                <span style="color: green">（相似度主要针对该项进行检测）</span>
                <pre v-html="localProblemInfo.description" />
              </el-col>
              <el-col :span="24">
                输入描述：
                <span style="color: green">（该项作为参考）</span>
                <pre v-html="localProblemInfo.input" />
              </el-col>
              <el-col :span="24">
                输入样例：
                <span style="color: red">（该项不作参考）</span>
                <pre v-html="localProblemInfo.inputCase" />
              </el-col>
              <el-col :span="24">
                输出描述：
                <span style="color: green">（该项做为参考）</span>
                <pre v-html="localProblemInfo.output" />
              </el-col>
              <el-col :span="24">
                输出样例：
                <span style="color: red">（该项不作参考）</span>
                <pre v-html="localProblemInfo.outputCase" />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <el-button type="primary" @click="simProblem()">开始查重</el-button>
      <el-button type="danger" @click="toLocalized()">本地化题目</el-button>
    </el-card>
    <el-card>
      <div slot="header">查重结果</div>
      <span v-if="!simInfo" style="color: red">本次任务未开始</span>
      <div v-else>
        <p style="color: green">查重完毕！</p>
        <p>查重、本地化记录ID：{{ simInfo.id }}</p>
        <p>爬虫临时题目ID：{{ simInfo.spiderGetProblemId }}</p>
        <p>本地题库题目号：{{ simInfo.localProblemId }}</p>
        <p>创建者：{{ simInfo.createUser }}</p>
        <p>操作记录：{{ simInfo.operateRecord }}</p>
        <p>测试文件于服务器路径：{{ simInfo.simRecord.test_file_path }}</p>
        <p>样本文件于服务器路径：{{ simInfo.simRecord.sample_file_path }}</p>
        <p>查重结果文件于服务器路径：{{ simInfo.simRecord.result_file_path }}</p>
        <p>开始查重时间：{{ new Date(simInfo.simRecord.begin_time).toLocaleString() }}</p>
        <p>结束查重时间：{{ new Date(simInfo.simRecord.end_time).toLocaleString() }}</p>
        <p>
          最终查重相似度：
          <span
            v-if="simInfo.simRecord.cos_sim_num>0.70"
            style="color: green; font-size:30px;"
          >{{ Number(simInfo.simRecord.cos_sim_num*100).toFixed(2)+'%' }}</span>
          <span
            v-else
            style="color: red; font-size:30px;"
          >{{ Number(simInfo.simRecord.cos_sim_num*100).toFixed(2)+'%' }}</span>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getInfo, simTwoProblem } from '@/api/spider-problem'
import { fetchProblem } from '@/api/problems'
export default {
  name: 'SimProblem',
  data() {
    return {
      getProblemId: '',
      getProblemInfo: '',
      localProblemId: '',
      localProblemInfo: '',
      simInfo: ''
    }
  },
  methods: {
    toLocalized() {
      this.$router.push({
        name: 'ProblemLocalized',
        query: {
          id: this.getProblemId
        }
      })
    },
    querySpiderGetProblem() {
      getInfo({
        id: this.getProblemId
      }).then(response => {
        const res = response.data
        this.getProblemInfo = res.datas[0]
      })
    },
    queryLocalProblem() {
      fetchProblem(this.localProblemId).then(response => {
        const res = response.data
        this.localProblemInfo = res.datas[1]
        this.localProblemInfo.title = res.datas[0].title
        this.localProblemInfo.inputCase = res.datas[2].length
          ? res.datas[2][0].inputCase
          : ''
        this.localProblemInfo.outputCase = res.datas[2].length
          ? res.datas[2][0].outputCase
          : ''
      })
    },
    simProblem() {
      simTwoProblem({
        localProblemId: this.localProblemId,
        isLocalAll: false,
        spiderGetProblemId: this.getProblemId
      }).then(response => {
        const res = response.data
        this.simInfo = res.datas[0]
        console.log(this.simInfo)
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
    pre {
      background-color: #f5f7fa;
      border: 1px solid #dfe4ed;
      font-size: 16px;
      padding: 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
