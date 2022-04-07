import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import Pagination from "@/components/Pagination";

Vue.use(ElementUI);
Vue.config.productionTip = false
// 全局组件挂载
Vue.component('Pagination', Pagination)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
