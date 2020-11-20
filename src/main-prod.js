// 发布模式入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/iconfont/iconfont.css'
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// 导入axios
import axios from 'axios'
// 配置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
// axios请求拦截
// 在request 拦截器中, 展示进度条 NProgress.start()
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  NProgress.start()
  // console.log(config)
  // 为请求头添加对象， 添加token验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后return config
  return config
})
// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// Vue.prototype.$http Vue原型对象
// 每个组件都可以通过this 访问到 $http,从而发起Ajax请求
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  // 年
  const y = dt.getFullYear()
  // 月
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 日
  const d = (dt.getDate() + '').padStart(2, '0')
  // 时
  const h = (dt.getHours() + '').padStart(2, '0')
  // 分
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  // 秒
  const s = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}-${mm}-${s}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
