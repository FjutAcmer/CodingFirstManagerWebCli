<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，部分设置仅在重启后生效</span>
    </div>
    <el-card>
      <div slot="header">
        全局系统设置
        <el-button type="danger" @click="doEditorSystem()">修改</el-button>
        <el-button type="primary">保存</el-button>
      </div>
      <div>
        <el-row :gutter="5">
          <el-col v-for="item in systemSetting" :key="item.key" :span="12">
            <el-tag type="success" effect="dark">{{ item.key }}</el-tag>：当前：
            <el-input v-model="item.value" style="width: 120px" disabled placeholder="当前设置" />改为：
            <el-input
              v-model="item.new"
              style="width: 120px"
              :disabled="editorSystem"
              placeholder="可选设置"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        爬虫服务器设置
        <el-button type="danger" @click="doEditorSpider()">修改</el-button>
        <el-button type="primary" @click="saveSpiderSetting()">保存</el-button>
      </div>
      <div>
        <el-row :gutter="5">
          <el-col v-for="item in spiderSetting" :key="item.key" :span="12">
            <el-tag type="success" effect="dark">{{ item.key }}</el-tag>：当前：
            <el-input v-model="item.value" style="width: 120px" disabled placeholder="当前设置" />改为：
            <el-input
              v-model="item.new"
              style="width: 120px"
              :disabled="editorSpider"
              placeholder="可选设置"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      systemSetting: [
        {
          key: '数据库IP',
          value: '127.0.0.1',
          new: ''
        },
        {
          key: '数据库端口',
          value: '3306',
          new: ''
        },
        {
          key: '连接用户名',
          value: 'root',
          new: ''
        },
        {
          key: '连接密码',
          value: 'wyx',
          new: ''
        },
        {
          key: '数据库名',
          value: 'cf_test',
          new: ''
        }
      ],
      spiderSetting: [
        {
          key: '数据库IP',
          value: '127.0.0.1',
          new: ''
        },
        {
          key: '数据库端口',
          value: '3306',
          new: ''
        },
        {
          key: '连接用户名',
          value: 'root',
          new: ''
        },
        {
          key: '连接密码',
          value: 'wyx',
          new: ''
        },
        {
          key: '数据库名',
          value: 'cf_test',
          new: ''
        },
        {
          key: '请求默认间隔',
          value: '随机',
          new: ''
        },
        {
          key: '是否启用IP池',
          value: '否',
          new: ''
        }
      ],
      editorSystem: true,
      editorSpider: true
    }
  },
  methods: {
    doEditorSystem() {
      this.editorSystem = !this.editorSystem
    },
    doEditorSpider() {
      this.editorSpider = !this.editorSpider
    },
    saveSpiderSetting() {
      // FIXME: 假数据
      this.editorSpider = true
      this.$message.success('保存成功！')
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
  }
}
</style>
