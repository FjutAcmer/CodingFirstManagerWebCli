<template>
  <div id="app-container">
    <div class="message-content">
      <el-card class="box-card">
        <el-form ref="messageInfo" :rules="addMessageRules" :model="messageInfo" label-width="100px">
          <el-form-item label="用户名" prop="toUsername">
            <el-input ref="inputName" v-model="messageInfo.toUsername" style="width: 300px" :min="1" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input ref="inputTitle" v-model="messageInfo.title" />
          </el-form-item>
          <el-form-item label="内容" prop="text">
            <el-input v-model="messageInfo.text" type="textarea" rows="10" :min="1" />
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="addMessage(messageInfo)">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { createMessage } from '@/api/system'
export default {
  name: 'AddMessage',
  data() {
    return {
      messageInfo: {
        id: '',
        toUsername: '',
        fromUsername: store.getters.name,
        title: '',
        text: '',
        time: '',
        status: 0
      },
      addMessageRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'change' }
        ],
        toUsername: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addMessage() {
      this.$refs.messageInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          createMessage(this.messageInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '发送通知成功',
                type: 'success',
                duration: 2000
              })
            }
            this.goBack()
          })
        } else {
          this.$nextTick(_ => {
            if (this.messageInfo.toUsername === '') {
              this.$refs.inputName.$refs.input.focus()
            } else {
              this.$refs.inputTitle.$refs.input.focus()
            }
          })
          return false
        }
      })
    },
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

  .box-card {
    width: 1200px;
    margin-top: 30px;
    margin-left: 30px;
  }
</style>
