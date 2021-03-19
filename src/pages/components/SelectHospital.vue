<template>
  <div>
    <!-- <el-cascader
      v-model="cityCode"
      :options="area"
      :change-on-select="false"
      :show-all-levels="false"
      filterable
      placeholder="省市"
      class="area"
      @change="changeArea"
    /> -->
    <el-select
      v-model="getHospitalId"
      :origin-data="syncHospitalId"
      :placeholder="hospitalList.length ? '请选择医院' : '暂无医院'"
      clearable
      prop="hospital_id"
      @change="changeHospital"
    >
      <el-option
        v-for="d in syncHospitalList.length ? syncHospitalList : hospitalList"
        :key="d.id"
        :label="d.name"
        :value="d.id"
      />
    </el-select>
  </div>
</template>

<script>
// import area from '@/data/pc-code.json'

export default {
  props: {
    syncRequired: {
      type: Boolean,
      default: false,
    },
    syncHospitalId: {
      type: String,
      default: '',
    },
    syncHospitalList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // area,

      // cityCode: [],
      hospitalList: this.$store.getters.hospitals,
    }
  },
  computed: {
    getHospitalId: {
      get: function() {
        return this.syncHospitalId
      },
      set: function(d) {
        this.hospitalId = d
      },
    },
  },
  created() {
    if (!this.syncHospitalList.length) {
      this.listHospital()
    }
  },
  methods: {
    // getAreaName(val, opt) {
    //   return val.map(value => {
    //     for (let d of opt) {
    //       if (d.value == value) {
    //         opt = d.children
    //         return d.label
    //       }
    //     }
    //   })
    // },
    // async changeArea(val) {},
    async listHospital() {
      this.hospitalList = this.$store.getters.hospitals
    },
    changeHospital() {
      this.$emit('sync', this.hospitalId)
    },
  },
}
</script>
<style scoped>
/* .area {
  width: 100px;
} */
</style>
