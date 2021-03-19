<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" class="form-main-container">
      <el-form-item>
        <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        <el-tree
          ref="treeData"
          :data="privilegeList"
          :default-checked-keys="defaultPrivileges"
          :filter-node-method="filterNode"
          accordion
          current-node-key="formData.privileges"
          show-checkbox
          node-key="key"
        />
      </el-form-item>

      <el-form-item>
        <el-button style="margin-left: 10px;" type="primary" @click="submitForm">确认 </el-button>
      </el-form-item>
    </el-form>
    {{ this.$refs.tree }}
  </div>
</template>

<script>
import consts from '@/data/consts'
import privileges from '@/data/privileges'

export default {
  data() {
    return {
      consts,

      treeData: {},
      filterText: '',
      formData: {},
      privileges,
      defaultPrivileges: [],
      targetId: this.$route.params && this.$route.params.id,
    }
  },
  computed: {
    privilegeList() {
      const pList = []
      for (const p in this.privileges) {
        const data = { key: p, label: this.$t('privilege.' + p), children: [] }
        const pl = this.privileges[p]
        for (const d in pl) {
          data.children.push({ key: d, label: pl[d] })
        }
        pList.push(data)
      }
      return pList
    },
  },
  watch: {
    filterText(val) {
      this.$refs.treeData.filter(val)
    },
  },
  created() {
    this.$baseAPI.get('manage-users', this.targetId).then(({ data }) => {
      this.formData.privileges = data.privileges
      this.defaultPrivileges = data.privileges && data.privileges.split(',')
      this.originData = data
    })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    submitForm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.formData.privileges = this.$refs.treeData.getCheckedKeys().toString()
          if (this.formData.privileges !== this.originData.privileges) {
            this.$api.ManageUsers.modify(this.targetId, { privileges: this.formData.privileges })
          }

          this.$router.push({ path: '/manage-users/list' })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.form-container {
  position: relative;

  .form-main-container {
    padding: 40px 15%;
  }
}
</style>
