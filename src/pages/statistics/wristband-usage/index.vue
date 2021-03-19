<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :show-search-filter="false" :show-date-filter="true" />

      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="document"
        @click="handleDownload"
        >{{ $t('excel.export') }} Excel</el-button
      >
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      :summary-method="getSum"
      border
      fit
      show-summary
      size="small"
      style="width: 100%"
    >
      <el-table-column :label="$t('common.seq')" align="center" width="50" prop="seq">
        <template slot-scope="{ row, $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="腕带号" prop="code" width="130">
        <template slot-scope="{ row }">
          <el-tag>{{ row.code }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="用户手机号" prop="mobile">
        <template slot-scope="{ row }">
          {{ row.mobile }}
        </template>
      </el-table-column>

      <el-table-column label="是否注册" prop="is_registered">
        <template slot-scope="{ row }">
          <span>{{ row.is_registered ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in deviceList"
        :key="index"
        :label="item.postion || `视频${index + 1}`"
        :prop="item.id"
      >
        <template slot-scope="{ row }">
          <span>{{ row.video[item.id] || 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="完成" prop="complete">
        <template slot-scope="{ row }">
          <span>{{ Object.keys(row.video).length - 1 }}/{{ deviceList.length }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.remark')" prop="remark">
        <template slot-scope="{ row }">
          {{ row.remark }}
        </template>
      </el-table-column>

      <el-table-column label="使用时间" prop="used_at">
        <template slot-scope="{ row }">
          <span v-if="row.used_at">
            {{ row.used_at | parseTime() }}
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
      loading: false,
      pageInfo: {},
      query: this.$route.query,
      list: [],
      deviceList: [],
    }
  },
  created() {
    // this.listData(this.query)
  },
  methods: {
    async listData(query) {
      this.loading = true
      try {
        await this.listDevices(query)
        const { data } = await this.$api.Statistics.wristbandUsage(query)
        this.list = data
      } catch (ex) {
        this.$notify({
          title: '失败',
          message: ex.msg,
          type: 'error',
          duration: 2000,
        })
      }
      this.loading = false
    },
    getSum(param) {
      const { columns, data } = param
      const counts = []

      // 列循环
      columns.forEach((column, index) => {
        if (index === 0) {
          counts[index] = '合计'
          return
        }
        if (!column.property) return

        // 数据处理
        const values = data.map(item => {
          return Number(item[column.property]) || Number(item.video[column.property]) || 0
        })

        counts[index] = 0

        if (!values.every(value => !value)) {
          if (['code', 'mobile'].includes(column.property)) {
            counts[index] = values.reduce((acc, curr) => (curr ? acc + 1 : acc), 0)
          } else {
            counts[index] = values.reduce((acc, curr) => (curr ? acc + curr : acc), 0)
          }
        }
      })

      return counts
    },
    async listDevices(query) {
      const { data } = await this.$baseAPI.list('devices', {
        hospital_id: query.hospital_id,
        by_page: false,
      })

      const deviceList = []
      for (const d of data) {
        const device = { id: d.id, name: d.name, postion: d.position }
        deviceList.push(device)
      }
      this.deviceList = deviceList
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const videoHeard = []
        const videoBody = []
        this.deviceList.forEach((item, index) => {
          videoHeard.push(item.postion || `视频${index + 1}`)
          videoBody.push(item.id)
        })
        const tHeader = ['序号', '腕带号', '用户手机号', '是否注册', ...videoHeard, '完成', '备注', '使用时间']
        const filterVal = ['seq', 'code', 'mobile', 'is_registered', ...videoBody, 'complete', 'remark', 'used_at']
        const list = this.list
        this.list.forEach((item, index) => {
          item.seq = index + 1

          for (const k in item) {
            if (k !== 'video') continue

            for (const id of videoBody) {
              item[id] = 0
            }

            const completed = Object.keys(item[k]).length - 1
            item.complete = completed + '/' + this.deviceList.length
          }
          return item
        })
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
          if (v.video[j]) v[j] = v.video[j]

          if (j === 'used_at') {
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
<style scoped>
.child-table {
  border: none;
}
</style>

<style>
.no-padding .cell {
  padding: 0;
}
</style>
