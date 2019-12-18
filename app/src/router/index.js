import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/admin/Dashboard'
import Login from '@/components/pages/Login'
import Ballots from '@/components/pages/Ballots'
import Candidates from '@/components/pages/Candidates'

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
          name:'Ballots',
          component: Ballots,
        },
        {
          path: 'candidates',
          name: 'Candidates',
          component: Candidates,
        }
      ]
    },
  ]
})