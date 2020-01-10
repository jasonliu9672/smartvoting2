import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/admin/Dashboard'
import Login from '@/components/pages/Login'
import AdminBallots from '@/components/admin/Ballots'
import Candidates from '@/components/admin/Candidates'
import VoterBallots from '@/components/voter/Ballots'

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
          name:'AdminBallots',
          component: AdminBallots,
        },
        {
          path: 'candidates',
          name: 'Candidates',
          component: Candidates,
        }
      ]
    },
    {
      path: '/voter',
      name: 'VoterBallots',
      component: VoterBallots,
      meta: {requiresAuth: true},
    },
  ]
})