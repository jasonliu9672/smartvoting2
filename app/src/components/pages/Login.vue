<template>
  <div class="login">
    <form class="form-signin mt-5" @submit.prevent="login">
        <h3 class="mb-3 font-weight-normal">Sign in</h3>
        <div class="d-flex mb-3">
          <label for="inputUsername" class="sr-only">Username</label>
          <span class="align-self-center mx-2 input-prepend-icon"><font-awesome-icon icon="user" size="lg"/></span>
          <input type="text" id="inputUsername" class="form-control" placeholder="Email address" v-model="user.username" required autofocus>
        </div>
        <div class="d-flex mb-3">
          <label for="inputPassword" class="sr-only">Password</label>
          <span class="align-self-center mx-2 input-prepend-icon"><font-awesome-icon icon="key" size="lg"/></span>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="user.password" required>
        </div>
        <div class="checkbox mb-3">
            <label>
            <input type="checkbox" value="remember-me"> Remember me
            </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
        <button type="button" class="btn btn-lg btn-danger mt-3 btn-block " data-toggle="modal" data-target="#registerModal">
          Request Account
        </button>
        <p class="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
    </form>
    <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h5 class="modal-title" id="exampleModalLabel">Sign Up</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body mx-3">
            <div class="mb-3">
              <input type="text" id="signupName"  class="form-control validate" v-model="newuser.name">
              <label data-error="wrong" data-success="right" for="signupName">Your name</label>
            </div>
             <div class="mb-3">
              <input type="email" id="signupEmail"  class="form-control validate" v-model="newuser.email">
              <label data-error="wrong" data-success="right" for="signupEmail">Your email</label>
            </div>
             <div class="mb-3">
              <input type="text" id="signupUsername"  class="form-control validate" v-model="newuser.username">
              <label data-error="wrong" data-success="right" for="signupUsername">Your username</label>
            </div>
             <div class="mb-3">
              <input type="password" id="signupPassword"  class="form-control validate" v-model="newuser.password">
              <label data-error="wrong" data-success="right" for="signupPassword">Your password (enter password longer than 7 characters)</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="register">Register</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
        user:{
            username:'',
            password:''
        },
        newuser:{
            name:'',
            email:'',
            username:'',
            password:''
        }
    }
  },
  methods:{
     login(){
       const vm = this;
       this.$store.dispatch('login',this.user)
       .then((res)=>{
         if(res.data.success){
            console.log('hihi')
             vm.$router.push({path:'/admin/products'});
         }
       })
     },
      // signin(){
      //   this.$store.dispatch()
      //   // const api = `${process.env.APIPATH}/admin/signin`;
      //   // const vm = this;
      //   // this.$http.post(api,vm.user).then((response)=>{
      //   // console.log(response.data);
      //   // if(response.data.success){
      //   //     vm.$router.push('/admin');
      //   //     localStorage.setItem('jwt',response.data.token)
      //   // }
      //   // })
      // },
      register(){
        const api = `${process.env.APIPATH}/admin/register`;
        const vm = this;
        this.$http.post(api,vm.newuser).then((response)=>{
        console.log(response.data);
        if(response.data.success){
            console.log(response.data.message)
        }
        })
      }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Numans');
.form-signin {
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin: auto;
  font-family: 'Numans', sans-serif;
  color: white;
  background-color: rgba(0,0,0,0.5) !important;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.input-prepend-icon{
  font-size: 15px;;
  color:#FFC312;
}
</style>
