<template>
  <el-form :inline="true" :model="formData" class="search-form" @submit.native.prevent>
    <el-form-item v-if="showSearchFilter">
      <el-input v-model="formData.q" :autofocus="true" placeholder="关键字" @keyup.enter.native="submitForm">
        <el-button slot="prepend" icon="el-icon-search" />
      </el-input>
    </el-form-item>

    <el-form-item v-if="showDateFilter">
      <div class="block">
        <el-date-picker
          v-model="caclDateFilter"
          :picker-options="pickerOptions"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
      </div>
    </el-form-item>

    <!-- <el-form-item v-if="showHospitalFilter">
      <SelectHospital :sync-hospital-id="hospital_id" @sync="syncHospitalId" />
    </el-form-item> -->

    <el-form-item>
      <el-button type="primary" @click="submitForm">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SelectHospital from '@/pages/components/SelectHospital'

export default {
  components: {
    SelectHospital,
  },
  props: {
    syncListFunc: {
      type: Function,
      default: () => [],
    },
    showSearchFilter: {
      type: Boolean,
      default: true,
    },
    showDateFilter: {
      type: Boolean,
      default: false,
    },
    showHospitalFilter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formData: { during: null },
      query: this.$route.query,
      dateFilter: '',
      hospital_id: '',

      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
    }
  },
  computed: {
    caclDateFilter: {
      get: function() {
        return this.dateFilter
      },
      set: function(d) {
        this.during = d
        this.dateFilter = d
      },
    },
  },
  methods: {
    syncHospitalId(targetId) {
      this.hospital_id = targetId
      this.formData.hospital_id = targetId || undefined
    },
    submitForm() {
      this.syncListFunc(Object.assign({}, this.query, this.formData, { during: this.during }))
    },
  },
}
</script>

<style lang="scss" scoped>
.search-form {
  display: inline-block;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
