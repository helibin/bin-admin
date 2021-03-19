<template>
  <div class="form-container">
    <div class="form-do-container">
      <CommonDoArea :sync-list-func="listData" :show-hospital-filter="false" />
    </div>

    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column :label="$t('myUser.name')">
        <template slot-scope="{ row }">
          名字：<span>{{ row.name }}</span
          ><br />
          性别：<span>{{ consts.sex[row.sex] }}</span
          ><br />
        </template>
      </el-table-column>

      <el-table-column :label="$t('myUser.body')">
        <template slot-scope="{ row }">
          手机：<span>{{ row.mobile }}</span
          ><br />
          邮箱：<span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('myUser.body')">
        <template slot-scope="{ row }">
          身高：<span>{{ row.hight }}</span
          ><br />
          体重：<span>{{ consts.sex[row.weight] }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('myUser.body')">
        <template slot-scope="{ row }">
          出生日期：<span>{{ row.birthday | parseTime('{y}-{m}-{d}') }}</span
          ><br />
          怀孕日期：<span>{{ row.pregnancy_start | parseTime('{y}-{m}-{d}') }}</span
          ><br />
          预产期：<span>{{ row.pregnancy_end | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="已绑定腕带">
        <template slot-scope="{ row }">
          <ul>
            <li v-for="w in row.wristband_list" :key="w.id">
              <el-tag>{{ w.code }}</el-tag>
            </li>
          </ul>
        </template>
      </el-table-column>

      <el-table-column label="是否授权拍摄">
        <template slot-scope="{ row }">
          <el-tag type="success">{{ row.is_authorized ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="false" :label="$t('common.do')" align="center">
        <template slot-scope="{ row }">
          <router-link :to="'/my/users/' + row.id + '/bind-wristband'">
            <el-button type="text">{{ $t('myUser.bindWristband') }}</el-button> </router-link
          ><br />

          <router-link :to="'/my/users/' + row.id + '/unbind-wristband'">
            <el-button type="text">{{ $t('myUser.unbindWristband') }}</el-button>
          </router-link>
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

      list: [],
      loading: true,

      pageInfo: {},
      query: this.$route.query,
      imageSrc: '',
      showDialog: false,
      showBind: false,
      showUnbind: false,
      targetId: '',
    }
  },
  created() {
    this.listData(this.query)
  },
  methods: {
    listData(query) {
      this.loading = true
      this.$api.Users.listMyUsers(query).then(res => {
        this.list = res.data
        this.pageInfo = res.page_info
        this.loading = false
      })
    },
    showBindDialog(data) {
      this.showBind = true
      this.targetId = data.id
    },
  },
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.image-preview {
  width: 150px;
  height: 150px;
}
ul {
  list-style: none;
  padding-left: 0;
  li {
    padding-bottom: 4px;
  }
}
</style>
