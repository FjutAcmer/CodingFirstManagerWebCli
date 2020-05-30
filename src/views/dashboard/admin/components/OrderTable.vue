<template>
  <el-table :data="orders" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单ID" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.id }}
      </template>
    </el-table-column>
    <el-table-column label="ACB" width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.realCost }}
      </template>
    </el-table-column>
    <el-table-column label="用户名" width="200" align="center">
      <template slot-scope="scope">
        {{ scope.row.orderUser }}
      </template>
    </el-table-column>
    <el-table-column label="下单时间" width="200" align="center">
      <template slot-scope="scope">
        {{ parseTime(scope.row.orderTime) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchOrderList } from '@/api/mall'
import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      orders: null,
      orderQuery: {
        page: 1,
        limit: 10,
        sort: 'descending',
        orderStatus: 0
      }
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    parseTime,
    getOrders() {
      fetchOrderList(this.orderQuery).then(response => {
        const res = response.data
        this.orders = res.datas[0]
      })
    },
    statusType(orderStatus) {
      let type = ''
      if (orderStatus === '订单取消') {
        type = 'danger'
      } else if (orderStatus === '待确认' || orderStatus === '待发货') {
        type = 'warning'
      } else if (orderStatus === '订单完成') {
        type = 'success'
      } else {
        type = 'primary'
      }
      return type
    }
  }
}
</script>
