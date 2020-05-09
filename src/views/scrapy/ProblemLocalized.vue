<template>
  <div class="app-container">
    <el-card>
      <div slot="header">题目本地化</div>
      <el-row :gutter="10">
        <el-col :span="6">
          临时题目ID：
          <el-input v-model="id" :disabled="$route.query.id" />
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
      <span class="title-font">
        查重报告：
        <span style="color: red">（无）</span>
        <span style="color: green">（有）</span>
        <el-button type="danger" size="mini">进行查重</el-button>
      </span>
      <el-input type="textarea" rows="7" resize="none" disabled />
      <el-divider />
      <span class="title-font">题目标题：</span>
      <el-input v-model="newProblemInfo.problemTitle" />
      <el-divider />
      <span class="title-font">题目时间限制：</span>
      <el-input v-model="newProblemInfo.problemTimeLimit" />
      <el-divider />
      <span class="title-font">题目内存限制：</span>
      <el-input v-model="newProblemInfo.problemMemoryLimit" />
      <el-divider />
      <span class="title-font">题目描述：</span>
      <Tinymce ref="editor" v-model="newProblemInfo.problemDescription" :height="200" />
      <el-divider />
      <span class="title-font">输入提示：</span>
      <Tinymce ref="editor" v-model="newProblemInfo.problemInput" :height="200" />
      <el-divider />
      <span class="title-font">输出提示：</span>
      <Tinymce ref="editor" v-model="newProblemInfo.problemOutput" :height="200" />
      <el-divider />
      <span class="title-font">
        输入样例：
        <span style="color: red">(编辑时可能会丢失格式，请注意与原题对应！)</span>
      </span>
      <Tinymce ref="editor" v-model="newProblemInfo.problemSampleInput" :height="200" />
      <el-divider />
      <span class="title-font">
        输出样例：
        <span style="color: red">(编辑时可能会丢失格式，请注意与原题对应！)</span>
      </span>
      <Tinymce ref="editor" v-model="newProblemInfo.problemSampleOutput" :height="200" />
      <el-divider />
      <span class="title-font">
        提示：
        <span style="color: red">(该项非必需)</span>
      </span>
      <Tinymce ref="editor" v-model="newProblemInfo.problemHint" :height="200" />
      <el-divider />
      <span class="title-font">是否特判（SPJ）</span>
      <el-radio-group v-model="newProblemInfo.isSpj">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
      <el-button type="danger" size="mini">添加特判脚本</el-button>
      <el-divider />
      <span class="title-font">64位 INT类型</span>
      <el-input v-model="newProblemInfo.intFormat" />
      <el-divider />

      <el-button type="warning">添加测试集</el-button>
      <el-button type="primary">执行本地化</el-button>
    </el-card>
  </div>
</template>

<script>
import { getInfo } from '@/api/spider-problem'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'ProblemLocalized',
  components: { Tinymce },
  data() {
    return {
      id: '',
      problemInfo: '',
      newProblemInfo: {
        problemTitle: '',
        problemDescription: '',
        problemInput: '',
        problemOutput: '',
        problemSampleInput: '',
        problemSampleOutput: '',
        problemHint: '',
        isSpj: 0,
        intFormat: '%lld'
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getProblemInfo()
    } else {
      this.$message.warning('请指定题目ID')
    }
  },
  methods: {
    toOriginUrl(val) {
      window.open(val, '_blank')
    },
    getProblemInfo() {
      getInfo({
        id: this.id
      }).then(response => {
        const res = response.data
        this.problemInfo = res.datas[0]
        this.newProblemInfo.problemTitle = this.problemInfo.problemTitle
        this.newProblemInfo.problemTimeLimit = this.problemInfo.problemTimeLimit
        this.newProblemInfo.problemMemoryLimit = this.problemInfo.problemMemoryLimit
        this.newProblemInfo.problemDescription = this.problemInfo.problemDescription
        this.newProblemInfo.problemInput = this.problemInfo.problemInput
        this.newProblemInfo.problemOutput = this.problemInfo.problemOutput
        this.newProblemInfo.problemSampleInput = this.problemInfo.problemSampleInput
        this.newProblemInfo.problemSampleOutput = this.problemInfo.problemSampleOutput
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
    .el-row {
      .el-col {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
