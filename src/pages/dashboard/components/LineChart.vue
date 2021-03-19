<template>
  <div :class="className" :style="{ height, width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import dayjs from 'dayjs'
import consts from '@/data/consts'

export default {
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '350px',
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartDays: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return { chart: null }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      },
    },
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions(data = {}) {
      const xAxisData = []
      for (let i = this.chartDays - 1; i >= 0; i--) {
        xAxisData.push(
          dayjs()
            .subtract(i, 'day')
            .format('MM-DD'),
        )
      }

      const dataKeys = Object.keys(data)
      const seriesData = []
      const dataColors = ['#78e8cf', '#FF8C00']

      Array.from(dataKeys, (k, idx) => {
        const _d = Array.from(xAxisData, () => 0)
        Array.from(data[k], d => {
          if (xAxisData.indexOf(d.date.slice(5)) !== -1) {
            _d[xAxisData.indexOf(d.date.slice(5))] = d.count
          }
        })
        seriesData.push({
          name: consts.dashboardView[k],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: dataColors[idx],
              lineStyle: {
                color: dataColors[idx],
                width: 2,
              },
            },
          },
          data: _d,
          animationDuration: 2800,
          animationEasing: 'quadraticOut',
        })
      })

      this.chart.setOption({
        xAxis: {
          data: xAxisData,
          boundaryGap: false,
          axisTick: { show: false },
        },
        legend: {
          right: 10,
          orient: 'vertical',
          icon: 'none',
          textStyle: {
            color: function(params) {
              return dataColors[params.dataIndex]
            },
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          padding: [5, 10],
        },
        yAxis: { axisTick: { show: false } },
        series: seriesData,
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
  },
}
</script>
