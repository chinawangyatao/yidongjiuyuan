<script setup lang="ts">
import { useRouter } from 'vue-router'
const props = defineProps({
  menuTitle: {
    type: String,
    default: '移动救援管理',
  },
  isBack: {
    type: Boolean,
    default: true,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
})
const $myemit = defineEmits(['search'])
const router = useRouter()
const backRoute = () => {
  router.go(-1)
}
const searchValue = ref('')
const getSearch = () => {
  $myemit('search', searchValue.value)
}
</script>

<template>
  <div class="menu-form" :style="props.isSearch ? '' : 'height: 70px;'">
    <div class="title">
      <span v-show="props.isBack" @click="backRoute"><van-icon name="arrow-left" /></span>
      {{ props.menuTitle }}
    </div>
    <van-search v-if="props.isSearch" v-model="searchValue" placeholder="故障名" @search="getSearch" />
    <div class="menu-body" :style="`${props.isSearch ? '' : 'top: 70px;height: calc(100vh - 70px);'}`">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
  .menu-form {
    position: fixed;
    width: 100vw;
    height: 120px;
    background-color: #6eaef4;

    .title {
      position: absolute;
      top: 20px;
      padding: 10px;
      color: #fff;
      font-size: 16px;
    }
    .van-search {
      position: relative;
      top: 60px;
      background-color: #6eaef4;
    }
    .menu-body {
      position: absolute;
      width: 100vw;
      height: calc(100vh - 120px);
      top: 120px;
      overflow-y: scroll;
    }
  }
</style>
