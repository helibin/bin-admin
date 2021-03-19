<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-main-container" label-width="120px" status-icon>
      <el-form-item :label="$t('media.cate')" prop="cate">
        <el-select
          v-model="formData.cate"
          :origin-data="originData.cate"
          filterable
          allow-create
          placeholder="请选择或输入分类"
        >
          <el-option v-for="(v, k, i) in consts.mediaCate" :key="i" :label="v" :value="k" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('media.file')" placeholder="请上传文件" prop="file">
        <SimpleUpload
          :sync-file-url="formData.file_path"
          :orgin-data="originData.file_path"
          :sync-type="formData.type"
          :sync-oss-path="`/files/medias/${targetId}/`"
          @sync="syncFile"
        />
      </el-form-item>

      <el-form-item :label="$t('media.tag')" prop="tag">
        <el-select
          v-model="formData.tag"
          :origin-data="originData.tag"
          filterable
          allow-create
          placeholder="请选择或输入标签"
        >
          <el-option v-for="(v, k, i) in consts.mediaTag" :key="i" :label="v" :value="k" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('media.type')" :rules="[{ required: false, message: '请选择文件类型' }]" prop="type">
        <el-select v-model="formData.type" :origin-data="originData.type">
          <el-option v-for="(v, k, i) in consts.mediaType" :key="i" :label="v" :value="k" />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('common.title')"
        :rules="[{ required: false, message: this.$t('common.pleaseInput') + this.$t('common.title') }]"
        prop="title"
      >
        <el-input v-model="formData.title" :origin-data="originData.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item
        :label="$t('common.brief')"
        :rules="[{ required: false, message: this.$t('common.pleaseInput') + this.$t('common.brief') }]"
        prop="brief"
      >
        <el-input v-model="formData.brief" :origin-data="originData.brief" placeholder="请输入简介" />
      </el-form-item>

      <el-form-item :label="$t('common.content')" prop="content">
        <Editor
          :sync-content="originData.content"
          :upload-url="`/medias/${targetId}/do/upload`"
          :orgin-data="originData.content"
          @sync="syncEditorContent"
        />
      </el-form-item>

      <el-form-item
        :label="$t('media.link')"
        :rules="[{ required: false, message: this.$t('common.pleaseInput') + this.$t('common.link') }]"
        prop="link"
      >
        <el-input
          v-model="formData.link"
          :origin-data="originData.link"
          placeholder="请输入链接, 如：http://www.example.com"
        />
      </el-form-item>

      <el-form-item :label="$t('media.startAt')" prop="start_at">
        <el-date-picker v-model="formData.start_at" type="datetime" placeholder="选择生效时间" />
      </el-form-item>

      <el-form-item :label="$t('media.endAt')" prop="end_at">
        <el-date-picker v-model="formData.end_at" type="datetime" placeholder="选择失效时间" />
      </el-form-item>

      <el-form-item label="是否禁用" prop="is_disabled">
        <el-switch v-model="formData.is_disabled" :origin-data="originData.is_disabled" />
      </el-form-item>

      <el-form-item :label="$t('common.remark')" placeholder="请输入备注" prop="remark">
        <el-input v-model="formData.remark" :origin-data="originData.remark" />
      </el-form-item>

      <el-form-item>
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">确认 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import consts from '@/data/consts'
import SimpleUpload from '@/components/Upload/simpleUpload'
import Editor from '@/components/WangEditor'

export default {
  components: {
    Editor,
    SimpleUpload,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      consts,

      formData: {
        tel: '',
        is_public: true,
      },
      originData: {},
      loading: false,
      targetId: this.$route.params && this.$route.params.id,
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      this.$baseAPI.get('medias', this.targetId).then(({ data }) => {
        this.formData = data
        this.originData = { ...data }
      })
    }
  },
  methods: {
    syncFile(data) {
      this.formData.file = data.file
      this.formData.file_path = data.file_path || undefined
      this.formData.type = data.type || undefined
      this.formData.size = data.size || undefined
    },
    syncEditorContent(content) {
      this.formData.content = content
    },
    addData(newData) {
      this.$baseAPI
        .add('medias', newData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/medias/list', query: this.$route.query })
        })
        .catch(err => {
          this.$notify({
            title: '失败',
            message: err.msg,
            type: 'error',
            duration: 2000,
          })
          this.loading = false
        })
    },
    modifyData(nextData) {
      this.$baseAPI
        .modify('medias', this.targetId, nextData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/medias/list', query: this.$route.query })
        })
        .catch(err => {
          this.$notify({
            title: '失败',
            message: err.msg,
            type: 'error',
            duration: 2000,
          })
          this.loading = false
        })
    },
    submitForm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true

          // 数据整理
          const formData = new FormData()
          const data = { ...this.formData }
          for (let k in data) {
            if (this.isEdit && data[k] === this.originData[k]) {
              continue
            }

            if (k === 'file' && data.file instanceof File === false) continue

            formData.append(k, data[k])
          }
          if (this.isEdit) {
            // 过滤未修改字段
            this.modifyData(formData)
          } else {
            this.addData(formData)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.form-container {
  position: relative;

  .form-main-container {
    padding: 40px 15%;
  }
}
</style>
