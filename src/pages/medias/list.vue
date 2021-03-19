<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :sync-add-fields="['title']" sync-cate="medias" />
    </div>

    <el-table v-loading="loading" :data="list" border fit size="small" style="width: 100%">
      <el-table-column :label="$t('common.seq')" width="50">
        <template slot-scope="{ row }">
          {{ row.seq }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('media.preview')" width="70">
        <template slot-scope="{ row }">
          <el-button v-if="row.type === 'video'" type="text" class="video-preview" @click="handlePreview(row)">
            <svg-icon icon-class="media" />
          </el-button>

          <img
            v-else-if="row.type === 'image' && row.file_path"
            :src="$store.getters.env.baseURL + row.file_path + '?w=150'"
            class="thumbnail-preview"
            @click="handlePreview(row)"
          />
          <span v-else>--</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('media.file')">
        <template slot-scope="{ row }">
          大小：
          <span v-if="row.size > 1000 * 1000 * 1000">{{ (row.size / 1000 / 1000 / 1000).toFixed(2) }}GB</span>
          <span v-else-if="row.size > 1000 * 1000">{{ (row.size / 1000 / 1000).toFixed(2) }}MB</span>
          <span v-else>{{ (row.size / 1000).toFixed(2) }}KB</span>
          <br />
          类型：<span>{{ consts.mediaType[row.type] }}</span
          ><br />
          <el-popover
            v-show="row.file_path"
            :content="`${$store.getters.env.wwwBaseURL}/medias/${row.id}/do/download`"
            trigger="hover"
            placement="top-start"
          >
            <el-button slot="reference" type="text">静态下载地址</el-button>
          </el-popover>
          <el-popover
            v-show="row.file_path"
            :content="`${$store.getters.env.oss.baseURL}${row.file_path}`"
            trigger="hover"
            placement="top-start"
          >
            <el-button slot="reference" type="text">OSS下载地址</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column :label="$t('media.cate')">
        <template slot-scope="{ row }">
          <span>{{ consts.mediaCate[row.cate] || row.cate }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('media.tag')" min-width="100px">
        <template slot-scope="{ row }">
          <el-tag v-if="row.tag">{{ row.tag }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.title')">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.brief')">
        <template slot-scope="{ row }">
          <span>{{ row.brief }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('media.validTime')">
        <template slot-scope="{ row }">
          <div v-if="row.start_at || row.end_at">
            {{ $t('media.startAt') }}: <span v-if="row.start_at">{{ row.start_at || '~' | parseTime() }}</span
            ><br />
            {{ $t('media.endAt') }}: <span v-if="row.start_at">{{ row.end_at || '~' | parseTime() }}</span>
          </div>
          <el-tag v-else>{{ $t('media.longTerm') }}</el-tag>
        </template>
      </el-table-column>

      <TimeInfo />

      <el-table-column :label="$t('common.do')" align="center">
        <template slot-scope="{ row, $index }">
          <el-tooltip
            v-permission="['medias_setDisable']"
            :content="$t(row.is_disabled ? 'common.isDisabled' : 'common.isEnabled')"
            placement="top"
          >
            <el-button v-if="row.is_disabled" size="mini" @click="handleDisable(0, row)">启用</el-button>
            <el-button v-else size="mini" @click="handleDisable(1, row)">禁用</el-button>
          </el-tooltip>

          <router-link v-permission="['medias_modify']" :to="'/medias/edit/' + row.id">
            <el-button type="text">{{ $t('common.editor') }}</el-button>
          </router-link>
          <el-button v-permission="['medias_delete']" type="text" @click="handleDelete(row, $index)">{{
            $t('common.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PageInfo :sync-page-info="pageInfo" :sync-list-func="listData" />

    <MediaViewer :sync-file-src="fileSrc" :sync-file-type="fileType" :file-src.sync="fileSrc" />
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
      fileSrc: '',
      fileType: '',
    }
  },
  created() {
    this.listData(this.query)
  },
  methods: {
    async listData(query) {
      this.loading = true
      const res = await this.$baseAPI.list('medias', query)
      this.list = res.data
      this.pageInfo = res.page_info

      this.loading = false
    },
    handleAdd() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true
          this.$baseAPI
            .add('medias', this.formData)
            .then(({ data }) => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000,
              })
              this.loading = false
              this.$router.push({ path: `/medias/edit/${data.new_data_id}` })
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
    handlePreview(data) {
      if (data.file_path) {
        this.fileSrc = this.$store.getters.env.oss.baseURL + data.file_path
      }

      this.fileType = data.type
    },
    handleDisable(disable, user) {
      const disableData = { is_disabled: disable }
      this.$baseAPI
        .setDisable('medias', user.id, disableData)
        .then(() => {
          user.is_disabled = disable
          this.$message.success('操作成功')
        })
        .catch(err => {
          this.$message.error(err.msg || '禁用失败')
        })
    },
    handleDelete(data, index) {
      this.$baseAPI
        .delete('medias', data.id)
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
.video-preview {
  font-size: 50px;
}
</style>
