<script setup lang="ts">
import { showLoadingToast } from 'vant'
import { ref } from 'vue'
import { localStorage } from '@/utils/local-storage'
import { getList, timeposition } from '@/api/count'
import { closeSocket } from '@/utils/socket'
const listData = ref([])
const isLoading = ref(false)
const ruleType = ref('0')
const router = useRouter()
const userId = ref('')
const usreInfo = ref({})
const active = ref(1)
const show = ref(false)
const valueKeywords = ref('')

const getDepartments = async (value) => {
  isLoading.value = true
  const obj = {
    stake: value, // 搜索参数
    // userid: 735,//改这里
    userid: userId.value,
    oldOrNew: active.value,
  }
  const toast = showLoadingToast({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '数据加载中，请稍后...',
  })
  const res = await getList(obj)
  localStorage.set('userId', userId)
  isLoading.value = false
  if (res.code === 200) {
    ruleType.value = res.message
    listData.value = res.data
    localStorage.set('ruleType', ruleType.value)
  }
  // 清空搜索框
  valueKeywords.value = ""
  // show.value = false
  toast.close()
}
// 搜索
const searchInfo = () => {
  getDepartments(valueKeywords.value)
}
const onClickTab = () => {
  getDepartments()
}
const goInfo = (item: any) => {
  if (item.empEvnRescue.status === '3')
    return
  router.push({ name: 'Info', query: { id: item.empEvnRescue.id } })
}
const timer = ref(0)
// const timer2 = ref(0)
// 定时获取当前用户的地址坐标
const timingPositioningUpload = () => {
  em.ready(() => {
    em.getLocation({
      locationType: '', // 默认使用高德定位，如果要google地图则值为：Google
      timeout: 2, // 高德定位超时时间默认最小2秒，时间越长越准
      needGeocode: true, // 是否需要逆地理编码(位置名称) 不需要可以自行解析
      // ios_googleMap_key: 'cbb4f7fee06898a9f4b6e832972f347e',// old
      ios_googleMap_key: '7046844086a225d684c2a758775219db', // new
      // 此处传递的key的优先级高
      // and_googleMap_key: 'cbb4f7fee06898a9f4b6e832972f347e',
      and_googleMap_key: '7046844086a225d684c2a758775219db',
      async success(res: { latitude: any; longitude: any; address: any }) {
        const latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
        const longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
        // const speed = res.speed // 速度，以米/每秒计
        // const accuracy = res.accuracy // 位置精度
        const address = res.address // 地理位置，如上海市浦江镇泛联航路泛微软件软件大厦
        // const locationType = res.locationType //定位类型 Google或者Amap 表明定位使用的地图
        // const name = res.name //建筑物所在的名称 如泛微软件软件大厦等地名 (google独有)
        // const locationList = res.locationList
        const obj = {
          description: address,
          groupid: userId.value,
          groupname: usreInfo.value.name,
          position: `${longitude},${latitude}`, // 组合经纬度，发给后端
        }
        // alert(`定位信息${JSON.stringify(obj)}`)
        localStorage.set('position', `${longitude},${latitude}`)
        await timeposition(obj)
      },
    })
  })
}
// socket返回值
const handleData = (msg: any) => {
  window.console.log(`语音返回：${msg}`)
  em.playVoice({
    text: '您有新的救援工单',
    success(_argument: any) {
      window.console.log('播报语音')
    },
  })
}
// socket 返回的错误信息
const handleError = (errMsg: any) => {
  window.console.log(errMsg)
}
const getAbility = () => {
  em.ready(() => {
    // 执行接口调用
    em.getUserInfo({
      userId: '',
      success(argument: { userlist: {}[] }) {
        // alert(JSON.stringify(argument.userlist[0].id))
        userId.value = argument.userlist[0].id
        usreInfo.value = argument.userlist[0]
        localStorage.set('userId', userId.value)
        localStorage.set('usreInfo', usreInfo.value)
        // 暂注释socket
        // connectSocket(`ws://140.249.206.14:8182/websocket?userid=${userId.value}`, '', handleData, handleError)
        getDepartments()
        timingPositioningUpload()
      },
    })
  })
}
onMounted(() => {
  nextTick(() => {
    getDepartments()
    // 获取当前用户的userId
    getAbility()
    // 设置定时器，3分钟执行一次
    timer.value = window.setInterval(() => {
      getDepartments()
      timingPositioningUpload()
    }, 60000 * 3)
  })
})
// 离开当前页面时销毁定时器
onUnmounted(() => {
  window.clearInterval(timer.value)
  // 关闭webSocket连接
  closeSocket()
})
</script>

<template>
  <div class="container">
    <!--    <TopMenu :is-back="false">    </TopMenu> -->
    <van-tabs v-if="ruleType === '1'" v-model:active="active" @click-tab="onClickTab">
      <van-tab title="历史数据" />
      <van-tab title="最新数据" />
    </van-tabs>
    <van-search  v-model="valueKeywords" placeholder="请输入桩号（仅数字）" shape="round" inputmode="numeric" @search="searchInfo" />
    <van-pull-refresh
      v-if="listData.length > 0" v-model="isLoading"
      :style="ruleType === '1' ? 'height: calc(100% - 50px)' : ''" @refresh="getDepartments"
    >
      <ListCard
        v-for="(item, index) in listData" :key="index" :form-data="item"
        :is-btn="active === 1 && ruleType !== '0'" @click="goInfo(item)" @load="getDepartments"
      />
    </van-pull-refresh>
    <van-empty v-else description="暂无内容" />
  </div>
</template>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;

  .custom-title {
    margin-right: 4px;
    vertical-align: middle;
  }

  .van-pull-refresh {
    height: 100%;
    overflow-y: scroll;
  }
  .loadingClass{
    height: 100vh;
    position: relative;
    top:40%
  }
}
</style>
