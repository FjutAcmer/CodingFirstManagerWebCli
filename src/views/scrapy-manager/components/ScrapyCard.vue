<template>
  <div class="card-container">
    <el-avatar :size="50" :src="data.targetWebsiteLogoUrl" fit="cover" />
    <span class="name-span">{{ data.spiderName }}</span>
  </div>
</template>

<script>
export default {
  name: 'OJSiteCard',
  props: {
    data: undefined
  },
  watch: {
    data(val) {
      this.data = val
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.card-container {
  &:hover {
    cursor: pointer;
    .name-span {
      color: lightblue;
      font-weight: bold;
    }
  }
  width: 50px;
  .oj-icon-img {
    width: 50px;
    height: 50px;
  }
}
</style>
