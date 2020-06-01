<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '一码当先后台管理系统',
      logo:
        'data:image/jpeg;base64,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'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
