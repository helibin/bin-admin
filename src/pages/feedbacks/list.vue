<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea
        :show-hospital-filter="false"
        :sync-list-func="listData"
        :sync-add-fields="['content']"
        sync-cate="feedbacks"
      />
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small" style="width: 100%">
      <el-table-column :label="$t('common.seq')" width="50">
        <template slot-scope="{ row }">
          {{ row.seq }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.content')">
        <template slot-scope="{ row }">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('feedback.contact')">
        <template slot-scope="{ row }">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.type')">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.remark')">
        <template slot-scope="{ row }">
          <span>{{ row.extra_info }}</span>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="{ row, $index }">
          <el-tooltip
            v-permission="['feedbacks_setDisable']"
            :content="$t(row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
          >
            <el-button v-if="row.is_disabled" size="mini" @click="handleDisable(0, row)">启用</el-button>
            <el-button v-else :disabled="row.id === 'xu_sa'" size="mini" @click="handleDisable(1, row)">禁用</el-button>
          </el-tooltip>

          <router-link v-permission="['feedbacks_modify']" :to="'/feedbacks/edit/' + row.id">
            <el-button type="text">{{ $t('common.editor') }}</el-button>
          </router-link>

          <el-button v-permission="['feedbacks_delete']" type="text" @click="handleDelete(row, $index)">
            {{ $t('common.delete') }}</el-button
          >
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
      consts,

      pageInfo: {},
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
      const res = await this.$baseAPI.list('feedbacks', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleDisable(disable, user) {
      const disableData = { is_disabled: disable }
      this.$baseAPI
        .setDisable('feedbacks', user.id, disableData)
        .then(() => {
          user.is_disabled = disable
          this.$message.success('操作成功')
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    handleDelete(data, index) {
      this.$baseAPI
        .delete('feedbacks', data.id)
        .then(() => {
          this.$message.success('操作成功')
          this.list.splice(index, 1)
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
  },
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
