<template>
  <div>
    <el-upload
      ref="upload"
      :auto-upload="false"
      :multiple="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :http-request="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :accept="accepts[syncType] + '/*'"
      class="file-uploader"
      action="upload.action"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <el-progress v-show="showProgress" :text-inside="true" :stroke-width="15" :percentage="progress" />

    <div>
      <img
        v-if="syncType === 'image' && (fileUrl || syncFileUrl)"
        :src="fileUrl || $store.getters.env.oss.baseURL + syncFileUrl + '?w=150'"
        class="file-preview"
      />
      <audio
        v-if="syncType === 'audio' && (fileUrl || syncFileUrl)"
        :src="fileUrl || $store.getters.env.oss.baseURL + syncFileUrl"
        class="file-preview video-player"
        @canplaythrough="handleCanplaythrough"
      />
      <video
        v-if="syncType === 'video' && (fileUrl || syncFileUrl)"
        :src="fileUrl || $store.getters.env.oss.baseURL + syncFileUrl"
        controls
        class="file-preview video-player"
        @canplaythrough="handleCanplaythrough"
      />
      <span v-if="syncType === 'other' && (fileUrl || syncFileUrl)">其他</span>
    </div>
  </div>
</template>

<script>
import * as uploadHelper from '@/utils/uploadHelper'

export default {
  name: 'SingleFileUpload',
  components: {},
  props: {
    syncFileUrl: {
      type: String,
      default: '',
    },
    syncType: {
      type: String,
      default: 'image',
    },
    syncOssPath: {
      type: String,
      default: '/temp-files/${$store.getters.user.id}/',
    },
  },
  data: function() {
    return {
      accepts: { image: 'image', audio: 'audio', video: 'video', other: '*' },
      fileList: [],
      fileUrl: this.fileUrl,

      progress: 0,
      showProgress: false,
      duration: 0,
    }
  },
  methods: {
    async handleChange({ raw }) {
      this.fileUrl = URL.createObjectURL(raw)
      await this.handleUpload({ file: raw })
    },
    async handleUpload({ file }) {
      const func = file.size > 1024 * 1024 * 5 ? 'stsMultipartUpload' : 'stsUpload' // 小于5M直传
      try {
        const filename = await uploadHelper[func](this.syncOssPath, file, this)
        this.$emit('sync', {
          file,
          filename,
          file_path: this.syncOssPath + filename,
          type: file.type.split('/')[0],
          size: file.size,
          duration: this.duration,
        })
        this.$message.success('上传成功')
        this.showProgress = false
      } catch (ex) {
        throw ex
      }
    },
    handleRemove() {
      this.$refs.upload.abort()
      this.fileUrl = ''
      this.cancelUpload()
    },
    handleCanplaythrough() {
      this.duration = document.querySelector('.video-player').duration || 0
      this.duration = (this.duration * 1).toFixed(0)
    },
    cancelUpload() {
      this.fileUrl = ''
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
.upload-btn {
  float: left;
}
.file-preview {
  display: block;
  max-width: 100%;
  max-height: 300px;
  border: 1px dashed #eee;
  cursor: pointer;
}
</style>
