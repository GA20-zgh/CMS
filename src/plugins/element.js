import Vue from 'vue'
// 按需导入
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 弹框组件挂载Vue原型上
Vue.prototype.$message = Message
