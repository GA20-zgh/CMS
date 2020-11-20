import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
// import Login from '../components/login.vue'
// import Home from '../components/home.vue'
// import Welcome from '../components/welcome.vue'
// import Users from '../components/user/users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Categories from '../components/commodity/categories.vue'
// import Goods from '../components/commodity/goods.vue'
// import Params from '../components/commodity/params.vue'
// import Orders from '../components/order/orders.vue'
// import Add from '../components/commodity/Add.vue'
// import Report from '../components/reports/reports.vue'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

const Categories = () => import(/* webpackChunkName: "Categories_Goods_Params" */ '../components/commodity/categories.vue')
const Goods = () => import(/* webpackChunkName: "Categories_Goods_Params" */ '../components/commodity/goods.vue')
const Params = () => import(/* webpackChunkName: "Categories_Goods_Params" */ '../components/commodity/params.vue')

const Orders = () => import(/* webpackChunkName: "Orders_Add_Report" */ '../components/order/orders.vue')
const Add = () => import(/* webpackChunkName: "Orders_Add_Report" */ '../components/commodity/Add.vue')
const Report = () => import(/* webpackChunkName: "Orders_Add_Report" */ '../components/reports/reports.vue')

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { // 定义路由规则
    path: '/login', component: Login
  },
  {
    // 定义路由规则 redirect:重定向
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/Rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/params', component: Params },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Report }
    ]
  }
]
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫, 没登陆则跳到登录页
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径来
  // next 是一个函数， 表示放行， next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
