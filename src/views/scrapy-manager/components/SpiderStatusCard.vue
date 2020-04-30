<template>
  <el-card>
    <div slot="header">
      爬虫服务器状态
      <span style="color: green">（服务器状态获取于：{{ lastUpdateAt }}）</span>
      <el-button size="mini" type="primary" icon="el-icon-refresh" @click="getSpiderStatus()">重新获取状态</el-button>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="6">
          服务器状态：
          <el-input v-model="spiderStatus.status" style="width: 150px" disabled />
        </el-col>
        <el-col :span="6">
          部署节点名：
          <el-input v-model="spiderStatus.node_name" style="width: 150px" disabled />
        </el-col>
        <el-col :span="6">
          运行中任务数：
          <el-input v-model="spiderStatus.running" style="width: 150px" disabled />
        </el-col>
        <el-col :span="6">
          排队中任务数：
          <el-input v-model="spiderStatus.pending" style="width: 150px" disabled />
        </el-col>
        <el-col :span="6">
          已结束任务数：
          <el-input v-model="spiderStatus.finished" style="width: 150px" disabled />
        </el-col>
      </el-row>
      <!-- {{ spiderStatus }} -->
    </div>
  </el-card>
</template>

<script>
import { getStatus } from '@/api/spider'
export default {
  data() {
    return {
      spiderStatus: '',
      lastUpdateAt: ''
    }
  },
  mounted() {
    this.getSpiderStatus()
  },
  methods: {
    getSpiderStatus() {
      getStatus().then(response => {
        const res = response.data
        this.spiderStatus = res.datas[0]
        this.lastUpdateAt = new Date().toLocaleString()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  >>> .el-card__header {
    background-color: #eef1f6;
  }
  .el-row {
    .el-col {
      margin-bottom: 10px;
    }
  }
}
</style>
