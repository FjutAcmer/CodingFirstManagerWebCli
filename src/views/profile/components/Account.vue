<template>
  <el-form>
    <el-form-item label="用户名">
      <span>{{ user.name }}</span>
    </el-form-item>
    <el-form-item label="邮箱">
      <span>{{ user.email }}</span>
    </el-form-item>
    <el-form-item label="注册时间">
      <span>{{ parseTime(user.registerTime) }}</span>
    </el-form-item>、
  </el-form>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    parseTime
  }
}
</script>
