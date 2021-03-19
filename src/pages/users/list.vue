<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" />
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="handleSort"
    >
      <el-table-column :label="$t('common.seq')" width="50">
        <template slot-scope="{ row }">
          {{ row.seq }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('user.name')">
        <template slot-scope="{ row }">
          姓名：<span>{{ row.name }}</span
          ><br />
          <!-- 性别：<span>{{ consts.sex[row.sex] }}</span
          ><br /> -->
          手机：<span>{{ row.mobile }}</span
          ><br />
          <!-- 邮箱：<span>{{ row.email }}</span
          ><br /> -->
          出生年月：<span>{{ row.birthday | parseTime('{y}-{m}-{d}') || '未填写' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="其他信息">
        <template slot-scope="{ row }">
          <span v-if="row.other_info">ip: {{ row.other_info.ip }}</span
          ><br />
          <!-- <span v-if="row.other_info">ua: {{ row.other_info.ua }}</span
          ><br /> -->
          <span v-if="row.other_info">手机: {{ row.other_info.platform === 'iPhone' ? '苹果' : '安卓' }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('user.visitTime')" sortable="custom" prop="last_seen_at">
        <template slot-scope="{ row }">
          最后访问时间：<span>{{ row.last_seen_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span
          ><br />
          最后登录时间：<span>{{ row.last_sign_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="{ row, $index }">
          <router-link v-permission="['users_modify']" :to="'/users/edit/' + row.id">
            <el-button type="text">{{ $t('user.editor') }}</el-button>
          </router-link>

          <el-tooltip
            v-permission="['users_setDisable']"
            :content="$t(row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
          >
            <el-button v-if="row.is_disabled" size="mini" class="btn-do" @click="handleDisable(0, row)">启用</el-button>
            <el-button v-else size="mini" class="btn-do" @click="handleDisable(1, row)">禁用</el-button>
          </el-tooltip>

          <el-button v-permission="['debugUsers_delete']" type="text" @click="handleDelete(row, $index)"
            >{{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <PageInfo :sync-page-info="pageInfo" :sync-list-func="listData" />
  </div>
</template>

<script>
import consts from '@/data/consts'

export default {
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
    listData(query) {
      this.loading = true
      this.$baseAPI.list('users', query).then(res => {
        this.list = res.data
        this.pageInfo = res.page_info
        this.loading = false
      })
    },
    handleDisable(disable, user) {
      const disableData = { is_disabled: disable }
      this.$baseAPI
        .setDisable('users', user.id, disableData)
        .then(() => {
          user.is_disabled = disable
          this.$message.success('操作成功')
        })
        .catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
    },
    handleDelete(user, index) {
      this.$baseAPI
        .delete('users', user.id)
        .then(() => {
          this.$message.success('操作成功')
          this.list.splice(index, 1)
        })
        .catch(err => {
          this.$message.error(err.msg || '禁用失败')
        })
    },
    handleSort({ prop, order }) {
      this.listData({ by: prop, order: order === 'ascending' ? 'asc' : 'desc' })
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
</style>
