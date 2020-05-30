<template>
  <div class="app-container">
    <div class="aside warning-title">
      <span>请注意，部分设置仅在重启后生效</span>
    </div>
    <el-card>
      <div slot="header">全局系统设置</div>
      <div>
        <el-row :gutter="5">
          <el-col v-for="item in systemSetting" :key="item.key" :span="12">
            <el-tag type="success">{{ item.key }}</el-tag>：当前：
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      systemSetting: []
    }
  },
  mounted() {
    this.getSpiderSettingList()
  },
  methods: {
    doEditorSystem() {
      this.editorSystem = !this.editorSystem
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
