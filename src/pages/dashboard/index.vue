<template>
  <div class="dashboard-container">
    <admin-dashboard v-if="['admin', 'agent'].includes($store.getters.user.type)" />
    <user-dashboard v-else />
  </div>
</template>

<script>
import adminDashboard from './admin.vue'
import userDashboard from './user.vue'

export default {
  name: 'Dashboard',
  components: {
    adminDashboard,
    userDashboard,
  },
  data() {
    return {}
  },
  created() {},
}
</script>
