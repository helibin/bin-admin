<template>
  <div class="upload-container">
    <el-upload
      ref="upload"
      :multiple="false"
      :show-file-list="false"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :auto-upload="false"
      :http-request="handleUpload"
      drag
      action="upload.action"
      accept="image/*"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip">只能上传图片，且不超过1MB</div>
      <img
        v-if="imageUrl || syncImageUrl"
        :src="imageUrl || $store.getters.env.baseURL + syncImageUrl"
        class="image-preview"
      />
      <el-button v-show="imageUrl || syncImageUrl" :plain="true" type="danger" class="change-image" size="mini"
        >更换</el-button
      >
    </el-upload>
  </div>
</template>

<script>
import * as uploadHelper from '@/utils/uploadHelper'

export default {
  name: 'SingleImageUpload',
  props: {
    uploadUrl: {
      type: String,
      default: '',
    },
    autoUpload: {
      type: Boolean,
      default: false,
    },
    syncImageUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      imageUrl: this.imageUrl,
    }
  },
  methods: {
    async handleChange(file) {
      file = file.raw
      if (file.size > 5 * 1024 * 1024) return this.$message.error('文件不得大于5MB')
      this.imageUrl = URL.createObjectURL(file)

      if (this.autoUpload && this.uploadUrl) {
        this.$refs.upload.submit()
      } else {
        this.$emit('sync', file)
      }
    },
    async handleUpload({ file }) {
      try {
        return await uploadHelper.localUpload(this.uploadUrl, { file }, this)
      } catch (ex) {
        throw ex
      }
    },
    handleSuccess(res) {
      this.$message.success(res || '恭喜你，上传成功')
      this.showProgress = false
    },
    handleError(err) {
      this.$message.error(err || '上传失败，请重新上传')
      this.showProgress = false
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.upload-container {
  width: 270px;
  .image-preview {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #fff;
  }

  .change-image {
    position: absolute;
    top: 50%;
    transform: translateX(-50%);
  }
}
</style>
