
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { localStorage } from "@/utils/local-storage";
import { showFailToast, showLoadingToast } from "vant";
import { getTeam, getGroupID, editGroup, addGroup } from "@/api/count";
const userId = localStorage.get("userId");
const route = useRoute();
const router = useRouter();
const group_id = route.query.id;
const flag = route.query.flag;
// 必填校验
const userFormRules = ref({
  group: [
    {
      required: true,
      message: "方案组不能能为空"
    }
  ],
  user_name: [
    {
      required: true,
      message: "姓名不能能为空"
    },
    {
      pattern: /^(?:[\u4E00-\u9FA5·]{2,16})$/,
      message: "请输入正确姓名"
    }
  ],
  phone_number: [
    {
      required: true,
      message: "手机号不能能为空"
    },
    {
      pattern: /^1[3|5|7|8|9]\d{9}$/,
      message: "手机号格式错误"
    }
  ],
  plate: [
    {
      required: true,
      message: "请填写车牌"
    },
    {
      pattern: /^[A-Z]{1}[A-Za-z0-9]{4}[A-Za-z0-9挂学警港澳]{1}$/,
      message: "车牌输入有误，注意字母大小写"
    }
  ]
});
const options = ref([
  { text: "鲁", value: "鲁" },
  { text: "京", value: "京" },
  { text: "陕", value: "陕" },
  { text: "沪", value: "沪" },
  { text: "川", value: "川" },
  { text: "宁", value: "宁" },
  { text: "琼", value: "琼" },
  { text: "使", value: "使" },
  { text: "吉", value: "吉" },
  { text: "领", value: "领" },
  { text: "闽", value: "闽" },
  { text: "贵", value: "贵" },
  { text: "粤", value: "粤" },
  { text: "青", value: "青" },
  { text: "藏", value: "藏" },
  { text: "津", value: "津" },
  { text: "渝", value: "渝" },
  { text: "冀", value: "冀" },
  { text: "豫", value: "豫" },
  { text: "云", value: "云" },
  { text: "辽", value: "辽" },
  { text: "黑", value: "黑" },
  { text: "湘", value: "湘" },
  { text: "皖", value: "皖" },
  { text: "赣", value: "赣" },
  { text: "新", value: "新" },
  { text: "苏", value: "苏" },
  { text: "浙", value: "浙" },
  { text: "鄂", value: "鄂" },
  { text: "桂", value: "桂" },
  { text: "甘", value: "甘" },
  { text: "晋", value: "晋" },
  { text: "蒙", value: "蒙" }
]);
const formData = reactive({
  group: '',
  groupname: "",
  phone_number: "",
  user_name: "",
  groupid: "",
  plate: "",
  plateLabe: "鲁"
});
// 控制班组弹窗
const showPicker = ref(false);
// 班组列表
const columns = ref([]);
const getColumns = async () => {
  // const res = await getTeam(userId._value)
  const res = await getTeam(733);
  if (res.code === 200) {
    columns.value = res.data.map(item => {
      return {
        text: item.lastname,
        value: item.id
      };
    });
  }
};
getColumns();
const onConfirm = ({ selectedOptions }) => {
  showPicker.value = false;
  formData.groupname = selectedOptions[0].text;
  formData.groupid = selectedOptions[0].value;
};
const onSubmit = async () => {
  const toast = showLoadingToast({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: "加载中..."
  });
  const { plateLabe, plate, groupname, groupid, user_name, phone_number, group } = formData;
  if (flag === '1') {
    const obj = {
      id: group_id,
      rescueName: group,
      lastName: groupname,
      userId: groupid,
      driverName: user_name,
      phoneNumber: phone_number,
      plate: `${plateLabe}${plate}`,
    }
    const res = await editGroup(obj)
    toast.close(); // 清除加载效果
    if (res.code === 200) {
      router.go(-1)
    } else {
      showFailToast({
        message: "接口异常"
      });
    }
  } else {
    const obj = {
      rescueName: group,
      lastName: groupname,
      userId: groupid,
      driverName: user_name,
      phoneNumber: phone_number,
      plate: `${plateLabe}${plate}`,
      createdBy: 733
      // createdBy: userId._value
    }
    const res = await addGroup(obj)
    toast.close(); // 清除加载效果
    if (res.code === 200) {
      router.go(-1)
    } else {
      showFailToast({
        message: "接口异常"
      });
    }
  }

};
onMounted(async () => {
  if (flag === '1') {
    const res = await getGroupID(group_id)
    if (res.code === 200) {
      formData.groupname = res.data.lastName
      formData.groupid = res.data.userId
      formData.phone_number = res.data.phoneNumber
      formData.user_name = res.data.driverName
      formData.plate = res.data.plate.slice(1)
      formData.plateLabe = res.data.plate.slice(0, 1)
      // 方案组名称
      formData.group = res.data.rescueName
    }
  } else {
    console.log(11);
    return
  }
})
// 车牌号输入框失去焦点时触发
const onBlur = (e) => {
  formData.plate = e.target.value.toUpperCase()
}
</script>
<template>
  <div class="container">
    <TopMenu :is-back="true" :menu-title="flag === '1' ? '修改方案组' : '新增方案组'">
      <van-form @submit="onSubmit">
        <van-field v-model="formData.group" label-align="top" label="方案组：" placeholder="请输入方案组"
          :rules="userFormRules.group">
          <template #right-icon />
        </van-field>
        <van-field v-model="formData.groupname" label-align="top" is-link readonly label="班组：" placeholder="选择班组"
          :rules="[{ required: true, message: '请选择班组' }]" @click="showPicker = true">
          <template #right-icon />
        </van-field>
        <van-popup v-model:show="showPicker" round position="bottom">
          <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>
        <van-field v-model="formData.user_name" label-align="top" label="姓名：" placeholder="请输入姓名"
          :rules="userFormRules.user_name">
          <template #right-icon />
        </van-field>
        <van-field v-model="formData.phone_number" label-align="top" label="联系电话：" placeholder="请输入联系电话"
          :rules="userFormRules.phone_number">
          <template #right-icon />
        </van-field>
        <van-field v-model="formData.plate" label-align="top" label="车牌号：" placeholder="请输入车牌号"
          :rules="userFormRules.plate" @blur="onBlur">
          <template #right-icon>
            <van-dropdown-menu>
              <van-dropdown-item v-model="formData.plateLabe" :options="options" />
            </van-dropdown-menu>
          </template>
        </van-field>
        <div class="form-btn">
          <van-button type="primary" style="flex: 1;" native-type="submit">
            {{ flag === '1' ? '修改' : '新增' }}
          </van-button>
        </div>
      </van-form>
    </TopMenu>
  </div>
</template>
<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #fff;

  .van-dropdown-menu__bar {
    position: absolute;
    z-index: 9;
    left: 50px;
    width: 60px;
    height: 48px;
  }

  .form-btn {
    display: flex;
    padding: 10px;
  }

  :deep(.van-button--info) {
    background: linear-gradient(-15deg, #4287de, #5ab2f5);
  }

  :deep(.van-field__control) {
    margin-left: 50px;
  }

  :deep(.van-dropdown-menu) {
    position: absolute;
    z-index: 9;
    top: -10px;
    left: -10px;
    width: 60px;
    height: 50px;
  }

  :deep(.van-dropdown-menu__bar) {
    width: 50px;
    height: 30px;
    box-shadow: none;
  }

  :deep(.van-dropdown-menu__item) {
    width: 50px;
    height: 40px;
  }
}
</style>
