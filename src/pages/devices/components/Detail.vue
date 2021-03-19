<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-container" label-width="120px" status-icon>
      <div class="form-main-container">
        <el-form-item label="所属医院" prop="hospital_id">
          <SelectHospital :sync-hospital-id="formData.hospital_id" @sync="syncHospitalId" />
        </el-form-item>

        <el-form-item
          :label="$t('common.name')"
          :rules="[{ required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('common.name') }]"
          placeholder="请输入设备名字"
          prop="name"
        >
          <el-input v-model="formData.name" :origin-data="originData.name" autosize />
        </el-form-item>

        <el-form-item
          :label="$t('device.code')"
          :rules="[
            { required: !isEdit, message: this.$t('common.pleaseInput') + this.$t('device.code') },
            { len: 20, message: '长度须为20个字符' },
          ]"
          placeholder="请输入设备编号"
          prop="code"
        >
          <el-input v-model="formData.code" :origin-data="originData.code" autosize length="15" />
        </el-form-item>

        <el-form-item :rules="[{ required: !isEdit, message: '请选择设备类型' }]" label="类型" prop="type">
          <el-select v-model="formData.type" :origin-data="originData.type">
            <el-option v-for="(v, k) in consts.deviceType" :key="k" :label="v" :value="k" />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('device.position')"
          :rules="[{ required: !isEdit, message: '请输入位置' }]"
          placeholder="请输入设备位置"
          prop="position"
        >
          <el-input v-model="formData.position" :origin-data="originData.position" autosize />
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
import SelectHospital from '@/pages/components/SelectHospital'

export default {
  components: { SelectHospital },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {},
      originData: {},
      loading: false,
      consts,
      hospitalList: [{ id: '123444', name: 'abc' }],
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.$baseAPI.get('devices', id).then(res => {
        this.$nextTick(() => {
          res.data.area_code = res.data.area_code ? res.data.area_code.split(',') : []
          this.formData = res.data
          this.originData = { ...res.data }
        })
      })
    }
  },
  methods: {
    syncHospitalId(targetId) {
      this.formData.hospital_id = targetId
    },
    addData(newData) {
      this.$baseAPI
        .add('devices', newData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/devices/list' })
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
        .modify('devices', this.$route.params && this.$route.params.id, nextData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000,
          })
          this.loading = false
          this.$router.push({ path: '/devices/list' })
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
          const data = {}
          for (let k in this.formData) {
            if (this.isEdit && this.formData[k] === this.originData[k]) {
              continue
            }

            data[k] = this.formData[k]
          }
          if (this.isEdit) {
            // 过滤未修改字段
            this.modifyData(data)
          } else {
            this.addData(data)
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
