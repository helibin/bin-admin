<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea
        :sync-add-fields="['name', 'identifier']"
        :sync-list-func="listData"
        sync-cate="my-manage-users"
      />
    </div>

    <el-table
      :data="list"
      border
      fit
      size="small"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        :label="$t('common.seq')"
        width="50"
      >
        <template slot-scope="{ row }">{{ row.seq }}</template>
      </el-table-column>

      <el-table-column
        align="center"
        label="用户信息"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.identifier }}</span>
          <el-tag
            type="info"
            v-if="scope.row.type"
          >{{ consts.manageUserType[scope.row.type] }}</el-tag>
          <br />
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('myManageUser.name')"
        class-name="status-col"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('myManageUser.mobile')"
        class-name="status-col"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.mobile">{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('myManageUser.email')"
        class-name="status-col"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.email">{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('myManageUser.hospital')"
        class-name="status-col"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.hospital_name">{{ scope.row.hospital_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('myManageUser.privilege')"
        align="center"
      >
        <template slot-scope="scope">
          <span class="text-ellipsis">{{ scope.row.privileges }}</span>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column
        :label="$t('common.do')"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip
            :content="$t(scope.row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
            v-permission="['myManageUsers_setDisable']"
          >
            <el-button
              @click="handleDisable(0, scope.row)"
              size="mini"
              v-if="scope.row.is_disabled"
            >启用</el-button>
            <el-button
              :disabled="scope.row.id === 'xu_sa'"
              @click="handleDisable(1, scope.row)"
              size="mini"
              v-else
            >禁用</el-button>
          </el-tooltip>

          <router-link
            :to="'/my-manage-users/edit/' + scope.row.id"
            v-permission="['myManageUsers_modify']"
          >
            <el-button type="text">{{ $t('common.editor') }}</el-button>
          </router-link>

          <router-link
            :to="'/my-manage-users/set-privilege/' + scope.row.id"
            v-permission="['myManageUsers_setPrivilege']"
          >
            <el-button type="text">{{ $t('myManageUser.privilege') }}</el-button>
          </router-link>
          <el-button
            @click="handleDelete(scope.row, scope.$index)"
            type="text"
            v-permission="['myManageUsers_delete']"
          >{{ $t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PageInfo
      :sync-list-func="listData"
      :sync-page-info="pageInfo"
    />
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
      const res = await this.$baseAPI.list('my-manage-users', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleDisable(disable, user) {
      const disableData = { is_disabled: disable }
      this.$baseAPI
        .setDisable('my-manage-users', user.id, disableData)
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
        .delete('my-manage-users', user.id)
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
