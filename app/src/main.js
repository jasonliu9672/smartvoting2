// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
// Import fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner,faBoxOpen,faUser,faKey,faCalendar,faClock} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'bootstrap/dist/css/bootstrap.css'
// Import this component
import datePicker from 'vue-bootstrap-datetimepicker'
// Import date picker css
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'

//Import custom dependencies
import App from './App'
import router from './router'
import './bus';
import currencyFilter from './filters/currency'
import store from './store'

library.add(faSpinner,faBoxOpen,faUser,faKey,faClock,faCalendar);

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.use(require('vue-moment'));

Vue.use(datePicker);
Vue.component('Loading',Loading);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.filter('currency',currencyFilter);

axios.defaults.withCredentials = true;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to, from, next) =>{
  console.log('hi')
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(store.getters.isLoggedIn){
      console.log('ur in')
      next()
    }
    else{
      next('login')
    }
  }
  else{
    next()
  }
});
  //   const api = `${process.env.APIPATH}/api/user/check`;
  //   axios.post(api).then((response)=>{
  //     console.log(response.data);
  //     if(response.data.success){
  //       next();
  //     } else {
  //       next({
  //         path:'/login'
  //       })
  //     }
  //  });
//   }else{
//     next();
//   }
// });

