<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-container" label-width="120px" status-icon>
      <div class="form-main-container">
        <el-form-item :label="$t('wristband.code')" placeholder="请输入腕带编号" prop="code">
          <el-input
            v-model="formData.code"
            :origin-data="originData.code"
            :maxlength="12"
            type="text"
            autosize
            disabled
            @keyup.enter.native="submitForm"
          />
        </el-form-item>

        <el-form-item
          :rules="[
            { message: this.$t('common.pleaseInput') + this.$t('common.mobile') },
            {
              pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
              message: '手机号不合法',
              trigger: 'blur',
            },
          ]"
          :validate-on-rule-change="false"
          prop="mobile"
          label="手机"
        >
          <el-autocomplete
            v-model="formData.mobile"
            :fetch-suggestions="querySearch"
            :value="formData.mobile"
            :maxlength="11"
            class="inline-input"
            placeholder="请输入手机"
            value-key="mobile"
            @select="handleSelect"
          />
        </el-form-item>

        <el-form-item :label="$t('common.remark')" placeholder="请输入备注" prop="remark">
          <el-input v-model="formData.remark" :origin-data="originData.remark" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">确认 </el-button>
        </el-form-item>
      </div>
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

      userList: [],

      formData: {},
      originData: {},
      loading: false,
      targetId: this.$route.params && this.$route.params.id,
    }
  },
  computed: {},
  created() {
    this.$baseAPI.get('my-wristbands', this.targetId).then(res => {
      this.formData = res.data
      this.originData = { ...res.data }
    })
    this.listMyUsers()
  },
  methods: {
    querySearch(queryString, cb) {
      this.formData.user_id = ''
      const res = queryString ? this.userList.filter(this.createFilter(queryString)) : this.userList
      // 调用 callback 返回建议列表的数据
      cb(res)
    },
    createFilter(queryString) {
      return d => {
        return d.mobile.toLowerCase().includes(queryString.toLowerCase())
      }
    },
    handleSelect(item) {
      this.formData.user_id = item.id
    },
    listMyUsers() {
      this.$baseAPI.list('my-users', { by_page: false }).then(({ data }) => {
        this.userList = data
      })
    },
    modifyData(nextData) {
      this.$baseAPI
        .modify('my-wristbands', this.targetId, nextData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/my/wristbands/list' })
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
      if (!this.isEdit && !this.formData.hospital_id) {
        this.$message.error('请选择医院')
        return false
      }

      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true

          // 数据整理
          const data = {}
          for (let k in this.formData) {
            if (this.formData[k] === this.originData[k]) {
              continue
            }

            data[k] = this.formData[k]
          }
          // 过滤未修改字段
          this.modifyData(data)
        } else {
          this.$notify({
            title: '失败',
            message: '请完善表单',
            type: 'error',
            duration: 2000,
          })
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
}
</style>
