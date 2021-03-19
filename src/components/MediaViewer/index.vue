<template>
  <div class="form-dialog">
    <el-dialog
      :visible.sync="showDialog"
      :append-to-body="true"
      title="预览"
      custom-class="file-dialog"
      width="50%"
      @close="handleClose"
    >
      <img v-if="syncFileType === 'image'" :src="syncFileSrc" class="file-preview" />
      <video v-if="syncFileType === 'video'" :src="syncFileSrc" controls class="file-preview" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    syncFileSrc: {
      type: String,
      default: '',
    },
    syncFileType: {
      type: String,
      default: 'image',
    },
  },
  computed: {
    showDialog: {
      get: function() {
        return this.syncFileSrc !== ''
      },
      set: () => {},
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:fileSrc', '')
    },
  },
}
</script>

<style scoped>
.file-dialog {
  margin: 10px;
}
.file-preview {
  max-height: 500px;
  max-width: 100%;
  transform: translate(-50%);
  margin-left: 50%;
}
</style>
