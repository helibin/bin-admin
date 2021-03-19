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

    <el-table v-loading="loading" :data="list" border show-summary fit size="small" style="width: 100%">
      <el-table-column :label="$t('common.seq')" align="center" width="50">
        <template slot-scope="{ row, $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="订单结束日期">
        <template slot-scope="{ row }">
          <span v-if="row.settled_at">
            {{ row.settled_at | parseTime() }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="用户手机号">
        <template slot-scope="{ row }">
          {{ row.mobile }}
        </template>
      </el-table-column>

      <el-table-column label="结算金额" prop="amount">
        <template slot-scope="{ row }">
          {{ row.amount }}
        </template>
      </el-table-column>

      <el-table-column label="视频提交日期">
        <template slot-scope="{ row }">
          <span>
            {{ row.video_time || '--' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="物流单号">
        <template slot-scope="{ row }">
          {{ row.express_no }}{{ row.express_carrier ? `（${row.express_carrier}）` : '' }}
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
      const { data } = await this.$api.Statistics.myOrderSettlement(query)

      this.list = data
      this.loading = false
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '订单结束日期', '用户手机号', '结算金额', '视频提交时间', '物流单号']
        const filterVal = ['seq', 'settled_at', 'mobile', 'amount', 'video_time', 'express_no']
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
          if (['settled_at', 'video_time'].includes(j)) {
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
