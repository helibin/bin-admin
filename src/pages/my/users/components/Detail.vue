<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-main-container" label-width="80px">
      <el-form-item
        :label="$t('user.name')"
        :rules="[{ message: this.$t('common.pleaseInput') + this.$t('user.name') }]"
        placeholder="请输入名字"
        prop="name"
      >
        <el-input v-model="formData.name" />
      </el-form-item>

      <el-form-item
        :label="$t('user.mobile')"
        :rules="[{ message: this.$t('common.pleaseInput') + this.$t('user.mobile') }]"
        placeholder="请输入手机"
        prop="mobile"
      >
        <el-input v-model="formData.mobile" />
      </el-form-item>

      <el-form-item
        :label="$t('user.email')"
        :rules="[{ message: this.$t('common.pleaseInput') + this.$t('user.email') }]"
        placeholder="请输入邮箱"
        prop="email"
      >
        <el-input v-model="formData.email" />
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
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      consts,

      loading: false,
      formData: {},
      userId: this.$route.params && this.$route.params.id,
    }
  },
  computed: {},
  created() {
    this.fetchData(this.userId)
  },
  methods: {
    fetchData(id) {
      this.$baseAPI.get('users', id).then(res => {
        this.formData = res.data
      })
    },
    submitForm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true
          this.$api.Users.bindWristband(this.userId, this.formData)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '用户绑定腕带成功',
                type: 'success',
                duration: 2000,
              })
            })
            .catch(err => {
              this.$notify({
                title: '失败',
                message: err.msg,
                type: 'error',
                duration: 2000,
              })
            })
            .finally(() => {
              this.loading = false
            })
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
