<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="bugReportsQuery.isFixed" placeholder="是否修复" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in isFixedOptions"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="bugReports"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-card class="box-card">
              <el-form-item label="bug内容">
                <span>{{ props.row.text }}</span>
              </el-form-item>
            </el-card>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="300" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前路径" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.currentPath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否修复" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isFixed === 0? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.isFixed === 0"
            size="mini"
            type="primary"
            @click="currentRow = row, currentIndex = $index, dialogVisible = true"
          >标记为已修复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="bugReportsQuery.page"
      :limit.sync="bugReportsQuery.limit"
      @pagination="getBugReports"
    />

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定标记此bug为已修复？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="updateBugFixStatus">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchBugReportList, updateBugFixed } from '@/api/system'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'CheckLog',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      isFixedOptions: [
        { name: '未修复', value: 0 },
        { name: '已修复', value: 1 }
      ],
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      bugReports: null,
      total: 0,
      listLoading: true,
      bugReportsQuery: {
        page: 1,
        limit: 10,
        sort: undefined,
        isFixed: undefined
      }
    }
  },
  created() {
    this.getBugReports()
  },
  methods: {
    parseTime,
    getBugReports() {
      this.listLoading = true
      fetchBugReportList(this.bugReportsQuery).then(response => {
        const res = response.data
        this.bugReports = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.bugReportsQuery.page = 1
      this.getBugReports()
    },
    clearFilter() {
      this.bugReportsQuery = {
        page: 1,
        limit: 10,
        sort: undefined,
        isFixed: undefined
      }
      this.getBugReports()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'reportTime') {
        this.bugReportsQuery.sort = order
        this.handleFilter()
      }
    },
    updateBugFixStatus() {
      updateBugFixed(this.currentRow.id).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }
        this.currentRow.isFixed = 1
      })
    }
  }
}
</script>

<style scoped>

</style>
