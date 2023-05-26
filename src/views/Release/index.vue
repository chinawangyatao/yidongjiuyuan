<script setup lang="ts">
import { showConfirmDialog, showFailToast, showLoadingToast,showDialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { getInfo, upDataImg, updataStatus } from '@/api/count'
import { compressImage } from '@/utils/compress'
const countMoney = ref('')
const show = ref(false)
const uploadImage = ref([])
const fileList = ref([])
const messageInfo = ref('上传定位信息')
let dataInfo = reactive({
  empEvnRescue: {
    status: '',
    id: '',
  },
  empRescuedVehicle: {
    picid_list: '',
  },
})
const imgObj = ref('')
const route = useRoute()
const router = useRouter()
const beforeRead = (file: any) => {
  if (Array.isArray(file) && file.length) {
    file.forEach((item) => {
      if (item.type !== 'image/jpeg' && item.type !== 'image/png' && item.type !== 'image/jpg') {
        showFailToast('请选择正确图片格式上传')
        return false
      }
    })
    return file
  } else {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
      showFailToast('请选择正确图片格式上传')
      return false
    }
    return file
  }
}
const getServeImg = async (file: any) => {
  const toast = showLoadingToast({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '加载中...',
  })
  const params = new FormData()
  params.append('file', file)
  params.append('source', '2')
  // const res = await upDataImg(params)
  // 这里直接调取App后台接口
  fetch('http://140.249.206.14:8788/smartroad/forpublic/uploadImg', {
    method: 'POST',
    body: params,
  }).then(res => res.json()).then((data) => {
    window.console.log(data)
    imgObj.value = data.data
    window.console.log(imgObj.value)
    // alert(data.data)
    toast.close() // 清除加载效果
  }).catch((err) => {
    showFailToast('图片上传失败', err)
  })
  // toast.close() // 清除加载效果
  // if (res.code !== 200) {
  //   showFailToast('图片上传失败')
  //   return
  // }
  // window.console.log(JSON.parse(res.data))
  // imgObj.value = JSON.parse(res.data)
}
const afterRead = (file: any) => {
  // 不转base64，直接上传
  // getServeImg(file.file)
  compressImage(file.content).then((result) => {
    window.console.log('压缩后的结果', result) // result即为压缩后的结果
    window.console.log('压缩前大小', file.file.size)
    window.console.log('压缩后大小', result.size)
    if (result.size > file.file.size) {
      window.console.log('上传原图')
      // 压缩后比原来更大，则将原图上传
      getServeImg(file.file)
    } else {
      // 压缩后比原来小，上传压缩后的
      window.console.log('上传压缩图')
      getServeImg(result)
    }
  })
  if (Array.isArray(file) && file.length) {
    file.forEach((item) => {
      uploadImage.value.push(item.file)
    })
  } else {
    uploadImage.value.push(file.file)
  }
}
const deleteImg = (file: any) => {
  for (let i = 0, len = uploadImage.value.length; i < len; i++) {
    if (file.file.name === uploadImage.value[i].name && file.file.size === uploadImage.value[i].size) {
      uploadImage.value.splice(i, 1)
      break
    }
  }
}

const uploadFile = async () => {
  if (countMoney.value === '' && dataInfo.empEvnRescue.status === '8') {
    await showDialog({
      title: '提示',
      message:
        '金额不能为空',
      theme: 'round-button',
    })
    return
  }
  if (uploadImage.value && uploadImage.value.length) {
    const toast = showLoadingToast({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '加载中...',
    })
    const { status, id } = dataInfo.empEvnRescue
    const picid_list = dataInfo.empRescuedVehicle?.picid_list
    const countMoneyFloat = parseFloat((+countMoney.value).toFixed(2))
    const row = parseInt(status) + 1
    const sendStatus = {
      id,
      status: row,
      end_status: 0,
      rescue_vehicles: [
        {
          picidList: `${picid_list ? `${picid_list},` : ''}${imgObj.value.id}`,
        },
      ],
      charged: countMoneyFloat,
    }
    const obj = await updataStatus(sendStatus)
    toast.close() // 清除加载效果
    if (obj.code === 200) {
      router.replace({
        name: 'main',
      })
    } else {
      showFailToast({
        message: '接口异常',
      })
    }
  } else {
    window.console.log(imgObj.value.id)
  }
}
const getData = async (params) => {
  const res = await getInfo(params)
  if (res.code === 200) {
    dataInfo = res.data
    if (res.data.empEvnRescue.status === '8') {
      show.value = true
      messageInfo.value = '上传收费凭证'
    } else {
      messageInfo.value = '上传定位信息'
    }
  }
}
// 确认弹窗
onMounted(() => {
  const id = route.query.id
  getData(id)
})
</script>

<template>
  <div class="container">
    <!--    <TopMenu :is-back="true" menu-title="上传信息">    </TopMenu> -->
    <van-notice-bar :scrollable="false" text="系统已自动获取到您的定位" />
    <div class="workOut_0">
      <div v-if="show" class="workOut_0_1">
        <div><span class="workOut_01">上传收费金额</span></div>
        <van-form>
          <van-cell-group inset>
            <van-field
              v-model="countMoney"
              required
              type="number"
              name="金额"
              label="金额："
              placeholder="请输入金额"
              :rules="[{ required: true, message: '请填写金额' }]"
            />
          </van-cell-group>
        </van-form>
      </div>
      <div>
        <div><span class="workOut_01">{{ messageInfo }}</span></div>
        <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" :delete="deleteImg" multiple :max-count="1" />
      </div>
      <van-button
        round
        block
        type="primary"
        native-type="submit"

        @click="uploadFile()"
      >
        上传
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;

  .workOut_0 {
    margin: 25px 12px;
    font-size: 16px;
    .workOut_0_1{
      margin: 5px 0px;
    }
  }
  .workOut_01 {
    color: #333333;
  }
  .workOut_1 {
    width: 351px;
    height: 189px;
    background-color: #f1f3f5;
    margin: 6px 0 54px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 42px;
    height: 33px;
  }
  :deep(.van-button--info) {
    background: linear-gradient(-15deg, #4287de, #5ab2f5);
  }
  .van-cell{
    align-items: center;
  }
}
</style>

