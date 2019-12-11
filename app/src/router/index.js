import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/admin/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'
import CustomerOrders from '@/components/pages/CustomerOrders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'*',
      redirect:'login'
    },

    {
      path:'/login',
      name:'Login',
      component:Login
    },

    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      meta: {requiresAuth: true},
      children:[
        {
          path:'products',
          name:'products',
          component: Products,
        },
        {
          path: 'customer-orders',
          name: 'CustomerOrders',
          component: CustomerOrders,
        }
      ]
    },
  ]
})