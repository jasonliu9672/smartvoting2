import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state:{
        status:'',
        token:localStorage.getItem('token') || '',
        //user:{}
    },
    mutations:{
        auth_request(state){
            state.status = 'loading'
        },
        auth_success(state, {token}){
            state.status = 'success'
            state.token = token
        },
        auth_fail(state){
            state.status = 'fail'
        },
        auth_error(state){
            state.status = 'error'
        },
        logout(state){
            state.status = ''
            state.status = ''
        }
    },
    actions:{
        login({commit}, user){
            return new Promise((reslove,reject)=>{
                commit('auth_request')
                let api = `${process.env.APIPATH}/admin/signin`;
                axios({url:api, data: user, method: 'POST'})
                .then( res =>{
                    const token =res.data.token;
                    //const user = res.data.user;
                    if(token){
                        localStorage.setItem('token',token);
                        axios.defaults.headers.common['Authorization'] = token;
                        commit('auth_success',{token});
                    }
                    else{
                        commit('auth_fail');
                    }
                    reslove(res);
                })
                .catch( err => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err);
                })
            })
        },
        register({commit},user){
            return new Promise((reslove,reject)=>{
                commit('auth_request')
                let api = `${process.env.APIPATH}/admin/register`;
                axios({url:api, data: user, method: 'POST'})
                .then( res =>{
                    const token =res.data.token
                    //const user = res.data.user
                    localStorage.setItem('token',token)
                    axios.defaults.headers.common['Authorization'] = token
                    commit('auth_success', {token})
                    reslove(res)
                })
                .catch( err => {
                    commit('auth_error')
                    localStorage.removeItem('token')
                    reject(err)
                })
            })
        },
        logout({commit}){
            return new Promise((resolve, reject)=>{
                commit('logout')
                localStorage.removeItem('token')
                delete axios.defaults.headers.common['Authorization']
                resolve()
            })
        }
    },
    getters:{
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status
    }

})