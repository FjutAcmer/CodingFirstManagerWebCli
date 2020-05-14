<template>
  <div class="app-container">
    <SpiderStatusCard />

    <el-card>
      <div slot="header">
        爬虫服务器设置
        <span style="color: red">（请注意，部分设置仅在重启后生效）</span>
        <el-button icon="el-icon-switch-button" size="mini" type="danger">重启</el-button>
      </div>

      <div>
        <el-row :gutter="5">
          <el-col v-for="item in spiderSetting" :key="item.id" :span="24">
            <el-tag type="primary">{{ item.settingName }}（{{ item.settingLabel }}）</el-tag>：当前：
            <el-input
              v-model="item.settingValue"
              size="small"
              style="width: 200px"
              disabled
              placeholder="当前设置"
            />改为：
            <el-input
              v-model="item.new"
              size="small"
              style="width: 200px"
              :disabled="item.disabled"
              placeholder="可选设置"
            />
            <el-button size="small" type="danger" @click="doEditorSpider(item)">修改</el-button>
            <el-button size="small" type="primary" @click="saveSpiderSetting(item)">保存</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getList, saveSetting } from '@/api/spider-setting'
import SpiderStatusCard from './components/SpiderStatusCard.vue'
export default {
  components: {
    SpiderStatusCard
  },
  data() {
    return {
      systemSetting: [],
      spiderSetting: [],
      editorSystem: true,
      editorSpider: true
    }
  },
  mounted() {
    this.getSpiderSettingList()
  },
  methods: {
    getSpiderSettingList() {
      this.spiderSetting = []
      getList().then(response => {
        const res = response.data
        for (const item of res.datas[0]) {
          item.disabled = true
          item.new = ''
          this.spiderSetting.push(item)
        }
      })
    },
    doEditorSystem() {
      this.editorSystem = !this.editorSystem
    },
    doEditorSpider(item) {
      item.disabled = !item.disabled
    },
    saveSpiderSetting(item) {
      item.settingValue = item.new
      saveSetting(item).then(response => {
        const res = response.data
        if (res.datas[0] === true) {
          this.$message.success('保存设置成功！')
        } else {
          this.$message.error('保存失败！稍后重试')
        }
        item.new = ''
      })
      item.disabled = true
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
