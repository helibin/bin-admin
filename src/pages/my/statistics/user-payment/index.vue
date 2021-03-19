<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea
        :sync-list-func="listData"
        :show-search-filter="false"
        :show-hospital-filter="false"
        :show-date-filter="true"
      />

      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="document"
        @click="handleDownload"
        >{{ $t('excel.export') }} Excel</el-button
      >
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small" show-summary style="width: 100%">
      <el-table-column :label="$t('common.seq')" align="center" width="50">
        <template slot-scope="{ row, $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="缴费时间">
        <template slot-scope="{ row }">
          <span v-if="row.paid_at">
            {{ row.paid_at | parseTime() }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="缴费金额" prop="amount">
        <template slot-scope="{ row }">
          <el-tag v-if="row.amount">{{ row.amount }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="用户手机号">
        <template slot-scope="{ row }">
          <el-tag v-if="row.mobile">{{ row.mobile }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="注册时间">
        <template slot-scope="{ row }">
          <span v-if="row.registered_at">
            {{ row.registered_at | parseTime() }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="腕带号">
        <template slot-scope="{ row }">
          <span>
            {{ row.code }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="标记时间">
        <template slot-scope="{ row }">
          <span v-if="row.last_bind_at">
            {{ row.last_bind_at | parseTime() }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  components: {},
  data() {
    return {
      downloadLoading: false,
      query: this.$route.query,
      list: [],
      loading: true,
    }
  },
  created() {
    this.listData(this.query)
  },
  methods: {
    async listData(query) {
      this.loading = true
      const { data } = await this.$api.Statistics.myUserPayment(query)

      this.list = data
      this.loading = false
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '缴费时间', '缴费金额', '用户手机号', '注册时间', '腕带号', '标记时间']
        const filterVal = ['seq', 'paid_at', 'amount', 'mobile', 'registered_at', 'code', 'last_bind_at']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: parseTime(Date.now()),
          autoWidth: this.autoWidth || true,
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => {
        return filterVal.map(j => {
          if (['paid_at', 'registered_at', 'last_bind_at'].includes(j)) {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      })
    },
  },
}
</script>
