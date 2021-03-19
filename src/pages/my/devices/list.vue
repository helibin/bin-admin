<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :show-hospital-filter="false" />
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small" style="width: 100%">
      <el-table-column :label="$t('device.code')">
        <template slot-scope="{ row }">
          <el-tag v-if="row.code">{{ row.code }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.name')">
        <template slot-scope="{ row }">
          <span v-if="row.name">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('device.type')">
        <template slot-scope="{ row }">
          <span>{{ consts.deviceType[row.type] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <el-tag
            v-if="row.status === 'online' && Date.now() - new Date(row.last_report_at).getTime() > 5 * 60 * 1000"
            type="danger"
            >离线</el-tag
          >
          <el-tag v-else :type="status(row)">{{ consts.deviceStatus[row.status] }}</el-tag>
          <br />
          <span>通讯时间：{{ row.last_report_at | parseTime() }}</span>
        </template>
      </el-table-column>

      <TimeInfo />
    </el-table>

    <PageInfo :sync-page-info="pageInfo" :sync-list-func="listData" />

    <el-dialog :visible.sync="auditDialogVisible" title="分配医院">
      <el-form :model="formData">
        <el-form-item label="医院选择">
          <SelectHospital :sync-hospital-id="formData.hospital_id" @sync="syncHospitalId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAudit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import consts from '@/data/consts'
import SelectHospital from '@/pages/components/SelectHospital'

export default {
  components: {
    SelectHospital,
  },
  data() {
    return {
      consts,

      list: [],
      loading: true,
      query: this.$route.query,
      pageInfo: {},
      auditDialogVisible: false,
      formData: {},
      deviceId: '',
    }
  },
  computed: {},
  created() {
    this.listData(this.query)
  },
  methods: {
    showAuditDialog(data) {
      this.deviceId = data.id
      this.auditDialogVisible = true
    },
    syncHospitalId(targetId) {
      this.formData.hospital_id = targetId
    },
    status({ status }) {
      switch (status) {
        case 'online':
          return 'success'
        case 'offline':
          return 'info'
        case 'error':
          return 'error'
        case 'auditing':
          return 'warning'
        default:
          return 'info'
      }
    },
    async listData(query) {
      this.loading = true
      const res = await this.$baseAPI.list('my-devices', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleAudit() {
      this.$api.Devices.audit(this.deviceId, {
        hospital_id: this.formData.hospital_id,
        is_disabled: false,
      })
        .then(() => {
          this.listData(this.query)
          this.auditDialogVisible = false
        })
        .catch(ex => {
          this.$message.error(ex.msg || '操作失败')
        })
    },
    handleDisable(disable, data) {
      const disableData = { is_disabled: disable }
      this.$baseAPI
        .setDisable('devices', data.id, disableData)
        .then(() => {
          data.is_disabled = disable
          this.$message.success('操作成功')
        })
        .catch(ex => {
          this.$message.error(ex.msg || '禁用失败')
        })
    },
    handleDelete(data, index) {
      this.$baseAPI
        .delete('devices', data.id)
        .then(() => {
          this.$message.success('操作成功')
          this.list.splice(index, 1)
        })
        .catch(ex => {
          this.$message.error(ex.msg || '禁用失败')
        })
    },
  },
}
</script>
