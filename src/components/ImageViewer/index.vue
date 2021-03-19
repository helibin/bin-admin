<template>
  <div class="form-dialog">
    <el-dialog
      :visible.sync="showDialog"
      :append-to-body="true"
      title="预览"
      custom-class="image-dialog"
      width="50%"
      @close="handleClose"
    >
      <img v-if="initFileType === 'image'" :src="initFileSrc" class="file-preview" />
      <video v-if="initFileType === 'video'" :src="initFileSrc" controls class="file-preview" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    initFileSrc: {
      type: String,
      default: '',
    },
    initFileType: {
      type: String,
      default: 'image',
    },
  },
  computed: {
    showDialog: {
      get: function() {
        return this.initFileSrc !== ''
      },
      set: () => {},
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:imageSrc', '')
    },
  },
}
</script>

<style scoped>
.image-dialog {
  margin-top: 0;
}
.file-preview {
  max-height: 500px;
  max-width: 100%;
  transform: translate(-50%);
  margin-left: 50%;
}
</style>
