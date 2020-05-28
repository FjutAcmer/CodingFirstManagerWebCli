<template>
  <div id="app-container">
    <div class="honor-content">
      <el-card class="box-card">
        <el-form ref="honorInfo" label-positon="left" :rules="addHonorRules" :model="honorInfo" label-width="120px">
          <el-form-item label="队员1" prop="realNameOne">
            <el-input ref="inputRealNameOne" v-model="honorInfo.realNameOne" show-word-limit placeholder="姓名" maxlength="10"  style="width: 300px" />
            <el-input v-model="honorInfo.usernameOne" placeholder="用户名" show-word-limit maxlength="30" style="width: 300px" />
          </el-form-item>
          <el-form-item label="队员2">
            <el-input ref="inputRealNameTwo" v-model="honorInfo.realNameTwo" show-word-limit placeholder="姓名" maxlength="10" style="width: 300px" />
            <el-input v-model="honorInfo.usernameTwo" placeholder="用户名" show-word-limit maxlength="30" style="width: 300px" />
          </el-form-item>
          <el-form-item label="队员3">
            <el-input ref="inputRealNameThree" v-model="honorInfo.realNameThree" show-word-limit placeholder="姓名" maxlength="10" style="width: 300px" />
            <el-input v-model="honorInfo.usernameThree" placeholder="用户名" maxlength="30" show-word-limit style="width: 300px" />
          </el-form-item>
          <el-form-item label="比赛级别">
            <el-select v-model="honorInfo.contestLevel">
              <el-option
                v-for="item in contestLevel"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="奖项级别">
            <el-select v-model="honorInfo.awardLevel">
              <el-option
                v-for="item in awardLevel"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item ref="registerTime" label="报名时间" prop="registerTime">
            <el-date-picker v-model="honorInfo.registerTime" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
          <el-form-item ref="rewardDate" label="获奖日期" prop="rewardDate">
            <el-date-picker v-model="honorInfo.rewardDate" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="honorInfo.description" maxlength="20" show-word-limit style="width: 800px" />
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="updateHonor">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { updateHonor, fetchHonor } from '@/api/rank'

export default {
  name: 'EditHonor',
  data() {
    return {
      awardLevel: [
        { name: '无奖项', value: -2 },
        { name: '顽强拼搏奖', value: -1 },
        { name: '优秀奖/鼓励奖', value: 0 },
        { name: '铜奖', value: 1 },
        { name: '银奖', value: 2 },
        { name: '金奖', value: 3 },
        { name: '一等奖', value: 4 },
        { name: '二等奖', value: 5 },
        { name: '三等奖', value: 6 }
      ],
      contestLevel: [
        { name: '其他、不显示在奖项列表中', value: -1 },
        { name: 'ACM省赛', value: 0 },
        { name: 'ACM/ICPC区域赛', value: 1 },
        { name: 'EC-Final', value: 2 },
        { name: '世界总决赛', value: 3 },
        { name: '全国蓝桥杯大赛', value: 4 },
        { name: 'ACM全国邀请赛', value: 5 },
        { name: '全国大学生程序设计竞赛', value: 6 }
      ],
      honorInfo: {
        usernameOne: '',
        usernameTwo: '',
        usernameThree: '',
        realNameOne: '',
        realNameTwo: '',
        realNameThree: '',
        registerTime: '',
        rewardDate: '',
        description: '',
        contestLevel: '',
        awardLevel: ''
      },
      addHonorRules: {
        registerTime: [
          { required: true, message: '报名时间不能为空', trigger: 'change' }
        ],
        rewardDate: [
          { required: true, message: '获奖日期不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getHonorInfo()
  },
  methods: {
    parseTime,
    getHonorInfo() {
      fetchHonor(this.$route.query.id).then(response => {
        const res = response.data
        this.honorInfo = res.datas[0]
      })
    },
    updateHonor() {
      this.$refs.honorInfo.validate(valid => {
        if (valid) {
          updateHonor(this.honorInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
            this.goBack()
          })
        } else {
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
  .honor-content {
    width: 1000px;
    margin-top: 30px;
    margin-left: 30px;
  }
  .box-card {
    width: 1200px;
    margin-top: 30px;
    margin-left: 30px;
  }
  .form-button {
    float: right;
  }
</style>
