<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :sync-add-fields="['name', 'identifier']" sync-cate="manage-users" />
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small" style="width: 100%">
      <el-table-column :label="$t('common.seq')" width="50">
        <template slot-scope="{ row }">
          {{ row.seq }}
        </template>
      </el-table-column>

      <el-table-column label="用户信息" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.identifier }}</span>
          <el-tag type="info">{{ consts.manageUserType[scope.row.type] }}</el-tag
          ><br />
        </template>
      </el-table-column>

      <el-table-column :label="$t('manageUser.name')" class-name="status-col">
        <template slot-scope="scope">
          <span v-if="scope.row.name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('manageUser.mobile')" class-name="status-col">
        <template slot-scope="scope">
          <span v-if="scope.row.mobile">{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('manageUser.email')" class-name="status-col">
        <template slot-scope="scope">
          <span v-if="scope.row.email">{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('manageUser.privilege')" align="center">
        <template slot-scope="scope">
          <span class="text-ellipsis">{{ scope.row.privileges }}</span>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="scope">
          <el-tooltip
            v-permission="['manageUsers_setDisable']"
            :content="$t(scope.row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
          >
            <el-button v-if="scope.row.is_disabled" size="mini" @click="handleDisable(0, scope.row)">启用</el-button>
            <el-button v-else :disabled="scope.row.id === 'xu_sa'" size="mini" @click="handleDisable(1, scope.row)"
              >禁用</el-button
            >
          </el-tooltip>

          <router-link v-permission="['manageUsers_modify']" :to="'/manage-users/edit/' + scope.row.id">
            <el-button type="text">{{ $t('common.editor') }}</el-button>
          </router-link>

          <router-link v-permission="['manageUsers_setPrivilege']" :to="'/manage-users/set-privilege/' + scope.row.id">
            <el-button type="text">{{ $t('manageUser.privilege') }}</el-button>
          </router-link>
          <el-button v-permission="['manageUsers_delete']" type="text" @click="handleDelete(scope.row, scope.$index)">
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
  name: 'ManageUsersList',
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
      const res = await this.$baseAPI.list('manage-users', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleDisable(disable, user) {
      const disableData = { is_disabled: disable }
      this.$baseAPI
        .setDisable('manage-users', user.id, disableData)
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
        .delete('manage-users', user.id)
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
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
</style>
