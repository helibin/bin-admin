<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-main-container" label-width="80px">
      <el-form-item :label="$t('message.type')" :rules="[{ required: !isEdit, message: '请选择分类' }]" prop="type">
        <el-select v-model="formData.type" :origin-data="originData.type">
          <el-option v-for="(v, k, i) in consts.messageType" :key="i" :label="v" :value="k" />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('common.title')"
        :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('common.title') }]"
        placeholder="请输入标题"
        prop="title"
      >
        <el-input v-model="formData.title" :origin-data="originData.title" />
      </el-form-item>

      <el-form-item
        :label="$t('message.subtitle')"
        :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('common.brief') }]"
        placeholder="请输入简介"
        prop="brief"
      >
        <el-input v-model="formData.brief" :origin-data="originData.brief" />
      </el-form-item>

      <el-form-item :label="$t('common.content')" prop="content">
        <el-input v-model="formData.content" :origin-data="originData.content" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">确认 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import consts from '@/data/consts'
import Editor from '@/components/WangEditor'
import SingleImageUpload from '@/components/Upload/singleImage'

export default {
  components: { Editor, SingleImageUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      consts,
      targetId: this.$route.params && this.$route.params.id,

      formData: {},
      originData: {},
      loading: false,
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      this.$baseAPI.get('messages', this.targetId).then(({ data }) => {
        this.formData = data
        this.originData = { ...data }
      })
    }
  },
  methods: {
    syncAvatar(content) {
      this.formData.file = content
    },
    syncEditorContent(content) {
      this.formData.content = content
    },
    addData(newData) {
      this.$baseAPI
        .add('messages', newData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/messages/list' })
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
        .modify('messages', this.targetId, nextData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/messages/list' })
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

            formData.append(k, data[k])
          }
          if (this.isEdit) {
            // 过滤未修改字段
            this.modifyData(formData)
          } else {
            this.addData(formData)
          }
        } else {
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
