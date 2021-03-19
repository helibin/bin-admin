<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :sync-add-fields="['title', 'content']" sync-cate="messages" />
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small">
      <el-table-column :label="$t('common.seq')" width="50">
        <template slot-scope="{ row }">
          {{ row.seq }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('message.type')">
        <template slot-scope="{ row }">
          <el-tag>{{ consts.messageType[row.type] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.title')">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('message.subtitle')">
        <template slot-scope="{ row }">
          <span>{{ row.brief }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.content')">
        <template slot-scope="{ row }">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('message.noticeWay')">
        <template slot-scope="{ row }">
          <el-tag>{{ consts.noticeWay[row.notice_way] }}</el-tag>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="{ row, $index }">
          <el-tooltip
            v-permission="['messages_setDisable']"
            :content="$t(row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
          >
            <el-button v-if="row.is_disabled" size="mini" @click="handleDisable(0, row)">启用</el-button>
            <el-button v-else :disabled="row.id === 'xu_sa'" size="mini" @click="handleDisable(1, row)">禁用</el-button>
          </el-tooltip>

          <router-link v-permission="['messages_modify']" :to="'/messages/edit/' + row.id">
            <el-button type="text">{{ $t('common.editor') }}</el-button>
          </router-link>

          <el-button v-permission="['messages_delete']" type="text" @click="handleDelete(row, $index)">
            {{ $t('common.delete') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <PageInfo :sync-page-info="pageInfo" :sync-list-func="listData" />

    <MediaViewer :sync-file-src="imageSrc" :file-src.sync="imageSrc" />
  </div>
</template>

<script>
import consts from '@/data/consts'
import MediaViewer from '@/components/MediaViewer'

export default {
  components: { MediaViewer },
  data() {
    return {
      consts,

      pageInfo: {},
      query: this.$route.query,
      list: [],
      loading: true,

      addDialogVisible: false,
      formData: {},
      imageSrc: '',
    }
  },
  created() {
    this.listData(this.query)
  },
  methods: {
    async listData(query) {
      this.loading = true
      const res = await this.$baseAPI.list('messages', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleAdd() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true
          this.$baseAPI
            .add('messages', this.formData)
            .then(({ data }) => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000,
              })
              this.loading = false
              this.$router.push({ path: `/messages/edit/${data.new_data_id}` })
            })
            .catch(err => {
              this.$notify({
                title: '失败',
                message: err.msg,
                type: 'error',
                duration: 2000,
              })
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    handleDisable(disable, user) {
      const disableData = { is_disabled: disable }
      this.$baseAPI
        .setDisable('messages', user.id, disableData)
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
        .delete('messages', user.id)
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
