<template>
  <div class="pagination-container">
    <el-pagination
      :current-page="Number(query.page || syncPageInfo.page)"
      :page-sizes="[2, 5, 10, 20, 30, 50, 100]"
      :page-size="Number(query.page_size || syncPageInfo.page_size)"
      :total="syncPageInfo.total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    syncPageInfo: {
      type: Object,
      default: () => ({
        page: 1,
        page_size: 20,
        total: 0,
      }),
    },
    syncListFunc: {
      type: Function,
      default: () => [],
    },
  },
  data() {
    return {
      query: this.$route.query,
    }
  },
  created() {},
  methods: {
    async handleSizeChange(val) {
      this.query.page_size = val
      await this.syncListFunc({ t: Date.now(), ...this.query })
    },
    async handlePageChange(val) {
      this.query.page = val
      await this.syncListFunc({ t: Date.now(), ...this.query })
    },
  },
}
</script>
