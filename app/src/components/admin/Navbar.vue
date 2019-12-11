<template>
    <div>
        <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
            <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
            <ul class="navbar-nav px-3">
                <li class="nav-item text-nowrap">
                <a class="nav-link" href="#" @click="signout">Sign out</a>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        signout(){
            const vm = this;
            const api = `${process.env.APIPATH}/admin/signout`;
            this.$http.post(api).then((response)=>{
                if(response.data.success){
                    vm.$router.push('/login');
                }
            })
            }
    }
}
</script>