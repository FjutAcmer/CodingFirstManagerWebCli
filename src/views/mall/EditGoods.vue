<template>
  <div id="app-container">
    <div class="goods-content">
      <el-form ref="goodsInfo" :rules="editGoodsRules" :model="goodsInfo" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodsInfo.name" />
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
          <uploadPicture :img-url="goodsInfo.pictureUrl" @getPictureUrl="getPictureUrl" />
        </el-form-item>
        <el-form-item label="商品描述">
          <div class="text item">
            <Tinymce ref="editor" v-model="goodsInfo.description" :height="400" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateGoods(goodsInfo)">提交</el-button>
          <el-button @click="beforeRouteLeave">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateGoods, fetchGoods } from '@/api/mall'
import Tinymce from '@/components/Tinymce'
import uploadPicture from '@/components/Upload/uploadPicture'

export default {
  name: 'EditGoods',
  components: { Tinymce, uploadPicture },
  data() {
    return {
      pictureDialogVisible: false,
      buyVerifyLimitOptions: [
        { name: '所有人均可购买', value: 1 },
        { name: '校内人员可购买', value: 2 },
        { name: '协会成员可购买', value: 3 },
        { name: '现役队员可购买', value: 4 }
      ],
      buyLimitStatus: { name: '', value: undefined },
      goodsInfo: '',
      editGoodsRules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'change' }
        ],
        pictureUrl: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail() {
      this.listLoading = true
      const id = this.$route.query.id
      fetchGoods(id).then(response => {
        const res = response.data
        this.goodsInfo = res.datas[0]
        this.goodsInfo.visible = res.datas[0].visible === 1
        this.goodsInfo.goodsType = res.datas[0].goodsType === 1
        if (this.goodsInfo.buyLimit === -1) {
          this.buyLimitStatus.name = '不限购'
          this.buyLimitStatus.value = true
        } else {
          this.buyLimitStatus.name = '限购'
          this.buyLimitStatus.value = false
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateGoods() {
      this.$refs.goodsInfo.validate(valid => {
        if (valid) {
          this.listLoading = true
          this.goodsInfo.visible = this.goodsInfo.visible ? 1 : 0
          this.goodsInfo.buyLimit = this.buyLimitStatus.value ? -1 : this.goodsInfo.buyLimit // true为不限购，false则为限购数量
          this.goodsInfo.goodsType = this.goodsInfo.goodsType ? 1 : 0
          updateGoods(this.goodsInfo).then(response => {
            const res = response.data
            if (res.code === 10000) {
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.go(-1)
          })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    },
    getPictureUrl(val) {
      this.goodsInfo.pictureUrl = val
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
</style>
