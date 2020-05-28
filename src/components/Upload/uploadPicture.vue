<template>
  <el-upload
    class="picture-uploader"
    action=""
    :show-file-list="false"
    :on-change="uploadPicture"
    :before-upload="beforePictureUpload"
  >
    <img v-if="imgUrl" :src="imgUrl" class="goods-cover">
    <span v-if="imgUrl" class="el-upload-action" @click.stop="handleRemove()">
      <i class="el-icon-delete" />
    </span>
    <i v-else class="el-icon-upload2 picture-uploader-icon" />
  </el-upload>
</template>

<script>
import { uploadFile } from '@/api/upload'
export default {
  name: 'UploadPicture',
  props: {
    imgUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      file: '',
      pictureDialogVisible: false
    }
  },
  methods: {
    handleRemove() {
      this.imgUrl = ''
    },
    uploadPicture(file) {
      this.file = file.raw
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('type', 1)
      uploadFile(formData).then(response => {
        const res = response.data
        this.imgUrl = URL.createObjectURL(this.file)
        const val = this.imgUrl
        this.$emit('getPictureUrl', val)
        this.pictureDialogVisible = true
        this.$message({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    beforePictureUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('只能上传JPG或PNG格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过200KB')
      }
      return isJPG && isPNG && !isLt2M
    }
  }
}
</script>

<style scoped>
  .picture-uploader{
    width: 150PX;
    height: 150px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px dashed #d9d9d9;
  }
  .picture-uploader-icon{
    font-size: 28px;
    background-color: rgba(0, 0, 0, .3);
    color: #fff;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .picture-uploader-icon:hover{
    background-color: rgba(0, 0, 0, .5);
  }
  .goods-cover {
    position: relative;
    width: 150px;
    height: 150px;
    display: block;
  }
  .el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 120px;
  }
  .el-upload-action:hover {
    font-size: 20px;
    background-color: #000;
    background-color: rgba(0, 0, 0, .3)
  }
</style>
