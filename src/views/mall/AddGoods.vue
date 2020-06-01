<template>
  <div id="app-container">
    <div class="goods-content">
      <el-card class="box-card">
        <el-form ref="goodsInfo" :rules="addGoodsRules" :model="goodsInfo" label-width="100px">
          <el-form-item label="商品名称" prop="name">
            <el-input ref="inputName" v-model="goodsInfo.name" />
          </el-form-item>
          <el-form-item label="ACB">
            <el-input-number v-model="goodsInfo.cost" :min="1" />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input-number v-model="goodsInfo.stock" :min="1" />
          </el-form-item>
          <el-form-item label="限购数量">
            <el-input-number v-model="goodsInfo.buyLimit" :disabled="buyLimitStatus.value" :min="-1" />
            <el-switch
              v-model="buyLimitStatus.value"
              active-color="#ff4949"
              inactive-color="#13ce66"
              @change="buyLimitStatus.name = buyLimitStatus.value ? '不限购' : '限购'"
            />
            {{ buyLimitStatus.name }}
          </el-form-item>
          <el-form-item label="认证限购">
            <el-select v-model="goodsInfo.buyVerifyLimit">
              <el-option
                v-for="item in buyVerifyLimitOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否虚拟商品">
            <el-switch
              v-model="goodsInfo.goodsType"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch
              v-model="goodsInfo.visible"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="商品封面" prop="pictureUrl">
            <uploadPicture @getPictureUrl="getPictureUrl"/>
          </el-form-item>
          <el-form-item label="商品描述">
            <div class="text item">
              <Tinymce ref="editor" v-model="goodsInfo.description" :height="400" />
            </div>
          </el-form-item>
          <el-form-item class="form-button">
            <el-button type="primary" @click="ceateGoods(goodsInfo)">提交</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { createGoods } from '@/api/mall'
import Tinymce from '@/components/Tinymce'
import uploadPicture from '@/components/Upload/uploadPicture'

export default {
  name: 'AddGoods',
  components: { Tinymce, uploadPicture },
  data() {
    return {
      file: '',
      imgUrl: '',
      pictureLoading: false,
      pictureDialogVisible: false,
      buyVerifyLimitOptions: [
        { name: '所有人均可购买', value: 1 },
        { name: '校内人员可购买', value: 2 },
        { name: '协会成员可购买', value: 3 },
        { name: '现役队员可购买', value: 4 }
      ],
      buyLimitStatus: { name: '不限购', value: true },
      goodsInfo: {
        id: '',
        goodsID: '',
        name: '',
        cost: '',
        stock: '',
        goodsType: false,
        buyLimit: 100,
        buyVerifyLimit: 1,
        visible: true,
        pictureUrl: '',
        description: '',
        shelfUser: ''
      },
      addGoodsRules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'change' }
        ],
        pictureUrl: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    ceateGoods() {
      this.$refs.goodsInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          this.goodsInfo.visible = this.goodsInfo.visible ? 1 : 0
          this.goodsInfo.buyLimit = this.buyLimitStatus.value ? -1 : this.goodsInfo.buyLimit // true为不限购，false则为限购数量
          this.goodsInfo.goodsType = this.goodsInfo.goodsType ? 1 : 0
          this.goodsInfo.shelfUser = store.getters.name
          createGoods(this.goodsInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            }
            this.goBack()
          })
        } else {
          this.$nextTick(_ => {
            this.$refs.inputName.$refs.input.focus()
          })
          return false
        }
      })
    },
    getPictureUrl(val) {
      this.goodsInfo.pictureUrl = val
    },
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    },
    beforeRouteLeave(to, from, next) {
      this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        // 如果取消跳转地址栏回退到之前位置
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style scoped>
  .goods-content {
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
