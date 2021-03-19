<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <error-log class="bug right-menu-item" />

      <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
        <screenfull class="screenfull right-menu-item" />
      </el-tooltip>
      <el-tooltip :content="$t('navbar.lang')" effect="dark" placement="bottom">
        <lang-select class="international2 right-menu-item" />
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img
            v-if="user.file_path"
            :src="$store.getters.env.baseURL + user.file_path + '?w=150'"
            class="user-avatar"
            alt="头像"
          />
          <svg-icon v-else icon-class="user" />
          <span class="user-name">{{ $store.getters.user.name || $store.getters.user.identifier }}</span>
          <span v-if="$store.getters.user.hospital_name" class="user-hospital"
            >({{ $store.getters.user.hospital_name }})</span
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item> 角色：{{ consts.manageUserType[$store.getters.user.type] }} </el-dropdown-item>

          <router-link to="/settings/change-password">
            <el-dropdown-item divided>
              {{ $t('navbar.changePassword') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="signOut">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import consts from '@/data/consts'

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
  },
  data() {
    return {
      consts,
    }
  },
  computed: { ...mapGetters(['sidebar', 'user']) },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    async signOut() {
      await this.$api.Auth.signOut()
      this.$store.dispatch('user_signOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
      font-size: 24px;
    }
    .screenfull {
      height: 100%;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        .user-avatar {
          width: 25px;
          height: 25px;
          border-radius: 10px;
          vertical-align: middle;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .user-name {
      font-size: 18px;
    }
    .user-hospital {
      font-size: 14px;
    }
  }
}
</style>
