<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="adminQuery.username"
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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleAddAdmin"
      >新增管理员</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="admins"
      border
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
      <el-table-column label="用户名" width="439" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" @click="getUserDetail(row)">{{ row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="拥有权限" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.permissionNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权为管理员时间" width="300" align="center">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.grantTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleGrantPermission(row)">修改权限</el-button>
          <el-button type="danger" size="mini" @click="handleRevokeAdmin(row)">移除管理员</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="adminQuery.page"
      :limit.sync="adminQuery.limit"
      @pagination="getAdmins"
    />

    <el-dialog title="管理权限" :visible.sync="permissionDialogVisible">
      <el-form
        ref="permissionTemp"
        :model="permissionTemp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="username">
          <span>{{ permissionTemp.username }}</span>
        </el-form-item>
        <el-form-item label="权限列表" prop="username">
          <el-checkbox
            v-model="checkAllPermission"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group
            v-model="permissionTemp.checkedPermissions"
            @change="handleCheckedPermissionChange"
          >
            <template v-for="(item,key) in permissionTypes">
              <el-checkbox
                v-if="item.id !== 0"
                :key="key"
                :label="item.id"
              >{{ item.permissionName }}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePermission()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="revokeAdminDialogVisible" width="30%">
      <span>确定取消该用户管理员权限？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revokeAdminDialogVisible = false">否</el-button>
        <el-button type="primary" @click="removeAdmin">是</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增管理员" :rule="addAdminRules" :visible.sync="grantAdminDialogVisible">
      <el-form
        ref="addAdmin"
        :model="addAdminTemp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addAdminTemp.username" @keyup.enter.native="addAdmin" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantAdminDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAdmin">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import {
  fetchAdminList,
  updatePermission,
  grantAdmin,
  revokeAdmin,
  fetchAdminPermission,
  fetchPermissionType
} from '@/api/permission'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'PermissionManager',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      permissionDialogVisible: false,
      revokeAdminDialogVisible: false,
      grantAdminDialogVisible: false,
      checkAllPermission: false, // 多选框是否全选
      isIndeterminate: true, // 是否继续可选
      currentRow: '',
      currentIndex: '',
      permissionTypes: [], // 所有权限
      userPermissions: null, // 用户所拥有的权限
      admins: null,
      total: 0,
      listLoading: true,
      adminQuery: {
        page: 1,
        limit: 10,
        sort: undefined,
        username: undefined
      },
      permissionTemp: {
        username: '',
        granter: store.getters.name,
        checkedPermissions: [] // 已选权限
      },
      addAdminTemp: {
        username: '',
        granter: store.getters.name
      },
      addAdminRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getAdmins()
    this.getPermissionTypes()
  },
  methods: {
    parseTime,
    getAdmins() {
      this.listLoading = true
      fetchAdminList(this.adminQuery).then(response => {
        const res = response.data
        this.admins = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getPermissionTypes() {
      this.listLoading = true
      fetchPermissionType().then(response => {
        const res = response.data
        this.permissionTypes = res.datas[0]
        this.listLoading = false
      })
    },
    getUserPermissions(username) {
      this.listLoading = true
      fetchAdminPermission(username).then(response => {
        const res = response.data
        this.userPermissions = res.datas[0]
        this.listLoading = false
      })
    },
    handleFilter() {
      this.adminQuery.page = 1
      this.getAdmins()
    },
    clearFilter() {
      this.adminQuery = {
        page: 1,
        limit: 10,
        sort: undefined,
        username: undefined
      }
      this.getAdmins()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'grantTime') {
        this.adminQuery.sort = order
        this.handleFilter()
      }
    },
    resetGrantPermissionTemp() {
      this.permissionTemp.username = ''
      this.permissionTemp.granter = store.getters.name
      this.permissionTemp.checkedPermissions = []
    },
    resetAddAdminTemp() {
      this.addAdminTemp = {
        username: '',
        granter: store.getters.name
      }
    },
    handleGrantPermission(row) {
      this.listLoading = true
      this.resetGrantPermissionTemp()
      fetchAdminPermission(row.username).then(response => {
        const res = response.data
        this.userPermissions = res.datas[0]
        this.listLoading = false
        this.currentRow = row
        this.permissionDialogVisible = true
        this.permissionTemp.username = row.username
        for (let i = 0; i < this.userPermissions.length; i++) {
          // 将用户已有权限添加到checked的列表中
          this.permissionTemp.checkedPermissions.push(
            this.userPermissions[i].permissionId
          )
        }
      })
      this.$nextTick(() => {
        this.$refs['permissionTemp'].clearValidate()
      })
    },
    changePermission() {
      this.listLoading = true
      this.permissionTemp.checkedPermissions.push(0) // 加上管理员权限
      updatePermission(this.permissionTemp).then(response => {
        const res = response.data
        this.permissionDialogVisible = false
        if (res.code === 10000) {
          this.$notify({
            message: '权限更改成功',
            type: 'success'
          })
        }
        this.getAdmins()
      })
    },
    handleAddAdmin() {
      this.resetAddAdminTemp()
      this.grantAdminDialogVisible = true
      this.$nextTick(() => {
        this.$refs['addAdmin'].clearValidate()
      })
    },
    addAdmin() {
      this.$refs['addAdmin'].validate(valid => {
        if (valid) {
          this.listLoading = true
          grantAdmin(this.addAdminTemp).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$notify({
                title: '成功',
                message: '授权成功',
                type: 'success',
                duration: 2000
              })
            }
            this.grantAdminDialogVisible = false
            this.getAdmins()
          })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    },
    handleRevokeAdmin(row) {
      this.revokeAdminDialogVisible = true
      this.currentRow = row
    },
    removeAdmin() {
      this.listLoading = true
      revokeAdmin(this.currentRow.username).then(response => {
        const res = response.data
        this.revokeAdminDialogVisible = false
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '取消成功',
            type: 'success',
            duration: 2000
          })
        }
        this.getAdmins()
      })
    },
    handleCheckAllChange(val) {
      const allPermissions = []
      if (val) {
        for (let i = 0; i < this.permissionTypes.length; i++) {
          // 将用户已有权限添加到checked的列表中
          allPermissions.push(this.permissionTypes[i].id)
        }
        this.permissionTemp.checkedPermissions = allPermissions
      } else {
        this.permissionTemp.checkedPermissions = []
      }
      this.isIndeterminate = false
    },
    handleCheckedPermissionChange(value) {
      const checkedCount = value.length
      // 已选中项等于总选项的长度则设为全选
      this.checkAllPermission = checkedCount === this.permissionTypes.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.permissionTypes.length
    }
  }
}
</script>
