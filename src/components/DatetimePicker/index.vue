<template>
  <el-form>
    <el-form-item>
      <span class="demonstration">1</span>
      <el-date-picker v-model="value1" type="date" placeholder="选择日期时间" @change="handleChange" />
      <span>{{ value1 }}</span>
    </el-form-item>
    <el-form-item>
      <span class="demonstration">2</span>
      <el-date-picker
        v-model="value2"
        :picker-options="pickerOptions1"
        type="datetime"
        placeholder="选择日期时间"
        align="right"
      />
      <span>{{ value2 }}</span>
    </el-form-item>
    <el-form-item>
      <span class="demonstration">3</span>
      <el-date-picker v-model="value3" type="datetime" placeholder="选择日期时间" default-time="12:00:00" />
      <span>{{ value3 }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions1: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      value1: '',
      value2: '',
      value3: '',
    }
  },
  methods: {
    handleChange() {},
  },
}
</script>
