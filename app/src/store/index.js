import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const secureRandom = require('secure-random');
const BigInteger = require('jsbn').BigInteger;
Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state:{
        status:'',
        token:localStorage.getItem('token') || '',
        //for unblinding
        ballot_id_list:[]
        //user:{}
    },
    getters:{
        getBallotIdlist: state =>{
            return state.ballot_id_list
        }
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
        },
        addBallot(state, ballot_id){
            state.ballot_id_list.push(ballot_id)
        },
        removeBallot(state,ballot_id){
            state.ballot_id_list = state.ballot_id_list.filter( ballot =>{
                ballot != ballot_id
            })
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
        },
        generateSecret({commit,getters},ballot_list){
            return new Promise((resolve, reject)=>{
                const bigOne = new BigInteger('1');
                console.log(ballot_list)
                ballot_list.forEach((ballot) =>{
                    let new_ballot_id = ballot.id
                    if(localStorage.getItem(new_ballot_id.toString()) === null){
                        let gcd;
                        let r;
                        let N = new BigInteger(ballot.N);
                        do {
                            r = new BigInteger(secureRandom(64)).mod(N);
                            gcd = r.gcd(N);
                        } while (
                            !gcd.equals(bigOne) ||
                            r.compareTo(N) >= 0 ||
                            r.compareTo(bigOne) <= 0
                        );
                        console.log(new_ballot_id)
                        localStorage.setItem(new_ballot_id,r)
                        commit('addBallot', {new_ballot_id})
                    }
                })
                resolve()
             })
        }    
    },
    getters:{
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status
    }

})