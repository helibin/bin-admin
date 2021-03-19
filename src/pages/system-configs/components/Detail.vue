<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-main-container" label-width="80px">
      <el-form-item
        :label="$t('systemConfig.key')"
        :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('systemConfig.key') }]"
        placeholder="请输入配置键"
        prop="key"
      >
        <el-input v-model="formData.key" :origin-data="originData.key" disabled />
      </el-form-item>

      <el-form v-if="formData.key === 'app_info'" label-width="150px" :inline="true">
        <el-form-item label="安卓版本">
          <el-input v-model="configValue.android.version" placeholder="格式: x.x.x"></el-input
          ><el-checkbox :true-label="1" :false-label="0" v-model="configValue.android.force_update"
            >是否强制用户升级</el-checkbox
          >
        </el-form-item>
        <el-form-item label="苹果版本">
          <el-input v-model="configValue.ios.version" placeholder="格式: x.x.x"></el-input>
          <el-checkbox :true-label="1" :false-label="0" v-model="configValue.ios.force_update"
            >是否强制用户升级</el-checkbox
          >
        </el-form-item>
      </el-form>

      <el-form-item
        v-else
        :label="$t('systemConfig.value')"
        :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('systemConfig.value') }]"
        placeholder="请输入配置值"
        prop="value"
      >
        <el-input
          v-model="formData.value"
          :autosize="{ minRows: 5, maxRows: 20 }"
          :origin-data="originData.value"
          type="textarea"
        />
      </el-form-item>

      <el-form-item
        :label="$t('systemConfig.remark')"
        :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('systemConfig.remark') }]"
        placeholder="请输入备注"
        prop="remark"
      >
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

export default {
  components: {},
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
      configValue: { ios: {}, android: {} },
    }
  },
  computed: {},
  watch: {
    configValue: {
      deep: true,
      handler(v) {
        this.formData.value = JSON.stringify({ ...JSON.parse(this.formData.value), ...v })
      },
    },
  },
  created() {
    if (this.isEdit) {
      this.$baseAPI.get('system-configs', this.targetId).then(({ data }) => {
        data.value = JSON.stringify(data.value)
        this.formData = data
        this.originData = { ...data }
        this.configValue = JSON.parse(data.value)
      })
    }
  },
  methods: {
    addData(newData) {
      this.$baseAPI
        .add('system-configs', newData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/system-configs/list' })
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
        .modify('system-configs', this.targetId, nextData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/system-configs/list' })
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
