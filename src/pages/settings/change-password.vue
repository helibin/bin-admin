<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-container" label-width="80px">
      <div class="form-main-container">
        <el-form-item :label="$t('manageUser.identifier')">
          <el-button type="text" disabled>{{ $store.getters.user.identifier }}</el-button>
        </el-form-item>

        <el-form-item
          :rules="[{ min: 6, max: 18, message: '长度在 6 到 18 个字符' }]"
          label="原密码"
          placeholder="请输入原密码"
          prop="old_password"
        >
          <el-input :type="passwordType" v-model="formData.old_password" minlength="6" maxlength="18" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item>

        <el-form-item
          :rules="[{ min: 6, max: 18, message: '长度在 6 到 18 个字符' }]"
          label="新密码"
          placeholder="请输入新密码"
          prop="new_password"
        >
          <el-input v-model="formData.new_password" minlength="6" maxlength="18" />
        </el-form-item>

        <el-form-item>
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">确认 </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      targetId: this.$store.getters.user.id,

      formData: {},
      loading: false,
      passwordType: 'password',
    }
  },
  computed: {},
  created() {},
  methods: {
    showPwd() {
      if (this.passwordType === '') {
        this.passwordType = 'password'
      } else {
        this.passwordType = ''
      }
    },
    submitForm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true

          this.$api.ManageUsers.changePassword(this.formData)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '修改密码成功',
                type: 'success',
                duration: 2000,
              })
              this.loading = false
              this.$router.push({ path: '/manage-users/list' })
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

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
