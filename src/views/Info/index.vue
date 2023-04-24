<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showLoadingToast } from 'vant'
import { ref } from 'vue'
import { getInfo, updataStatus } from '@/api/count'
import { localStorage } from '@/utils/local-storage'
const dataInfo = reactive({
  data: {
    empEvnRescue: {
      status: '',
      description: '',
      reasonname: '',
      rescue_source: '',
    },
    empRescueVehicle: {},
    empRescuedVehicle: {
      pic_path: '',
      vehicle_type: '',
      vehicle_name: '',
    },
  },
})
const route = useRoute()
const router = useRouter()
const id = route.query.id
const showImage = ref(false)
const getData = async (params) => {
  const res = await getInfo(params)
  if (res.code === 200)
    dataInfo.data = res.data
}
const ruleType = localStorage.get('ruleType')
getData(id)
// 跳转到操作页
const operation = async () => {
  if (dataInfo.data.empEvnRescue.status === '5') {
    const obj = dataInfo.data.empEvnRescue
    obj.status = '6'
    const res = await updataStatus(obj)
    if (res.code === 200) {
      router.replace({
        name: 'main',
      })
    }
    return
  }
  if (dataInfo.data.empEvnRescue.status === '4') {
    router.push({
      name: 'Dispatch',
      query: {
        id,
      },
    })
    return
  }
  router.push({
    name: 'Release',
    query: {
      id,
    },
  })
}
const btnName = (query) => {
  switch (query) {
    case '3':
      return '接单'
    case '4':
      return '派单'
    case '5':
      return '出发'
    case '6':
      return '到达'
    case '7':
      return '完成'
  }
}
const cancelName = (query) => {
  switch (query) {
    case '4':
      return '取消'
    case '5':
      return '取消'
    case '6':
      return '空驶'
    case '7':
      return '空驶'
  }
}
const show = ref(false)
const content = ref('')
const cancelData = () => {
  show.value = true
}
const onSubmit = async () => {
  const toast = showLoadingToast({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '加载中...',
  })
  const name = cancelName(dataInfo.data.empEvnRescue.status)
  const obj = {
    id,
    empRescueVehicle: dataInfo.data.empRescueVehicle,
    rescue_source: dataInfo.data.empEvnRescue.rescue_source,
    canceltext: content.value,
    end_status: name === '空驶' ? 2 : 1,
  }
  const res = await updataStatus(obj)
  toast.close() // 清除加载效果
  if (res.code === 200) {
    show.value = false
    router.replace({
      name: 'main',
    })
  } else {
    showFailToast({
      message: '接口异常',
    })
  }
}
</script>

<template>
  <div class="container">
    <TopMenu>
      <ListCard :is-btn="false" :is-navigation="true" :form-data="dataInfo.data" />
      <div class="info-detail">
        <h4>现场描述</h4>
        <p v-if="dataInfo.data.empEvnRescue?.description">
          {{ dataInfo.data.empEvnRescue.description }}
        </p>
        <van-divider />
        <van-image
          v-if="dataInfo.data.empRescuedVehicle?.pic_path"
          width="80"
          height="80"
          fit="cover"
          :src="dataInfo.data.empRescuedVehicle.pic_path"
          @click="showImage = true"
        />
      </div>
      <div class="info-detail">
        <van-cell v-if="dataInfo.data.empEvnRescue?.reasonname" :border="false" title="救援类型" :value="dataInfo.data.empEvnRescue.reasonname" />
        <van-cell v-if="dataInfo.data.empRescuedVehicle?.vehicle_type" :border="false" title="救援车辆类型" :value="dataInfo.data.empRescuedVehicle.vehicle_name" />
      </div>
      <div style="height: 60px" />
      <!-- 权限改了又改 -->
      <div v-if="dataInfo.data.empEvnRescue?.status !== '8' && ((ruleType === '1' && dataInfo.data.empEvnRescue?.status === '4') || ruleType === '2')" class="flower-btn">
        <van-button v-if="dataInfo.data.empEvnRescue?.status" type="primary" style="flex: 1; margin-left: 0;" @click.stop="operation">
          {{ btnName(dataInfo.data.empEvnRescue.status) }}
        </van-button>
        <van-button v-if="dataInfo.data.empEvnRescue?.status" type="default" style="flex: 1; margin-left: 20px;" @click.stop="cancelData">
          {{ cancelName(dataInfo.data.empEvnRescue.status) }}
        </van-button>
      </div>
    </TopMenu>
    <van-dialog
      v-model:show="show"
      :confirm-button-disabled="true"
      :cancel-button-disabled="true"
      @click.stop="() => { return }"
    >
      <van-form @submit="onSubmit">
        <van-field
          v-model="content"
          type="textarea"
          label-align="top"
          :label="`${cancelName(dataInfo.data.empEvnRescue.status)}理由`"
          rows="3"
          :border="true"
          :placeholder="`请输入${cancelName(dataInfo.data.empEvnRescue.status)}理由`"
          :rules="[{ required: true, message: `${cancelName(dataInfo.data.empEvnRescue.status)}理由必填` }]"
        />
        <div class="form-btn">
          <van-button type="primary" native-type="submit">
            提交
          </van-button>
          <van-button type="default" @click.stop="show = false">
            取消
          </van-button>
        </div>
      </van-form>
      <template #footer />
    </van-dialog>
    <van-dialog v-model:show="showImage" close-on-click-overlay :show-confirm-button="false" @click.stop="() => { showImage = false }">
      <img v-if="dataInfo.data.empRescuedVehicle?.pic_path" style="width: 100%;height: 80vh;object-fit: contain;" :src="dataInfo.data.empRescuedVehicle.pic_path">
    </van-dialog>
  </div>
</template>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;

  :deep(.van-field__body) {
    border: 1px #E6E6E6 solid;
    padding: 10px;
    border-radius: 3px;
  }

  .form-btn {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
  }

  .flower-btn {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 60px;
    padding: 10px;
    background-color: #fff;
  }

  .info-detail {
    margin: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 7px;

    h4 {
      margin: 10px 0;
    }
  }
}
</style>
