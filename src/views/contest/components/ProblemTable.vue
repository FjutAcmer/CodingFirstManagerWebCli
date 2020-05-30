<template>
  <el-table
    v-loading="listLoading"
    :data="problems"
    fit
    highlight-current-row
  >
    <el-table-column label="顺序" align="center" width="80">
      <template slot-scope="{row}">
        <span>{{ row.problemOrder }}</span>
      </template>
    </el-table-column>
    <el-table-column label="题目ID" width="80" align="center">
      <template slot-scope="{row}">
        <span>{{ row.problemId }}</span>
      </template>
    </el-table-column>
    <el-table-column label="标题" width="550" align="center">
      <template slot-scope="{row}">
        <el-link type="primary">{{ row.title }}</el-link>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchContestProblems } from '@/api/contest'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
export default {
  name: 'ProblemList',
  components: Pagination,
  directives: waves,
  props: {
    contestId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      problems: null,
      totalProblems: null,
      listLoading: true
    }
  },
  created() {
    this.getProblemList()
  },
  methods: {
    getProblemList() {
      this.listLoading = true
      fetchContestProblems(row.id).then(response => {
        const res = response.data
        this.problems = res.datas[0]
        this.totalProblems = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>

<style scoped>

</style>
