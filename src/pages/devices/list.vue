<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :sync-add-fields="['code']" sync-cate="devices" />
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small" style="width: 100%">
      <el-table-column :label="$t('common.seq')" width="50">
        <template slot-scope="{ row }">
          {{ row.seq }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('device.info')">
        <template slot-scope="{ row }">
          代码：<el-tag v-if="row.code">{{ row.code }}</el-tag
          ><br />
          名称：<span v-if="row.name">{{ row.name }}</span
          ><br />
          类型：<span v-if="row.name">{{ consts.deviceType[row.type] }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('device.hospital')">
        <template slot-scope="{ row }">
          <div v-if="row.hospital_info">
            名字：<span v-if="row.hospital_info.name">{{ row.hospital_info.name }}</span
            ><br />
            代码：<el-tag v-if="row.hospital_info.code">{{ row.hospital_info.code }}</el-tag
            ><br />
            电话：<span v-if="row.hospital_info.tel">{{ row.hospital_info.tel }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('device.ak')">
        <template slot-scope="{ row }">
          accessKeyId: <el-tag v-if="row.ak_id">{{ row.ak_id }}</el-tag
          ><br />
          accessKeySecret:
          <el-tag v-if="row.ak_secret">{{ row.ak_secret }}</el-tag>
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
          <span>通讯：{{ row.last_report_at | parseTime() }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('device.position')">
        <template slot-scope="{ row }">
          <div>
            {{ row.position }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="额外信息">
        <template slot-scope="{ row }">
          <div v-for="k of Object.keys(row.extra_info || {})" :key="k">
            <span>{{ k }}: {{ row.extra_info[k] }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.remark')">
        <template slot-scope="{ row }">
          <div>
            {{ row.remark }}
          </div>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="{ row, $index }">
          <div v-permission="['devices_audit']">
            <el-button v-if="row.status !== 'auditing'" type="mini" disabled>已审核</el-button>
            <el-button v-else type="mini" @click="showAuditDialog(row)">审核</el-button>
          </div>
          <el-tooltip
            v-permission="['devices_setDisable']"
            :content="$t(row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
          >
            <el-button v-if="row.is_disabled" :disabled="!row.hospital_id" size="mini" @click="handleDisable(0, row)"
              >启用</el-button
            >
            <el-button v-else size="mini" @click="handleDisable(1, row)">禁用</el-button>
          </el-tooltip>

          <router-link v-permission="['devices_modify']" :to="'/devices/edit/' + row.id">
            <el-button type="text">{{ $t('common.editor') }}</el-button>
          </router-link>
          <el-button v-permission="['devices_delete']" type="text" @click="handleDelete(row, $index)">{{
            $t('common.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PageInfo :sync-page-info="pageInfo" :sync-list-func="listData" />

    <el-dialog :visible.sync="auditDialogVisible" title="分配医院">
      <el-form>
        <el-form-item label="医院选择">
          <SelectHospital :sync-hospital-id="auditHospitalId" @sync="syncHospitalId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAuditDialog">取 消</el-button>
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
      auditHospitalId: '',
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
    closeAuditDialog() {
      this.auditDialogVisible = false
      this.auditHospitalId = ''
    },
    syncHospitalId(targetId) {
      this.auditHospitalId = targetId
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
      const res = await this.$baseAPI.list('devices', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleAudit() {
      this.$api.Devices.audit(this.deviceId, {
        hospital_id: this.auditHospitalId,
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
          this.$message.error(ex.msg || '删除失败')
        })
    },
  },
}
</script>
