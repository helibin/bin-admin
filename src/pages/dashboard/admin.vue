<template>
  <div class="dashboard-editor-container">
    <panel-group :dashboard-data="dashboardData" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="currentLineChartData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
  },
  data() {
    return {
      dashboardData: {},
      lineChartData: {},
      currentLineChartData: {},
    }
  },
  created() {
    this.$api.Dashboard.getOverview().then(({ data }) => {
      this.dashboardData = data
    })
    this.$api.Dashboard.getOverviewLine().then(({ data }) => {
      this.lineChartData = data
      this.handleSetLineChartData('user')
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.currentLineChartData = this.lineChartData[type]
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
