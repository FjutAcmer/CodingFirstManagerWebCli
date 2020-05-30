<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="来源站点"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        placeholder="源题目ID"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        placeholder="爬虫任务"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-input
        placeholder="执行爬虫"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />-->
      <el-input
        v-model="problemsQuery.title"
        placeholder="标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="problemsQuery.isLocalized"
        placeholder="本地化状态"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      >
        <el-option key="1" label="已本地化" value="1" />
        <el-option key="2" label="未本地化" value="2" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">查看所有</el-button>
      <el-button class="filter-item" type="danger" @click="toGetProblem()">爬取题目</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="problems"
      border
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="临时题目ID" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源站点" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fromWebsite }}</span>
        </template>
      </el-table-column>
      <el-table-column label="源题目ID" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.problemId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="爬虫任务ID" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.spiderJob }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行爬虫" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.spiderName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="爬取时间" width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ new Date(row.insertTime).toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="goProblemDetail(row)">{{ row.problemTitle }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isLocalized==='1'?'已本地化':'未本地化' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="success" @click="toLocalized(row)">本地化</el-button>
          <el-button size="mini" type="warning" @click="toSim(row)">查重</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="currentRow = row, currentIndex = $index, dialogVisible = true"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="problemsQuery.page"
      :limit.sync="problemsQuery.limit"
      @pagination="getProblems"
    />

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定删除本题目？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="deleteProblem">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/spider-problem'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'TempProblems',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      dialogVisible: false,
      problems: [{}, {}, {}],
      total: 0,
      tags: null,
      listLoading: false,
      problemsQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined,
        isLocalized: undefined
      }
    }
  },
  created() {
    this.getProblems()
  },
  methods: {
    toLocalized(row) {
      this.$router.push({
        name: 'ProblemLocalized',
        query: {
          id: row.id
        }
      })
    },
    toSim(row) {
      this.$router.push({
        name: 'SimProblem',
        query: {
          id: row.id
        }
      })
    },
    toGetProblem() {
      this.$router.push({
        name: 'GetProblems'
      })
    },
    getProblems() {
      this.listLoading = true
      getList(this.problemsQuery).then(response => {
        const res = response.data
        this.problems = res.datas[0]
        this.total = res.datas[1]
        this.listLoading = false
      })
    },
    handleFilter() {
      this.problemsQuery.page = 1
      this.getProblems()
    },
    clearFilter() {
      this.problemsQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        title: undefined
      }
      this.getProblems()
    },
    handleModifyStatus(row, status) {
      // this.$message({
      //   message: '操作Success',
      //   type: 'success'
      // })
      // row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      // if (order === 'ascending') {
      //   this.problemsQuery.sort = '+id'
      // } else {
      //   this.problemsQuery.sort = '-id'
      // }
      // this.handleFilter()
    },
    handleCreate() {},
    handleUpdate(row) {
      // this.$router.push({
      //   path: '/problems/EditProblems',
      //   query: { id: row.problemID }
      // })
    },
    deleteProblem() {
      // this.dialogVisible = false
      // const row = this.currentRow
      // const index = this.currentIndex
      // deleteProblem(row.problemID).then(response => {
      //   const res = response.data
      //   if (res.code === 10000) {
      //     this.$notify({
      //       title: '成功',
      //       message: '删除成功',
      //       type: 'success',
      //       duration: 2000
      //     })
      //     this.problems.splice(index, 1)
      //   }
      // })
    },
    goProblemDetail(row) {
      this.$router.push({
        name: 'TempProblemDetail',
        query: { id: row.id }
      })
    }
  }
}
</script>
