// https://router.vuejs.org/zh/
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入路由组件
import mian from '@/views/index.vue'
import Info from '@/views/Info/index.vue'
import Release from '@/views/Release/index.vue'
import Dispatch from '@/views/Dispatch/index.vue'
import EditNew from '@/views/EditNew/index.vue'
NProgress.configure({ showSpinner: true })

// 定义路由，每个路由都需要映射到一个组件
const routes = [
  {
    path: '/',
    name: 'main',
    component: mian,
  },
  {
    path: '/info',
    name: 'Info',
    component: Info,
  },
  {
    path: '/release',
    name: 'Release',
    component: Release,
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: Dispatch,
  },
  {
    path: '/editNew',
    name: 'EditNew',
    component: EditNew,
  },
]
// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
