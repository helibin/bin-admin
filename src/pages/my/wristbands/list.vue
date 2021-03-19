<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :show-hospital-filter="false" />
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small" style="width: 100%">
      <el-table-column :label="$t('common.code')">
        <template slot-scope="{ row }">
          <el-tag v-if="row.code">{{ row.code }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('wristband.type')">
        <template slot-scope="{ row }">
          <span>{{ consts.wristbandType[row.type] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属医院">
        <template slot-scope="{ row }">
          <span>{{ row.hospital_info && row.hospital_info.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户手机">
        <template slot-scope="{ row }">
          {{ row.mobile }}
        </template>
      </el-table-column>

      <el-table-column label="最后标记时间">
        <template slot-scope="{ row }">
          <span v-if="row.last_bind_at">
            {{ row.last_bind_at | parseTime() }}
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.remark')">
        <template slot-scope="{ row }">
          {{ row.remark }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="{ row }">
          <router-link :to="'/my/wristbands/edit/' + row.id">
            <el-button type="text">标记</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <PageInfo :sync-page-info="pageInfo" :sync-list-func="listData" />
  </div>
</template>

<script>
import consts from '@/data/consts'

export default {
  components: {},
  data() {
    return {
      pageInfo: {},
      query: this.$route.query,
      list: [],
      loading: true,

      consts,
    }
  },
  created() {
    this.listData(this.query)
  },
  methods: {
    async listData(query) {
      this.loading = true
      const res = await this.$baseAPI.list('my-wristbands', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
  },
}
</script>
