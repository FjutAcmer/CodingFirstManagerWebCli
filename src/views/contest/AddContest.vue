<template>
  <div id="app-container">
    <div class="contest-content">
      <el-card class="box-card">
        <el-form ref="contestInfo" label-positon="left" :rules="addContestRules" :model="contestInfo" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input ref="inputTitle" v-model="contestInfo.title" style="width: 1000px" />
          </el-form-item>
          <el-form-item label="比赛起止时间">
            <el-date-picker
              ref="contestBeginEndTime"
              v-model="contestBeginEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="checkTime"
            />
          </el-form-item>
          <el-form-item label="报名类型">
            <el-select v-model="contestInfo.permissionType">
              <el-option
                v-for="item in permissionOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="报名起止时间">
            <el-date-picker
              ref="registerBeginEndTime"
              v-model="registerBeginEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="checkTime"
            />
          </el-form-item>
          <el-form-item label="种类">
            <el-select v-model="contestInfo.contestKind">
              <el-option value="练习" />
              <el-option value="积分" />
              <el-option value="趣味" />
              <el-option value="正式" />
              <el-option value="自定义" />
            </el-select>
          </el-form-item>
          <el-form-item label="题目列表" prop="problems">
            <el-tag
              v-for="tag in contestInfo.problems"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              placeholder="请输入题目ID"
              filterable
              clearable
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 题目ID</el-button>
          </el-form-item>
          <el-form-item label="描述">
            <div class="text item">
              <Tinymce ref="editor" v-model="contestInfo.description" :width="1000" :height="400" />
            </div>
          </el-form-item>
          <el-form-item label="封榜时间" placeholder="分钟">
            <el-input-number v-model="rankEndTime" :min="0" /> 分钟
          </el-form-item>
          <el-form-item>
            <el-checkbox
              :value="contestInfo.computerRating===1"
              @change="value ? contestInfo.computerRating === 1 : contestInfo.problemPutTag === 0"
            >
              是否计算rating
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              :value="contestInfo.problemPutTag===1"
              @change="value ? contestInfo.problemPutTag === 1 : contestInfo.problemPutTag === 0"
            >
              内部题目是否可以直接贴标签
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="computerGlobalCommit">计算排名时，是否把全局的提交也计算入内</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="registerCompleteInfo">注册是否需要完整的个人信息</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              :value="contestInfo.showOtherStatus===1"
              @change="value ? contestInfo.showOtherStatus === 1 : contestInfo.problemPutTag === 0"
            >
              是否隐藏其他人的提交
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              :value="contestInfo.showBorderList===1"
              @change="value ? contestInfo.showBorderList === 1 : contestInfo.problemPutTag === 0"
            >
              是否隐藏其他人的运行时间、空间和代码长度
            </el-checkbox>
          </el-form-item>
          <el-form-item label="Rank模式">
            <el-select v-model="contestInfo.rankType">
              <el-option
                v-for="item in rankTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="罚时" placeholder="分钟">
            <el-input-number v-model="punishTime" :min="0" />  分钟
          </el-form-item>
          <el-form-item label="金奖" placeholder="%">
            <el-input-number v-model="gold" />  %
          </el-form-item>
          <el-form-item label="银奖" placeholder="%">
            <el-input-number v-model="silver" />  %
          </el-form-item>
          <el-form-item label="铜奖" placeholder="%">
            <el-input-number v-model="copper" />  %
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="createContest">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>

import { createContest } from '@/api/contest'
import { fetchAllProblems } from '@/api/problems'
import Tinymce from '@/components/Tinymce'
import { parseTime } from '@/utils'

export default {
  name: 'AddContest',
  components: { Tinymce },
  data() {
    const checkProblems = (rule, value, callback) => {
      if (value === null || value === undefined || value === '') {
        callback(new Error('请选择比赛题目'))
      } else {
        callback()
      }
    }
    return {
      contestBeginEndTime: [],
      registerBeginEndTime: [],
      inputVisible: false,
      inputValue: '',
      problemList: '',
      permissionOptions: [
        { name: '公开', value: 0 },
        { name: '密码', value: 1 },
        { name: '私有', value: 2 },
        { name: '注册', value: 3 },
        { name: '正式', value: 4 },
        { name: '组队', value: 5 }
      ],
      rankTypeOptions: [
        { name: 'ICPC', value: 0 },
        { name: 'ShortCode', value: 1 },
        { name: '练习模式', value: 2 },
        { name: '积分模式', value: 3 }
      ],
      contestInfo: {
        title: '',
        contestKind: 0,
        beginTime: '',
        endTime: '',
        registerBeginTime: '',
        registerEndTime: '',
        permissionType: '公开',
        problems: [],
        description: '',
        password: '',
        computerRating: 0,
        rankType: 0,
        problemPutTag: 0,
        statusReadOut: 0,
        showRegisterList: 0,
        showBorderList: 0,
        showOtherStatus: 0,
        createUser: ''
      },
      showRegisterOut: '',
      registerCompleteInfo: '',
      computerGlobalCommit: '',
      punishTime: '',
      rankEndTime: '',
      gold: '10',
      silver: '30',
      copper: '60',
      addContestRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'change' }
        ],
        problems: [
          { validator: checkProblems, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getProblemList()
    this.contestInfo.contestKind = this.$route.query.kind ? this.$route.query.kind : '练习'
  },
  methods: {
    parseTime,
    getProblemList() {
      this.listLoading = true
      fetchAllProblems().then(response => {
        const res = response.data
        this.problemList = res.datas[0]
      })
    },
    createContest() {
      this.$refs.contestInfo.validate(valid => {
        if (valid) {
          this.contestInfo.contestKind = this.getContestKind()
          this.contestInfo.permissionType = this.getPermissionType()
          if (this.checkTime()) {
            createContest(this.contestInfo).then(response => {
              const res = response.data
              if (res.code === 10000) {
                this.$message({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              }
              this.goBack()
            })
          } else {
            console.log('提交失败')
          }
        } else {
          this.$nextTick(_ => {
            this.$refs.inputTitle.$refs.input.focus()
          })
          return false
        }
      })
    },
    handleClose(tag) {
      this.contestInfo.problems.splice(this.contestInfo.problems.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    isProblemExist() {
      for (let i = 0; i < this.problemList.length; i++) {
        if (parseInt(this.problemList[i].problemId) === parseInt(this.inputValue)) {
          return true
        }
      }
      return false
    },
    getPermissionType() {
      const permission = this.contestInfo.permissionType
      if (permission === '公开') {
        return 0
      } else if (permission === '密码') {
        return 1
      } else if (permission === '私有') {
        return 2
      } else if (permission === '注册') {
        return 3
      } else if (permission === '正式') {
        return 4
      } else {
        return 5
      }
    },
    getContestKind() {
      const contestKind = this.contestInfo.contestKind
      if (contestKind === '练习') {
        return 0
      } else if (contestKind === '积分') {
        return 1
      } else if (contestKind === '趣味') {
        return 2
      } else if (contestKind === '正式') {
        return 3
      } else if (contestKind === '自定义') {
        return 5
      } else {
        return 4
      }
    },
    handleInputConfirm() {
      if (this.inputValue !== '') {
        if (this.isProblemExist()) {
          this.contestInfo.problems.push(this.inputValue)
          this.inputVisible = false
          this.inputValue = ''
        } else {
          this.$message({
            title: '失败',
            message: '题目不存在',
            type: 'error',
            duration: 2000
          })
        }
      } else {
        this.inputVisible = false
      }
    },
    checkTime() {
      if (this.contestBeginEndTime.length !== 0 && this.registerBeginEndTime.length !== 0 &&
        this.registerBeginEndTime[1] < this.contestBeginEndTime[0]) {
        this.contestInfo.beginTime = this.contestBeginEndTime[0]
        this.contestInfo.endTime = this.contestBeginEndTime[1]
        this.contestInfo.registerBeginTime = this.registerBeginEndTime[0]
        this.contestInfo.registerEndTime = this.registerBeginEndTime[1]
      } else {
        if (this.contestBeginEndTime.length === 0) {
          this.$message.error('请选择比赛起止时间')
          return false
        } else if (this.registerBeginEndTime.length === 0) {
          this.$message.error('请选择报名起止时间')
          return false
        } else {
          this.$message.error('报名结束时间不能晚于比赛开始时间')
        }
        return false
      }
      return true
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
    width: 1250px;
    margin-top: 30px;
    margin-left: 30px;
  }
  .form-button {
    float: right;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 200px;
    vertical-align: bottom;
  }
</style>
