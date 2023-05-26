<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast, showLoadingToast } from 'vant'
import { useRouter } from 'vue-router'
import { androidMap } from '@/utils/android'
import { updataStatus } from '@/api/count'
const props = defineProps({
  formData: {
    type: Object,
    default: () => { },
  },
  isBtn: {
    type: Boolean,
    default: true,
  },
  isNavigation: {
    type: Boolean,
    default: false,
  },
})
const $myemit = defineEmits(['load'])
const router = useRouter()
// 跳转到操作页
const operation = async (query: any) => {
  if (props.formData.empEvnRescue.status === '3' || props.formData.empEvnRescue.status === '5') {
    const obj = props.formData.empEvnRescue
    obj.status = parseInt(props.formData.empEvnRescue.status) + 1
    const res = await updataStatus(obj)
    if (res.code === 200)
      $myemit('load')
    return
  }
  if (props.formData.empEvnRescue.status === '4') {
    router.push({
      name: 'Dispatch',
      query: {
        id: query,
      },
    })
    return
  }
  if (props.formData.empEvnRescue.status === '8') {
    router.push({
      name: 'Release',
      query: {
        id: query,
      },
    })
    console.log('zouzhekli')
    return
  }
  router.push({
    name: 'Release',
    query: {
      id: query,
    },
  })
}
const content = ref('')
const show = ref(false)
const countMoney = ref(0)
const statusMeony = ref(0)
// 取消及空使弹窗处理
const cancelData = () => {
  show.value = true
}
// 确认空驶处理
const onSubmit = async () => {
  const toast = showLoadingToast({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '加载中...',
  })
  const obj = {
    id: props.formData.empEvnRescue.id,
    empRescueVehicle: props.formData.empRescueVehicle,
    rescue_source: props.formData.empEvnRescue.rescue_source,
    canceltext: content.value,
    end_status: cancelName === '空驶' ? 2 : 1,
  }
  const res = await updataStatus(obj)
  toast.close() // 清除加载效果
  if (res.code === 200) {
    $myemit('load')
    show.value = false
  } else {
    showFailToast({
      message: '接口异常',
    })
  }
}
// let countMoneyFloat = parseFloat((+countMoney.value).toFixed(2))
// 确认提交金额
const onSubmitMoeny = () => {
  statusMeony.value = 9
  onSubmit()
}
const navPosition = (data: any) => {
  const { geometry } = data
  if (geometry)
    androidMap('标注点', geometry)
    // 高德地图，安卓跳转地图展示
    // window.location.href = `androidamap://viewMap?sourceApplication=appname&poiname=${'标注点'}&lat=${geometry.split(',')[1]}&lon=${geometry.split(',')[0]}&dev=0`
}
const makePhone = (phoneNum: String) => {
  window.location.href = `tel://${phoneNum}`
}
const labelColor = computed(() => {
  const query = props.formData.empEvnRescue.status
  switch (query) {
    case '3':
      return 'linear-gradient( 30deg, transparent, transparent 50%, #f3cc95 50%,  #f09825 100% )'
    case '4':
      return 'linear-gradient( 30deg, transparent, transparent 50%, #b0ed92 50%,  #abc75d 100% )'
    case '5':
      return 'linear-gradient( 30deg, transparent, transparent 50%, #b0ed92 50%,  #7bc75d 100% )'
    case '6':
      return 'linear-gradient( 30deg, transparent, transparent 50%, #aeecd4 50%,  #70c8ac 100% )'
    case '7':
      return 'linear-gradient( 30deg, transparent, transparent 50%, #a8cff7 50%,  #6db4ff 100% )'
    case '8':
      return 'linear-gradient( 30deg, transparent, transparent 50%, #d6d6d6 50%,  #a8a8a8 100% )'
  }
})
const statusName = computed(() => {
  const query = props.formData.empEvnRescue.status
  if (props.formData.empEvnRescue?.end_status === '0') {
    switch (query) {
      case '3':
        return '待接收'
      case '4':
        return '待派车'
      case '5':
        return '待发车'
      case '6':
        return '待到达'
      case '7':
        return '待拖离'
      case '8':
        return '已拖离'
      case '9':
        return '已完成'
    }
  } else if (props.formData.empEvnRescue?.end_status === '1') {
    return '取消'
  } else if (props.formData.empEvnRescue?.end_status === '2') {
    return '空驶'
  }
})
const btnName = computed(() => {
  const query = props.formData.empEvnRescue.status
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
      return '拖离'
    case '8':
      return '确认'
  }
})
const cancelName = computed(() => {
  const query = props.formData.empEvnRescue.status
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
})
</script>

<template>
  <div>
    <div v-if="props.formData.empEvnRescue?.end_status === '0' || props.formData.empEvnRescue?.end_status === '1' || props.formData.empEvnRescue?.end_status === '2'" class="card-box">
      <div class="card-label">
        NO.{{ formData.empEvnRescue.evn_num }}
        <div class="label" :style="`background: ${labelColor}`">
          <span>{{ statusName }}</span>
        </div>
      </div>
      <div class="card-info">
        <div>
          <span>{{ props.formData.empEvnRescue.reasonname }}</span>
          {{ formData.empEvnRescue.splicingname }}
        </div>
        <div v-show="isNavigation" class="nav" @click.stop="navPosition(props.formData.empEvnRescue)">
          <img
            class="label_2" referrerpolicy="no-referrer"
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/psivxiecqublphl8lj3mtxj47koqquq0cqg5223e2fe-15b9-460c-b88f-ead65aab98b4"
          >
        </div>
      </div>
      <div v-if="props.formData.empEvnRescue.status !== '3' && props.formData.empRescuedVehicle" class="card-detail">
        <div>车牌号： {{ props.formData.empRescuedVehicle.plate || '' }} </div>
        <div>
          被救人员： {{ `${props.formData.empRescuedVehicle.user_name || ''}
                  ${props.formData.empRescuedVehicle.phone_number || ''}` }}
        </div>
        <div class="img" @click.stop="makePhone(props.formData.empRescuedVehicle.phone_number)">
          <img
            referrerpolicy="no-referrer"
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/psc9r16z0uk3n8y7ddf2m0d6qqmxn46vlnq0369ca67-fa32-42dc-957a-ea4f2b5e02d9"
          >
        </div>
      </div>
      <div class="card-btn">
        <div v-if="!(props.formData.empEvnRescue?.end_status === '1' || props.formData.empEvnRescue?.end_status === '2')">
          <van-button
            v-if="props.isBtn && btnName" type="primary"
            @click.stop="operation(props.formData.empEvnRescue.id)"
          >
            {{ btnName }}
          </van-button>
          <van-button v-if="props.isBtn && cancelName" type="default" @click.stop="show = true">
            {{ cancelName }}
          </van-button>
        </div>
        <span>{{ props.formData.empEvnRescue.starttime }}</span>
      </div>
    </div>
    <!-- 添加阻止穿透效果 -->
    <van-dialog
      v-model:show="show" :confirm-button-disabled="true" :cancel-button-disabled="true"
      @click.stop="() => { return }" @touchmove.stop.prevent="() => { return }"
    >
      <van-form @submit="onSubmit">
        <van-field
          v-model="content" type="textarea" label-align="top" :label="`${cancelName}理由`" rows="3" :border="true"
          :placeholder="`请输入${cancelName}理由`" :rules="[{ required: true, message: `${cancelName}理由必填` }]"
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
  </div>
</template>

<style lang="less" scoped>
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

.card-box {
  position: relative;
  top: 40px;
  margin: 10px;
  padding: 10px;
  color: #222;
  border-radius: 15px 15px 7px 7px;
  background-color: #FFFFFF;
  margin-bottom: 55px;

  .card-label {
    position: absolute;
    padding: 10px;
    width: 100%;
    left: 0;
    top: -38px;
    color: #999999;
    background-color: #fff;
    border-radius: 7px 7px 15px 15px;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 10px;
      width: calc(100% - 20px);
      border-top: dashed 1px #E1EEFC;
    }

    .label {
      position: absolute;
      top: 0;
      right: 0;
      width: 47.5px;
      height: 30px;
      border-radius: 0px 5px 0px 0px;
      background: linear-gradient(30deg,
          transparent,
          transparent 50%,
          #aeecd4 50%,
          #70c8ac 100%);

      span {
        position: absolute;
        top: 1px;
        left: 3px;
        display: inline-block;
        width: 45px;
        height: 25px;
        line-height: 13px;
        text-align: right;
        color: #ffff;
        font-weight: 400;
        font-family: Source Han Sans SC;
        transform: rotate(30deg) scale(0.8);
        font-size: 10px;
      }
    }
  }

  .card-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 17px;
    color: #222;

    span {
      display: inline-block;
      border-radius: 3px;
      padding: 1px 2px;
      font-size: 14px;
      background-color: #F9F9F9;
      color: #999999;
    }

    .nav {
      width: 20px;
      height: 20px;
      margin-right: 20px;
      cursor: pointer;

      img {
        margin-top: 5px;
        width: 20px;
        height: 15px;
      }
    }
  }

  .card-detail {
    position: relative;
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
    border-radius: 7px;
    background-color: #F5F5F5;

    div {
      line-height: 2;
    }

    .img {
      position: absolute;
      width: 45px;
      height: 45px;
      right: 20px;
      top: 10px;
      text-align: center;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0px 0px 10px 0px rgba(110, 174, 244, 0.15);

      img {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
      }
    }
  }

  .card-btn {
    display: flex;
    justify-content: space-between;
    padding-top: 12px;

    span {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #999999;
    }
  }
}
.van-cell{
  align-items: center ;
}
</style>
