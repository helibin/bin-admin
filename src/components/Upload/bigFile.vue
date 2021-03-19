<template>
  <div class="upload-container">
    <el-upload action="https://httpbin.org/post">
      <el-button type="primary">上传</el-button>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'BigFileUpload',
  data() {
    return {
      tmpUrl: '',
      dataObj: {},
    }
  },
}
</script>
