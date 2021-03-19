<template>
  <div class="form-container">
    <el-form
      :model="formData"
      class="form-container"
      label-width="80px"
      ref="formData"
    >
      <div class="form-main-container">
        <el-form-item
          :label="$t('manageUser.identifier')"
          :rules="[
            {
              required: !isEdit,
              message: this.$t('common.pleaseInput') + this.$t('manageUser.identifier'),
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
          <el-input
            :origin-data="originFormData.identifier"
            v-model="formData.identifier"
          />
        </el-form-item>

        <el-form-item
          :label="$t('manageUser.password')"
          :rules="[{ min: 6, max: 18, message: '长度在 6 到 18 个字符' }]"
          placeholder="请输入密码"
          prop="password"
        >
          <el-input
            :type="passwordType"
            maxlength="18"
            minlength="6"
            placeholder="默认密码：Aa123456@"
            v-model="formData.password"
          />
          <span
            @click="showPwd"
            class="show-pwd"
          >
            <svg-icon :icon-class="passwordType ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item>

        <el-form-item
          :label="$t('manageUser.name')"
          :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('manageUser.name') }]"
          placeholder="请输入名字"
          prop="name"
        >
          <el-input
            :origin-data="originFormData.name"
            v-model="formData.name"
          />
        </el-form-item>

        <el-form-item
          :label="$t('manageUser.type.i18n')"
          :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('manageUser.type.i18n') }]"
          prop="type"
        >
          <el-select
            :origin-data="originFormData.type"
            v-model="formData.type"
          >
            <el-option
              :key="i"
              :label="v"
              :value="k"
              v-for="(v, k, i) in consts.manageUserType"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('manageUser.mobile')"
          :rules="[
            { message: this.$t('common.pleaseInput') + this.$t('manageUser.mobile') },
            {
              pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
              message: '手机号不合法',
            },
          ]"
          placeholder="请输入手机"
          prop="mobile"
        >
          <el-input
            :origin-data="originFormData.mobile"
            v-model="formData.mobile"
          />
        </el-form-item>

        <el-form-item
          :label="$t('manageUser.email')"
          placeholder="请输入邮箱"
          prop="email"
        >
          <el-input
            :origin-data="originFormData.email"
            v-model="formData.email"
          />
        </el-form-item>

        <el-form-item
          :label="$t('common.address')"
          placeholder="请输入地址"
          prop="address"
        >
          <el-input
            :origin-data="originFormData.address"
            v-model="formData.address"
          />
        </el-form-item>

        <el-form-item
          :label="$t('common.belongsToHospital')"
          prop="hospital_id"
        >
          <SelectHospital
            :sync-hospital-id="formData.hospital_id"
            @sync="syncHospitalId"
          />
        </el-form-item>

        <el-form-item
          :label="$t('common.company')"
          :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('common.company') }]"
          placeholder="请填写公司"
          prop="company"
        >
          <el-input
            :origin-data="originFormData.company"
            v-model="formData.company"
          />
        </el-form-item>

        <el-form-item :label="$t('manageUser.status')">
          <el-switch
            :origin-data="originFormData.is_disabled"
            active-value="1"
            inactive-value="0"
            v-model="formData.is_disabled"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            @click="submitForm"
            style="margin-left: 10px;"
            type="primary"
            v-loading="loading"
          >确认</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import consts from '@/data/consts'
import SelectHospital from '@/pages/components/SelectHospital'

export default {
  components: {
    SelectHospital,
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

      formData: {},
      originFormData: {},
      loading: false,
      passwordType: 'password',
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.$baseAPI.get('manage-users', id).then(res => {
        this.formData = res.data
        this.originFormData = { ...res.data }
      })
    }
  },
  methods: {
    syncHospitalId(targetId) {
      this.formData.hospital_id = targetId
    },
    showPwd() {
      if (this.passwordType === '') {
        this.passwordType = 'password'
      } else {
        this.passwordType = ''
      }
    },
    addData() {
      this.$api.MyManageUsers.add(this.formData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '添加后台用户成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/my-manage-users/list' })
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
      this.$api.MyManageUsers.modify(this.$route.params && this.$route.params.id, nextData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '修改后台用户成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/my-manage-users/list' })
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
          if (this.isEdit) {
            // 过滤未修改字段
            const nextData = {}
            for (let k in this.formData) {
              if (this.formData[k] !== this.originFormData[k]) {
                nextData[k] = this.formData[k]
              }
            }
            this.modifyData(nextData)
          } else {
            this.addData()
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
