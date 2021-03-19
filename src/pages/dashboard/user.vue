<template>
  <div class="dashboard-editor-container">
    <h2>
      欢迎您，{{ $store.getters.user.name || $store.getters.user.identifier }}。您的医院：{{
        $store.getters.user.hospital_name || '未分配'
      }}
    </h2>

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'

const lineChartData = {
  users: {
    data: [120, 82, 91, 154, 162, 140, 145],
  },
  device: {
    data: [180, 160, 151, 106, 145, 150, 130],
  },
  video: {
    data: [120, 90, 100, 138, 142, 130, 130],
  },
  wristband: {
    data: [120, 82, 91, 154, 162, 140, 130],
  },
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
  },
  data() {
    return { lineChartData: lineChartData.users }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  padding-top: 1px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
