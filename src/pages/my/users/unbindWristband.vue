<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-main-container" label-width="120px">
      <el-form-item :label="$t('myUser.name')">
        <el-input v-model="formData.name" disabled />
      </el-form-item>

      <el-form-item label="已绑定腕带">
        <el-tag v-for="w in formData.wristband_list" :key="w.id" :style="{ 'margin-right': '5px' }">
          {{ w.code }}
        </el-tag>
      </el-form-item>

      <el-form-item
        :label="$t('myUser.wristband')"
        :rules="[
          {
            required: true,
            message: this.$t('common.pleaseInput') + this.$t('myUser.wristband'),
          },
          {
            length: 12,
            message: '长度为12',
          },
        ]"
        placeholder="请输入腕带号"
        prop="wristband_id"
      >
        <el-select v-model="formData.wristband_id" filterable clearable placeholder="请选择腕带号">
          <el-option v-for="w in wristbandList" :key="w.id" :label="w.code" :value="w.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">解绑 </el-button>
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

      wristbandList: [],

      loading: false,
      formData: {},
      wristband: '',
      myUserId: this.$route.params && this.$route.params.id,
    }
  },
  computed: {},
  mounted() {},
  created() {
    this.fetchData(this.myUserId)
    this.listWristband()
  },
  methods: {
    fetchData(id) {
      this.$baseAPI.get('my-users', id).then(res => {
        this.formData = res.data
      })
    },
    listWristband() {
      this.$baseAPI.list('my-wristbands', { by_page: false, user_id: this.myUserId }).then(({ data }) => {
        this.wristbandList = data
      })
    },
    submitForm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true
          this.$api.Users.unbindWristband(this.myUserId, {
            wristband_id: this.formData.wristband_id,
          })
            .then(() => {
              this.$notify({
                title: '成功',
                message: '用户绑定腕带成功',
                type: 'success',
                duration: 2000,
              })

              this.loading = false
              this.$router.push({ path: '/my/users/list' })
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
