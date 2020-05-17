<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="titleQuery.name"
        placeholder="标签名称"
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
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加称号</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="titles"
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
      <el-table-column label="称号" width="200" align="center">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="200" align="center">
        <template slot-scope="{row}">
          <el-image style="width: 140px; height: 140px" :src="row.pictureUrl ? row.pictureUrl : indexImg" />
        </template>
      </el-table-column>
      <el-table-column label="类型" width="250" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type === 0 ? '未定义' : row.type === 0 ? '形容词' : '未定义' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拥有时长" width="250" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lifeTime === -1 ? '永久' : row.lifeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button
            size="mini"
            type="danger"
            @click="currentRow = row, currentIndex = $index, deleteDialogVisible = true"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="titleQuery.page"
      :limit.sync="titleQuery.limit"
      @pagination="getTitles"
    />

    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定删除该称号？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
        <el-button type="primary" @click="deleteTitle">是</el-button>
      </span>
    </el-dialog>

    <el-dialog ref="createTitleTemp" title="添加称号" :visible.sync="createDialogVisible">
      <el-form
        ref="createTitle"
        :model="titleTemp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        :rules="titleRules"
      >
        <el-form-item label="称号名称" label-width="80px" prop="name">
          <el-input v-model="titleTemp.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type" label-width="80px">
          <el-select v-model="titleTemp.type">
            <el-option
              v-for="item in titleTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="拥有期限" prop="lifeTime" label-width="80px">
          <el-input v-model="titleTemp.lifeTime" style="width: 260px" placeholder="请输入天数，默认永久期限">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!orderQuery.orderCancel && row.orderStatus === '待确认'"
          type="warning"
          size="mini"
          @click.native="updateOrderStatus(row,$index,1)">
          确认订单
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTitleList, deleteTitle, createTitle } from '@/api/system'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination

export default {
  name: 'TitleList',
  components: { Pagination },
  directives: { waves },
  data() {
    const validateLifeTime = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入正确的天数'))
      } else {
        callback()
      }
    }
    return {
      currentRow: '',
      currentIndex: '',
      titles: null,
      total: 0,
      indexImg: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=291872238,3072063863&fm=26&gp=0.jpg',
      listLoading: true,
      titleQuery: {
        page: 1,
        limit: 10,
        sort: undefined,
        name: undefined
      },
      titleTypeOptions: [
        { name: '未定义', value: 0 },
        { name: '形容词', value: 1 },
        { name: '名词头衔', value: 2 }
      ],
      deleteDialogVisible: false,
      createDialogVisible: false,
      updateDialogVisible: false,
      titleTemp: {
        id: '',
        type: '未定义',
        name: '',
        pictureUrl: '',
        lifeTime: ''
      },
      titleRules: {
        name: [
          { required: true, message: '称号名称不能为空', trigger: 'change' }
        ],
        lifeTime: [
          { validator: validateLifeTime, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getTitles()
  },
  methods: {
    getTitles() {
      this.listLoading = true
      fetchTitleList(this.titleQuery).then(response => {
        const res = response.data
        this.titles = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() {
      this.titleTemp = {
        id: '',
        type: 0,
        name: '',
        pictureUrl: '',
        lifeTime: ''
      }
    },
    handleFilter() {
      this.titleQuery.page = 1
      this.getTitles()
    },
    clearFilter() {
      this.titleQuery = {
        page: 1,
        limit: 10,
        sort: undefined,
        name: undefined
      }
      this.getTitles()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.titleQuery.sort = order
        this.handleFilter()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.createDialogVisible = true
      this.$nextTick(() => {
        this.$refs['createTitle'].clearValidate()
      })
    },
    createTitle() {
      this.$refs['createTitle'].validate(valid => {
        if (valid) {
          if (this.titleTemp.lifeTime === '') {
            this.titleTemp.lifeTime = -1
          }
          createTitle(this.titleTemp).then(response => {
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
            this.getUserTitle()
          })
        }
      })
    },
    deleteTitle() {
      this.deleteDialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteTitle(row.id).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.titles.splice(index, 1)
        }
      })
    }
  }
}
</script>
