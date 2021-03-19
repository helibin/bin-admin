<template>
  <el-cascader
    v-model="areaCode"
    :name="areaName"
    :options="area"
    :change-on-select="false"
    filterable
    placeholder="请选择省市"
    class="area"
    @change="changeArea"
  />
</template>

<script>
import pc from '@/data/pc-code.json'
import pca from '@/data/pca-code.json'

export default {
  props: {
    type: {
      type: String,
      default: 'pc',
    },
    required: {
      type: Boolean,
      default: false,
    },
    syncAreaCode: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      area: this.type === 'pc' ? pc : pca,
      areaCode: [],
      areaName: [],
    }
  },
  created() {},
  methods: {
    getAreaName(val, area) {
      return val.map(value => {
        for (let d of area) {
          if (d.value == value) {
            area = d.children
            return d.label
          }
        }
      })
    },
    changeArea(val) {
      this.areaName = this.getAreaName(val, this.area)
      this.$emit('sync', { code: this.areaCode, name: this.areaName })
    },
  },
}
</script>
<style scoped></style>
