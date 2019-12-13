import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/admin/Dashboard'
import Login from '@/components/pages/Login'
import Ballots from '@/components/pages/Ballots'
import CustomerOrders from '@/components/pages/CustomerOrders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'*',
      redirect:'login',
      meta:{
        title:'smartvoting'
      }
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
          path:'ballots',
          name:'ballots',
          component: Ballots,
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