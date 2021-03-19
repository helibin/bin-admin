<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-add-fields="['code']" :sync-list-func="listData" sync-cate="apps" />
    </div>

    <el-table :data="list" border fit size="small" style="width: 100%" v-loading="loading">
      <el-table-column :label="$t('common.seq')" width="50">
        <template slot-scope="{ row }">{{ row.seq }}</template>
      </el-table-column>

      <el-table-column :label="$t('app.info')">
        <template slot-scope="{ row }">
          代码：
          <el-tag v-if="row.code">{{ row.code }}</el-tag>
          <br />名称：
          <span v-if="row.name">{{ row.name }}</span>
          <br />
        </template>
      </el-table-column>

      <el-table-column :label="$t('app.muser')">
        <template slot-scope="{ row }">
          <div v-if="row.muser_info">
            名字：
            <span v-if="row.muser_info.name">{{ row.muser_info.name }}</span>
            <br />
          </div>
          <div v-else>{{ row.muser_id }}</div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('AccessKey')">
        <template slot-scope="{ row }">
          accessKeyId:
          <el-tag v-if="row.ak_id">{{ row.ak_id }}</el-tag>
          <br />accessKeySecret:
          <el-tag v-if="row.ak_secret">{{ row.ak_secret }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.is_disabled && row.status !== 'auditing' ? 'info' : status(row)">{{
            row.is_disabled && row.status !== 'auditing' ? '已禁用' : consts.appStatus[row.status]
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.remark')">
        <template slot-scope="{ row }">
          <div>{{ row.remark }}</div>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="{ row, $index }">
          <span v-permission="['apps_audit']">
            <el-button disabled type="mini" v-if="row.status !== 'auditing'">已激活</el-button>
            <el-button @click="showAuditDialog(row)" type="mini" v-else>审核</el-button>
          </span>

          <el-tooltip
            :content="$t(row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
            v-permission="['apps_setDisable']"
          >
            <el-button :disabled="!row.muser_id" @click="handleDisable(0, row)" size="mini" v-if="row.is_disabled"
              >启用</el-button
            >
            <el-button @click="handleDisable(1, row)" size="mini" v-else>禁用</el-button>
          </el-tooltip>

          <router-link :to="'/apps/edit/' + row.id" v-permission="['apps_modify']">
            <el-button type="text">{{ $t('common.editor') }}</el-button>
          </router-link>

          <el-button @click="handleDelete(row, $index)" type="text" v-permission="['apps_delete']">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <PageInfo :sync-list-func="listData" :sync-page-info="pageInfo" />

    <el-dialog :visible.sync="auditDialogVisible" @close="handleClose" title="分配后台用户">
      <el-form :model="formData" ref="formData">
        <el-form-item label="后台用户选择" prop="name">
          <el-autocomplete
            :fetch-suggestions="querySearch"
            :value="formData.name"
            @select="handleSelect"
            class="inline-input"
            placeholder="选择用户名"
            v-model="formData.name"
            value-key="name"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button @click="handleAudit" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import consts from '@/data/consts'

export default {
  components: {},
  data() {
    return {
      consts,

      list: [],
      loading: true,
      query: this.$route.query,
      pageInfo: {},
      auditDialogVisible: false,
      formData: {},
      appId: '',
    }
  },
  computed: {},
  created() {
    this.listData(this.query)
    this.listAvalibleManageUsers()
  },
  methods: {
    handleClose() {
      this.$refs.formData.resetFields()
    },
    showAuditDialog(data) {
      this.appId = data.id
      this.auditDialogVisible = true
    },
    querySearch(queryString, cb) {
      this.formData.muser_id = ''
      const res = queryString ? this.muserList.filter(this.createFilter(queryString)) : this.muserList
      // 调用 callback 返回建议列表的数据
      cb(res)
    },
    createFilter(queryString) {
      return d => {
        return d.name.toLowerCase().includes(queryString.toLowerCase())
      }
    },
    listAvalibleManageUsers() {
      this.$api.Apps.listAvalibleManageUsers().then(({ data }) => {
        this.muserList = data
      })
    },
    handleSelect(item) {
      this.formData.muser_id = item.id
    },
    status({ status }) {
      switch (status) {
        case 'activated':
          return 'success'
        case 'auditing':
          return 'warning'
        default:
          return 'info'
      }
    },
    async listData(query) {
      this.loading = true
      const res = await this.$baseAPI.list('apps', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleAudit() {
      this.$api.Apps.audit(this.appId, {
        muser_id: this.formData.muser_id,
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
        .setDisable('apps', data.id, disableData)
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
        .delete('apps', data.id)
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
