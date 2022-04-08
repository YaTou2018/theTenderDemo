import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout';

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Layout,
    redirect: '/bid',
    children: [
      {
        path: 'home',
        component: () => import('../views/ztb/index.vue'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      },
      {
        path: 'bid',
        component: () => import('../views/ztb/UploadFile.vue'),
        name: '首页',
        meta: { title: '首页', icon: '', noCache: true, affix: true }
      },
    ]
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
  },
]

const router = new VueRouter({
  routes
})

export default router
