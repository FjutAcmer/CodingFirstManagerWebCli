<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userTitleQuery.name" placeholder="标签名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="clearFilter">
        查看所有
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
        添加称号
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="userTitle"
      fit
      highlight-current-row
      style="width: 98%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="称号" width="400" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200" align="center">
        <template slot-scope="{row}">
          <el-image
            style="width: 140px; height: 140px"
            :src="row.pictureUrl"
          />
        </template>
      </el-table-column>
      <el-table-column label="获得时间" width="250" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.obtainTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" width="250" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expireTime ? parseTime(row.expireTime) : '永久' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="currentRow = row, currentIndex = $index, removeDialogVisible = true">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="userTitleQuery.page" :limit.sync="userTitleQuery.limit" @pagination="getUserTitle" />

    <el-dialog
      title="提示"
      :visible.sync="removeDialogVisible"
      width="30%"
    >
      <span>确定移除该称号？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeDialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleRemove">是</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加称号" :visible.sync="addDialogVisible">
      <el-form ref="addTitle" :model="addTitleTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="称号ID" prop="titleID">
          <el-select v-model="addTitleTemp.titleId" placeholder="请输入或选择" filterable clearable class="filter-item" style="width: 150px">
            <el-option
              v-for="item in titleList"
              :key="item.id"
              :value="item.id"
              :table="item.name"
              @change.native="selectedTitle = item"
            />
          </el-select>
        </el-form-item>
        <el-table :data.sync="selectedTitle" fit highlight-current-row style="width: 98%;">
          <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" width="120" align="center">
            <template slot-scope="{row}">
              <span>{{ row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="过期时间" width="380" align="center">
            <template slot-scope="{row}">
              <span>{{ row.lifeTime === -1 ? '永久' : row.lifeTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addTitle">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserTitle, removeTitle, addTitle } from '@/api/user'
import { fetchAllTitle } from '@/api/title'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'UserTitle',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      currentRow: '',
      currentIndex: '',
      selectedTitle: '',
      userTitle: null,
      titleList: null,
      total: 0,
      listLoading: true,
      userTitleQuery: {
        page: 1,
        limit: 20,
        sort: undefined,
        username: this.$route.query.username,
        name: undefined
      },
      removeDialogVisible: false,
      addDialogVisible: false,
      addTitleTemp: {
        id: '',
        username: '',
        titleId: '',
        obtainTime: '',
        expireTime: ''
      },
      rules: {
      }
    }
  },
  created() {
    this.getUserTitle()
  },
  methods: {
    parseTime,
    getUserTitle() {
      this.listLoading = true
      fetchUserTitle(this.userTitleQuery).then(response => {
        const res = response.data
        this.userTitle = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getTitleList() {
      this.listLoading = true
      fetchAllTitle().then(response => {
        const res = response.data
        this.titleList = res.datas[0]
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.addTitleTemp.titleId = ''
    },
    handleFilter() {
      this.userTitleQuery.page = 1
      this.getUserTitle()
    },
    clearFilter() {
      this.userTitleQuery = {
        page: 1,
        limit: 20,
        sort: undefined,
        username: this.$route.query.username,
        name: undefined
      }
      this.getUserTitle()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.titleQuery.sort = order
        this.handleFilter()
      }
    },
    handleAdd() {
      this.resetTemp()
      this.addDialogVisible = true
      this.getTitleList()
      this.$nextTick(() => {
        this.$refs['addTitle'].clearValidate()
      })
    },
    addTitle() {
      this.$refs['addTitle'].validate((valid) => {
        if (valid) {
          this.addTitleTemp.username = this.userTitleQuery.username
          console.log('fgrr')
          console.log(this.userTitleQuery.username)
          addTitle(this.addTitleTemp).then(response => {
            this.addDialogVisible = false
            const res = response.data
            if (res.code === 10000) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            }
            this.userTitle.unshift(this.addTitleTemp)
          })
        }
      })
    },
    handleRemove() {
      this.removeDialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      removeTitle(row.id).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '移除成功',
            type: 'success',
            duration: 2000
          })
          this.userTitle.splice(index, 1)
        }
      })
    }
  }
}
</script>
