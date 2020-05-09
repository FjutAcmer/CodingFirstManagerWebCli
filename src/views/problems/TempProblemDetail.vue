<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        爬取题目ID为【{{ problemInfo.id }}】的题目详情：
        <el-button size="mini" type="success" @click="toLocalized(problemInfo.id)">进行本地化</el-button>
        <el-button size="mini" type="danger">删除本题</el-button>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="6">
            临时题目ID：
            <el-input v-model="problemInfo.id" disabled />
          </el-col>
          <el-col :span="6">
            来自网站名称：
            <el-input v-model="problemInfo.fromWebsite" disabled />
          </el-col>
          <el-col :span="6">
            源题目ID：
            <el-input v-model="problemInfo.problemId" disabled />
          </el-col>
          <el-col :span="6">
            来自爬虫：
            <el-input v-model="problemInfo.spiderName" disabled />
          </el-col>
          <el-col :span="12">
            题目所在页面地址：
            <el-input v-model="problemInfo.problemUrl" disabled>
              <el-button
                slot="append"
                icon="el-icon-link"
                @click="toOriginUrl(problemInfo.problemUrl)"
              />
            </el-input>
          </el-col>
          <el-col :span="4">
            插入时间：
            <el-date-picker v-model="problemInfo.insertTime" type="datetime" disabled />
          </el-col>
        </el-row>
        <el-divider />
        <strong>
          是否已经本地化：
          <span style="color: red">（否）</span>
          <span style="color: green">（是）</span>
        </strong>
        <el-divider />
        <span class="title-font">题目标题：</span>
        <el-input v-model="problemInfo.problemTitle" disabled />
        <el-divider />
        <span class="title-font">题目时间限制：</span>
        <el-input v-model="problemInfo.problemTimeLimit" disabled />
        <el-divider />
        <span class="title-font">题目内存限制：</span>
        <el-input v-model="problemInfo.problemMemoryLimit" disabled />
        <el-divider />
        <span class="title-font">题目描述：</span>
        <pre v-html="problemInfo.problemDescription" />
        <el-divider />
        <span class="title-font">输入提示：</span>
        <pre v-html="problemInfo.problemInput" />

        <el-divider />
        <span class="title-font">输出提示：</span>
        <pre v-html="problemInfo.problemOutput" />

        <el-divider />
        <span class="title-font">输入样例：</span>
        <pre v-html="problemInfo.problemSampleInput" />

        <el-divider />
        <span class="title-font">输出样例：</span>
        <pre v-html="problemInfo.problemSampleOutput" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getInfo } from '@/api/spider-problem'
export default {
  data() {
    return {
      problemInfo: ''
    }
  },
  mounted() {
    this.getProblemInfo()
  },
  methods: {
    toLocalized(id) {
      this.$router.push({
        name: 'ProblemLocalized',
        query: {
          id: id
        }
      })
    },
    toOriginUrl(val) {
      window.open(val, '_blank')
    },
    getProblemInfo() {
      getInfo({
        id: this.$route.query.id
      }).then(response => {
        const res = response.data
        this.problemInfo = res.datas[0]
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
    .title-font {
      font-weight: bold;
    }
    pre {
      background-color: #f5f7fa;
      border: 1px solid #dfe4ed;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 16px;
      color: #c0c4cc;
      padding: 10px;
    }
    .el-row {
      .el-col {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
