<template>
  <div class="app-container">
    <el-card class="box-card discuss-content">
      <div slot="header" class="clearfix discuss-head">
        <span>{{ discussInfo.title }}</span>
      </div>
      <div class="discuss-reply">
        <el-table
          v-loading="listLoading"
          :data="discussReply"
          fit
          highlight-current-row
          style="width: 98%;"
        >
          <el-table-column align="center" width="180">
            <template slot-scope="{row}">
              <div class="user-info">
                <el-badge :value="getValue(row)" class="item" :type="getType(row)">
                  <img :src="row.avatarUrl" height="120" width="120">
                  <el-link type="primary">{{ row.author }}</el-link>
                </el-badge>
              </div>
              <div class="reply-time">
                <span>{{ parseTime(row.time) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="1020">
            <template slot-scope="{row, $index}">
              <pre>{{ row.text }}</pre>
              <el-button
                v-if="row.replyOrder !== 1"
                style="float: right;"
                type="primary"
                size="mini"
                @click="deleteDialogVisible = true, currentRow = row, currentIndex = $index"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="discussQuery.page"
          :limit.sync="discussQuery.limit"
          @pagination="getDiscussReply"
        />
      </div>
    </el-card>

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>确定删除该回复？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
        <el-button type="primary" @click="handleDelete">是</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { deleteReply, fetchDiscussReply } from '@/api/discuss'
import waves from '@/directive/waves' // waves指令
import Pagination from '@/components/Pagination' // 基于el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'DiscussionDetails',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      discussInfo: {
        id: this.$route.query.id,
        title: this.$route.query.title
      },
      deleteDialogVisible: false,
      listLoading: false,
      discussReply: null,
      replyContent: '',
      total: 0,
      discussQuery: {
        page: 1,
        limit: 10,
        id: undefined
      },
      replyDialogVisible: false
    }
  },
  created() {
    this.getDiscussReply()
  },
  methods: {
    parseTime,
    getDiscussReply() {
      this.listLoading = true
      this.discussQuery.id = this.discussInfo.id
      fetchDiscussReply(this.discussQuery).then(response => {
        const res = response.data
        this.discussReply = res.datas[0]
        this.total = res.datas[1]
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleDelete() {
      this.deleteDialogVisible = false
      const row = this.currentRow
      const index = this.currentIndex
      deleteReply(row.id).then(response => {
        const res = response.data
        if (res.code === 10000) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.total -= 1
          this.discussReply.splice(index, 1)
        }
      })
    },
    getValue(row) {
      if (row.replyOrder === 1) {
        return '发布者'
      } else {
        return row.replyOrder - 1
      }
    },
    getType(row) {
      if (row.replyOrder === 1) {
        return 'primary'
      } else {
        return 'info'
      }
    }
  }
}
</script>
<style scoped>
  .item {
    margin-top: 10px;
    margin-right: 60px;
  }
</style>
