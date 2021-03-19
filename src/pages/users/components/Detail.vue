<template>
  <div class="form-container">
    <el-form ref="ruleForm" :model="ruleForm" class="form-container" label-width="80px">
      <sticky :class-name="`sub-navbar ${ruleForm.status}`">
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">确认 </el-button>
      </sticky>

      <div class="form-main-container">
        <el-form-item
          :label="$t('user.identifier')"
          :rules="[
            {
              required: true,
              message: this.$t('common.pleaseInput') + this.$t('user.identifier'),
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 到 10 个字符',
            },
          ]"
          placeholder="请输入用户名"
          prop="identifier"
        >
          <el-input v-model="ruleForm.identifier" />
        </el-form-item>

        <el-form-item
          :label="$t('user.password')"
          :rules="[
            { required: true, message: this.$t('common.pleaseInput') + this.$t('user.password') },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符' },
          ]"
          placeholder="请输入密码"
          prop="password"
        >
          <el-input :type="passwordType" v-model="ruleForm.password"/>
          <span class="show-pwd" @click="showPwd"> <svg-icon :icon-class="passwordType ? 'eye-off' : 'eye-on'" /> </span
        ></el-form-item>

        <el-form-item
          :label="$t('user.name')"
          :rules="[{ required: true, message: this.$t('common.pleaseInput') + this.$t('user.name') }]"
          placeholder="请输入名字"
          prop="name"
        >
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item
          :label="$t('user.mobile')"
          :rules="[{ required: true, message: this.$t('common.pleaseInput') + this.$t('user.mobile') }]"
          placeholder="请输入手机"
          prop="mobile"
        >
          <el-input v-model="ruleForm.mobile" />
        </el-form-item>

        <el-form-item
          :label="$t('user.email')"
          :rules="[{ required: true, message: this.$t('common.pleaseInput') + this.$t('user.email') }]"
          placeholder="请输入邮箱"
          prop="email"
        >
          <el-input v-model="ruleForm.email" />
        </el-form-item>

        <el-form-item :label="$t('user.type.i18n')" prop="type">
          <el-select v-model="ruleForm.type">
            <el-option v-for="d in consts.authType" :key="d.value" :label="d.text" :value="d.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('user.status')">
          <el-switch v-model="ruleForm.is_disabled" active-text="禁用" inactive-text="启用" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import consts from '@/data/consts'

export default {
  name: 'ManageUserDetail',
  components: {
    Sticky,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ruleForm: {
        identifier: '',
        password: '',
        name: '',
        mobile: '',
        email: '',
        type: '',
        is_disabled: false,
      },
      loading: false,
      consts,
      passwordType: 'password',
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === '') {
        this.passwordType = 'password'
      } else {
        this.passwordType = ''
      }
    },
    fetchData(id) {
      this.$baseAPI.get('users', id).then(res => {
        this.ruleForm = res.data
      })
    },
    submitForm() {
      this.ruleForm.display_time = parseInt(this.display_time / 1000)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$api.users
            .add(this.ruleForm)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '添加后台用户成功',
                type: 'success',
                duration: 2000,
              })
              this.ruleForm.status = 'published'
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

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.form-container {
  position: relative;

  .form-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }

    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;

      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;

        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
