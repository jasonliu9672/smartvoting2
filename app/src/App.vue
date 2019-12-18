<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    this.$http.interceptors.response.use(function(request){
      return request;
    },function(err){
      return new Promise(function(resolve, reject){
        if(err.status === 401 && err.config && !err.config.__isRetryRequest){
          this.$store.dispatch(logout);
          reslove();
        }
        reject(err);
      })
    })
  }
}
</script>

<style lang="scss">
@import "./assets/all.scss";
body{
       background: url("assets/backgroundImage2.jpg") no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}
</style>
