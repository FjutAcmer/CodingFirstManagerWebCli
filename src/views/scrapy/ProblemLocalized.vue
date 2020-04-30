<template>
  <div class="app-container">
    <el-card>
      <div slot="header">题目本地化</div>
      <el-row :gutter="10">
        <el-col :span="6">
          临时题目ID：
          <el-input v-model="problemInfo.id" disabled />
        </el-col>
        <el-col :span="6">
          来自网站名称：
          <el-input v-model="problemInfo.id" disabled />
        </el-col>
        <el-col :span="6">
          源题目ID：
          <el-input v-model="problemInfo.id" disabled />
        </el-col>
        <el-col :span="6">
          题目所在页面地址：
          <el-input v-model="problemInfo.id" disabled />
        </el-col>

        <el-col :span="6">
          来自爬虫：
          <el-input v-model="problemInfo.id" disabled />
        </el-col>
        <el-col :span="6">
          插入时间：
          <el-time-picker v-model="problemInfo.id" type="datetime" disabled />
        </el-col>
      </el-row>
      <el-divider />
      <span class="title-font">
        查重报告：
        <span style="color: red">（无）</span>
        <span style="color: green">（有）</span>
      </span>
      <el-input type="textarea" rows="7" resize="none" disabled />
      <el-divider />
      <span class="title-font">题目标题：</span>
      <el-input />
      <el-divider />
      <span class="title-font">题目时间限制：</span>
      <el-input />
      <el-divider />
      <span class="title-font">题目内存限制：</span>
      <el-input />
      <el-divider />
      <span class="title-font">题目描述：</span>
      <Tinymce ref="editor" v-model="problemInfo" :height="400" />
      <el-divider />
      <span class="title-font">输入提示：</span>
      <Tinymce ref="editor" v-model="problemInfo" :height="400" />
      <el-divider />
      <span class="title-font">输出提示：</span>
      <Tinymce ref="editor" v-model="problemInfo" :height="400" />
      <el-divider />
      <span class="title-font">输入样例：</span>
      <Tinymce ref="editor" v-model="problemInfo" :height="400" />
      <el-divider />
      <span class="title-font">输出样例：</span>
      <Tinymce ref="editor" v-model="problemInfo" :height="400" />
    </el-card>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  name: 'ProblemLocalized',
  components: { Tinymce },
  props: {},
  data() {
    return {
      problemInfo: ''
    }
  },
  mounted() {},
  methods: {}
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
