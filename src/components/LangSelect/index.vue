<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="i18n" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh-CN'" command="zh-CN">中文</el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en-US'" command="en-US">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    },
  },
  methods: {
    handleSetLanguage(locale) {
      this.$i18n.locale = locale
      this.$store.dispatch('setLanguage', locale)
      this.$message({
        message: 'Switch Language Success',
        type: 'success',
      })
    },
  },
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
}
</style>
