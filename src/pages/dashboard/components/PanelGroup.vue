<template>
  <div>
    <el-row v-if="['admin', 'agent'].includes($store.getters.user.type)" :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('user')">
          <div class="card-panel-icon-wrapper icon-user">
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户数/销户数</div>
            <count-to
              :start-val="0"
              :end-val="dashboardData.total_user_count || 0"
              :duration="2600"
              class="card-panel-num"
            />
            <span class="card-panel-num-split" />
            <count-to
              :start-val="0"
              :end-val="dashboardData.delete_user_count || 0"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('group')">
          <div class="card-panel-icon-wrapper icon-device">
            <svg-icon icon-class="device" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div slot="reference" class="card-panel-text">圈子数/多人圈</div>
            <count-to
              :start-val="0"
              :end-val="dashboardData.group_count || 0"
              :duration="3000"
              class="card-panel-num"
            />
            <span class="card-panel-num-split" />
            <count-to
              :start-val="0"
              :end-val="dashboardData.group_mult_member_count || 0"
              :duration="3000"
              class="card-panel-num-second"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('note')">
          <div class="card-panel-icon-wrapper icon-video">
            <svg-icon icon-class="video" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">发帖数/今日发帖</div>
            <count-to :start-val="0" :end-val="dashboardData.note_count || 0" :duration="3000" class="card-panel-num" />
            <span class="card-panel-num-split" />
            <count-to
              :start-val="0"
              :end-val="dashboardData.note_today_count || 0"
              :duration="3000"
              class="card-panel-num-second"
            />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('resource')">
          <div class="card-panel-icon-wrapper icon-wristband">
            <svg-icon icon-class="wristband" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">图片数/视频数</div>
            <count-to
              :start-val="0"
              :end-val="dashboardData.picture_count || 0"
              :duration="3200"
              class="card-panel-num"
            />
            <span class="card-panel-num-split" />
            <count-to
              :start-val="0"
              :end-val="dashboardData.video_count || 0"
              :duration="3000"
              class="card-panel-num-second"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: { CountTo },
  props: {
    dashboardData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    handleSetLineChartData(type) {
      type = 'user'
      this.$emit('handleSetLineChartData', type)
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
    padding-right: 0;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-user {
        background: #40c9c6;
      }
      .icon-device {
        background: #36a3f7;
      }
      .icon-video {
        background: #34bfa3;
      }
      .icon-wristband {
        background: #864686;
      }
    }
    .icon-user {
      color: #40c9c6;
    }
    .icon-device {
      color: #36a3f7;
    }
    .icon-video {
      color: #34bfa3;
    }
    .icon-wristband {
      color: #864686;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 16px 0 0 10px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 40px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 24px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
      .card-panel-num-split::before {
        content: '/';
        font-size: 20px;
      }
      .card-panel-num-second {
        font-size: 14px;
      }
    }
  }
}
</style>
