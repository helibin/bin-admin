<template>
  <div>
    <el-upload
      ref="upload"
      :auto-upload="false"
      :multiple="true"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :http-request="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList.length ? fileList : files"
      list-type="picture-card"
      accept="image/*"
      action="upload.action"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="" />
    </el-dialog>
    <el-progress v-show="showProgress" :text-inside="true" :stroke-width="15" :percentage="progress" />
  </div>
</template>

<script>
import * as uploadHelper from '@/utils/uploadHelper'

export default {
  name: 'SingleFileUpload',
  components: {},
  props: {
    syncFileUrls: {
      type: Array,
      default: () => [],
    },
    syncOssPath: {
      type: String,
      default: '/temp-files/',
    },
  },
  data: function() {
    return {
      fileList: [],

      progress: 0,
      showProgress: false,
      duration: 0,
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  computed: {
    files() {
      const obj = []
      Array.forEach(this.syncFileUrls, d => {
        obj.push({ url: this.$store.getters.env.oss.baseURL + d })
      })
      return obj
    },
  },
  methods: {
    async handleChange(file, fileList) {
      this.fileList = fileList
      await this.handleUpload(file)
    },
    async handleUpload(file) {
      const func = file.size > 1024 * 1024 * 5 ? 'stsMultipartUpload' : 'stsUpload' // 小于5M直传
      try {
        const filename = await uploadHelper[func](this.syncOssPath, file.raw, this)
        file.file_path = this.syncOssPath + filename

        this.$emit('sync', {
          fileList: this.fileList,
        })
        this.$message.success('上传成功')
        this.showProgress = false
        return 'ok'
      } catch (ex) {
        throw ex
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.$emit('sync', { fileList })
    },
    cancelUpload() {
      this.showProgress = false
      if (this.axiosSource) {
        this.axiosSource.cancel('用户取消上传.')
        delete this.axiosSource
      }
      if (this.stsOSS) {
        this.stsOSS.cancel('用户取消上传.')
        delete this.stsOSS
      }
    },
    handleSuccess(res) {
      this.$message.success(res || '恭喜你，上传成功')
      this.showProgress = false
    },
    handleError(err) {
      this.$message.error(err.toString(), '上传失败，请重新上传')
      this.showProgress = false
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.upload-container {
  .upload-btn {
    float: left;
  }
  .file-preview {
    max-width: 100%;
    max-height: 300px;
    border: 1px dashed #eee;
    cursor: pointer;
  }
}
</style>
