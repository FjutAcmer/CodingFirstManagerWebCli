<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="judgesQuery.username"
        placeholder="用户"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="judgesQuery.problemId"
        placeholder="题目ID"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="judgesQuery.result"
        placeholder="结果"
        filterable
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in resultOption"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        />
      </el-select>
      <el-select
        v-model="judgesQuery.language"
        placeholder="语言"
        filterable
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in languageOption"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">查看所有</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="judges"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="180" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="题目ID" width="120" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.problemId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="评测结果" width="200" align="center">
        <template slot-scope="{row}">
          <el-button :type="resultType(row)" size="mini" plain>
            <span>{{ row.result }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="语言" width="100" align="center">
        <template slot-scope="{row}">
          <el-link>{{ row.language }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="耗时" w idth="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timeUsed }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用内存" w idth="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.memoryUsed }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码长" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.codeLength }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="submitTime" width="200" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.submitTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作菜单
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getDetail(row)">查看代码</el-dropdown-item>
              <el-dropdown-item @click.native="getResultInfo(row)">查看评测信息</el-dropdown-item>
              <el-dropdown-item @click.native="reJudge(row, $index)">重判</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="judgesQuery.page"
      :limit.sync="judgesQuery.limit"
      @pagination="getJudges"
    />

    <el-dialog title="查看代码" :visible.sync="codeDialogVisible" width="50%">
      <el-card class="box-card">
        <div class="code-content">
          <pre>{{ judgeInfo.code }}</pre>
        </div>
      </el-card>
    </el-dialog>

    <el-dialog title="评测信息" :visible.sync="resultDialogVisible" width="50%">
      <el-card class="box-card">
        <el-form>
          <el-form-item label="提交时间">
            <span>{{ parseTime(resultInfo.time) }}</span>
          </el-form-item>
          <el-form-item label="测评信息">
            <span>{{ resultInfo.info }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

  </div>
</template>

<script>
import { fetchJudgeInfo, fetchJudgeList, getJudgeResult, submitJudge } from '@/api/judge'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'JudgeList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      codeDialogVisible: false,
      judges: null,
      judgeInfo: [],
      resultInfo: '',
      resultDialogVisible: false,
      total: 0,
      languageOption: [
        { name: 'G++', value: 0 },
        { name: 'GCC', value: 1 },
        { name: 'JAVA', value: 2 },
        { name: 'Python2', value: 3 },
        { name: 'G++11', value: 4 },
        { name: 'GCC11', value: 5 },
        { name: 'VC++', value: 6 },
        { name: 'C#', value: 7 },
        { name: 'GO 1.8', value: 8 },
        { name: 'JavaScript', value: 9 },
        { name: 'Pascal', value: 10 }
      ],
      resultOption: [
        { name: 'Pending', value: 0 },
        { name: 'Accepted', value: 1 },
        { name: 'Wrong Answer', value: 2 },
        { name: 'Compilation Error', value: 3 },
        { name: 'Runtime Error', value: 4 },
        { name: 'Time Limit Exceeded', value: 5 },
        { name: 'Memory Limit Exceeded', value: 6 },
        { name: 'Output Limit Exceeded', value: 7 },
        { name: 'Presentation Error', value: 8 },
        { name: 'System Error', value: 9 },
        { name: 'Running', value: 10 },
        { name: 'Submit Error', value: 11 },
        { name: 'Judging', value: 12 },
        { name: 'Score', value: 13 }
      ],
      code: '',
      listLoading: true,
      judgesQuery: {
        page: 1,
        limit: 10,
        sort: undefined,
        problemId: undefined,
        username: undefined,
        result: undefined,
        language: undefined
      },
      rules: {}
    }
  },
  created() {
    this.getJudges()
  },
  methods: {
    parseTime,
    async getJudges() {
      this.listLoading = true
      if (this.$route.query.id !== '') {
        this.judgesQuery.contestId = this.$route.query.id
      }
      fetchJudgeList(this.judgesQuery).then(response => {
        const res = response.data
        this.judges = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getDetail(row) {
      this.listLoading = true
      fetchJudgeInfo(row.id).then(response => {
        const res = response.data
        this.judgeInfo = res.datas[0]
        this.listLoading = false
      })
      this.codeDialogVisible = true
    },
    getResultInfo(row) {
      this.listLoading = true
      getJudgeResult(row.id).then(response => {
        const res = response.data
        const temp = res.datas[0]
        this.resultInfo = temp[0]
        this.listLoading = false
      })
      this.resultDialogVisible = true
    },
    reJudge(row) {
      fetchJudgeInfo(row.id).then(response => {
        const res = response.data
        this.code = res.datas[0].code
      })
      this.listLoading = true
      const data = {
        problemId: row.problemId,
        language: row.language,
        contestId: row.contestId,
        username: row.username,
        code: this.code
      }
      submitJudge(data).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$message({
            title: '成功',
            message: '提交完成',
            type: 'success',
            duration: 2000
          })
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.judgesQuery.page = 1
      this.getJudges()
    },
    clearFilter() {
      this.judgesQuery = {
        page: 1,
        limit: 10,
        sort: undefined,
        problemId: undefined,
        nickName: undefined,
        result: undefined,
        language: undefined
      }
      this.getJudges()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'submitTime') {
        this.judgesQuery.sort = order
        this.handleFilter()
      }
    },
    resultType(row) {
      console.log(row.resultType)
      if (row.result === 'Accepted') {
        return 'success'
      } else if (
        row.result === 'Complication Error' ||
        row.result === 'Presentation Error' ||
        row.result === 'Runtime Error' ||
        row.result === 'Wrong Answer' ||
        row.result === 'Time Limit Exceeded' ||
        row.result === 'Memory Limit Exceeded' ||
        row.result === 'Output Limit Exceeded'
      ) {
        return 'danger'
      } else {
        return 'warning'
      }
    },
    goJudgeDetail(row) {
      this.$router.push({
        path: '/judge/judgeDetail',
        query: { id: row.judgeID }
      })
    }
  }
}
</script>
