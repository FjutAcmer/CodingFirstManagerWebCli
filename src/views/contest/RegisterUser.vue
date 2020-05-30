<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="reviewQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="reviews"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="300" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="报名时间" width="220" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.registerTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" width="220" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.reviewTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核信息" width="350" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reviewInfo === '' ? '无' : row.reviewInfo }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="reviewQuery.page" :limit.sync="reviewQuery.limit" @pagination="getReviews" />

  </div>
</template>

<script>
import { fetchContestReviews} from '@/api/contest'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'RegisterReview',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      reviewStatus: undefined,
      dialogVisible: false,
      reviews: null,
      total: 0,
      listLoading: true,
      reviewQuery: {
        page: 1,
        limit: 10,
        sort: undefined,
        username: undefined,
        reviewStatus: 1,
        contestId: undefined
      }
    }
  },
  created() {
    this.getReviews()
  },
  methods: {
    parseTime,
    getReviews() {
      this.listLoading = true
      this.reviewQuery.contestId = this.$route.query.id
      fetchContestReviews(this.reviewQuery).then(response => {
        const res = response.data
        this.reviews = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.reviewQuery.page = 1
      this.getReviews()
    },
    clearFilter() {
      this.reviewQuery = {
        page: 1,
        limit: 10,
        sort: undefined,
        username: undefined,
        contestId: undefined,
        reviewStatus: 1
      }
      this.getReviews()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.contestsQuery.sort = order
        this.handleFilter()
      }
    }
  }
}
</script>
