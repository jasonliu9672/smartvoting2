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
      background-image: url("assets/backgroundImage2.jpg");
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
}
</style>
