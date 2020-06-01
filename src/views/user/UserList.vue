<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="userQuery.username"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      :data="users"
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-card class="box-card">
              <el-form-item label="手机号码">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ props.row.email }}</span>
              </el-form-item>
            </el-card>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="140" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getUserDetail(row)">{{ row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.gender===0 ? '保密':row.gender===1 ? '男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="个性签名" width="400" align="center">
        <template slot-scope="{row}">
          <span>{{ row.motto }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ACB数量" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.acb }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分值" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row}">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作菜单
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="getUserDetail(row)">统计数据</el-dropdown-item> -->
              <el-dropdown-item @click.native="handleRewardACB(row)">奖励ACB</el-dropdown-item>
              <el-dropdown-item @click.native="getCheckIn(row)">签到记录</el-dropdown-item>
              <el-dropdown-item @click.native="handleResetPsw(row)">重置密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="userQuery.page"
      :limit.sync="userQuery.limit"
      @pagination="getUsers"
    />

    <el-dialog title="奖励ACB" :visible.sync="rewardACBDialogVisible">
      <el-form
        ref="rewardACB"
        :model="rewardACBTemp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="username">
          <span>{{ rewardACBTemp.username }}</span>
        </el-form-item>
        <el-form-item label="ACB" prop="ACB">
          <el-input-number v-model="rewardACBTemp.ACB" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rewardACBDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="rewardACB()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="resetPswDialogVisible" width="30%">
      <span>确定重置该用户密码？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPswDialogVisible = false">否</el-button>
        <el-button type="primary" @click="resetPsw">是</el-button>
      </span>
    </el-dialog>

    <el-dialog title="签到记录" :visible.sync="checkInDialogVisible" width="55%">
      <el-table v-loading="listLoading" :data="checkInRecords" fit highlight-current-row>
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签到时间" width="550" align="center">
          <template slot-scope="{row}">
            <el-link type="primary">{{ parseTime(row.checkTime) }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.info }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="checkInTotal>0"
        :total="checkInTotal"
        :page.sync="checkInQuery.page"
        :limit.sync="checkInQuery.limit"
        @pagination="getCheckIn(currentRow)"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchUserList,
  updateACB,
  resetPsw,
  fetchUserCheckIn
} from '@/api/user'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import store from '@/store'
import { parseTime } from '@/utils'

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      checkInRecords: null,
      checkInDialogVisible: false,
      checkInTotal: 0,
      checkInQuery: {
        page: 1,
        limit: 10,
        username: undefined
      },
      rewardACBDialogVisible: false,
      resetPswDialogVisible: false,
      currentRow: '',
      currentIndex: '',
      users: null,
      total: 0,
      listLoading: true,
      userQuery: {
        page: 1,
        limit: 10,
        sort: undefined,
        username: undefined
      },
      rewardACBTemp: {
        id: '',
        username: '',
        ACB: '200'
      }
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    parseTime,
    getUsers() {
      this.listLoading = true
      fetchUserList(this.userQuery).then(response => {
        const res = response.data
        this.users = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.userQuery.page = 1
      this.getUsers()
    },
    clearFilter() {
      this.userQuery = {
        page: 1,
        limit: 10,
        sort: undefined,
        sortItem: undefined,
        username: undefined
      }
      this.getUsers()
    },
    sortChange(data) {
      const { prop, order } = data
      this.userQuery.sort = order
      this.userQuery.sortItem = prop
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: '',
        username: '',
        ACB: '200'
      }
    },
    handleRewardACB(row) {
      this.resetTemp()
      this.rewardACBDialogVisible = true
      this.currentRow = row
      this.rewardACBTemp.username = row.username
      this.$nextTick(() => {
        this.$refs['rewardACB'].clearValidate()
      })
    },
    rewardACB() {
      const data = {
        toUsername: this.rewardACBTemp.username,
        fromUsername: store.getters.name,
        title: '赠送ACB通知',
        text:
          '亲爱的用户' +
          this.rewardACBTemp.username +
          '，恭喜您获得' +
          this.rewardACBTemp.ACB +
          'ACB',
        ACB: this.rewardACBTemp.ACB
      }
      this.listLoading = true
      updateACB(data).then(response => {
        const res = response.data
        this.rewardACBDialogVisible = false
        if (res.code === 10000) {
          this.currentRow.acb = this.currentRow.acb + data.ACB
          this.$message({
            message: '奖励成功',
            type: 'success'
          })
        }
        this.listLoading = false
      })
    },
    getCheckIn(row) {
      this.currentRow = row
      this.listLoading = true
      this.checkInQuery.username = row.username
      fetchUserCheckIn(this.checkInQuery).then(response => {
        const res = response.data
        this.checkInRecords = res.datas[0]
        this.checkInTotal = res.datas[1]
        this.listLoading = false
      })
      this.checkInDialogVisible = true
    },
    handleResetPsw(row) {
      this.resetPswDialogVisible = true
      this.currentRow = row
    },
    resetPsw() {
      this.listLoading = true
      resetPsw(this.currentRow.username).then(response => {
        const res = response.data
        this.resetPswDialogVisible = false
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
        }
        this.getUsers()
      })
    },
    getUserTitle(row) {
      this.$router.push({
        path: '/user/userTitle',
        query: { username: row.username }
      })
    },
    getUserDetail(row) {
      this.$router.push({
        path: '/user/userDetail',
        query: { username: row.username }
      })
    }
  }
}
</script>
