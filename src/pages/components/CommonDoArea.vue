<template>
  <div>
    <Search
      :sync-list-func="syncListFunc"
      :show-search-filter="showSearchFilter"
      :show-date-filter="showDateFilter"
      :show-hospital-filter="showHospitalFilter"
    />

    <div v-if="syncAddFields.length">
      <el-button class="add" type="primary" @click.native="addDialogVisible = true">
        {{ $t('common.add') }}
      </el-button>
      <el-dialog :visible.sync="addDialogVisible" title="新增" @close="resetDialog">
        <el-form ref="formData" :model="formData" label-width="100px" @submit.native.prevent>
          <el-form-item
            v-for="f in syncAddFields"
            :key="f"
            :label="$t(`common.${f}`)"
            :rules="[{ required: true, message: $t('common.pleaseInput') + $t(`common.${f}`) }]"
            :prop="f"
            :placeholder="$t('common.pleaseInput') + $t(`common.${f}`)"
          >
            <el-input v-model="formData[f]" @keyup.enter.native="handleAdd" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Search from '@/pages/components/Search'

export default {
  components: {
    Search,
  },
  props: {
    syncListFunc: {
      type: Function,
      default: () => [],
    },
    syncCate: {
      type: String,
      default: '',
    },
    syncAddFields: {
      type: Array,
      default: () => [],
    },

    // Search
    showSearchFilter: {
      type: Boolean,
      default: true,
    },
    showDateFilter: {
      type: Boolean,
      default: false,
    },
    showHospitalFilter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      formData: {},
      query: this.$route.query,

      addDialogVisible: false,
    }
  },
  methods: {
    resetDialog() {
      this.addDialogVisible = false
      this.formData = {}
      this.$refs.formData.resetFields()
    },
    handleAdd() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true
          this.$baseAPI
            .add(this.syncCate, this.formData)
            .then(({ data }) => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000,
              })
              this.loading = false
              this.resetDialog()
              this.$router.push({
                path: `/${this.syncCate}/edit/${data.new_data_id}`,
                query: this.query,
              })
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
          return false
        }
      })
    },
  },
}
</script>
