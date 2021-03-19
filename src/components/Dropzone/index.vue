<template>
  <uploader :options="options" class="uploader-example">
    <uploader-unsupport />
    <uploader-drop>
      <p>Drop files here to upload or</p>
      <uploader-btn>select files</uploader-btn>
      <uploader-btn :attrs="attrs">select images</uploader-btn>
      <uploader-btn :directory="true">select folder</uploader-btn>
    </uploader-drop>
    <uploader-list />
  </uploader>
</template>

<script>
export default {
  data() {
    return {
      options: {
        // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
        target: 'http://manage.muyingcc.lt/api/tests/do/upload',
        testChunks: false,
        chunkSize: 102 * 1024 * 1024,
        // simultaneousUploads: 3,
        headers: {
          'x-auth-token': this.$store.getters.token,
        },
      },
      attrs: {
        accept: 'image/*',
      },
    }
  },
}
</script>
