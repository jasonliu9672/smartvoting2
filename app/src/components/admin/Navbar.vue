<template>
    <div>
        <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <router-link to="/admin/ballots" class="navbar-brand col-sm-3 col-md-2 mr-0 text-dark" >Smart Voting <span class="text-danger">CA</span> </router-link>
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
            this.$store.dispatch('logout')
            vm.$router.push('/login');
        }
    }
}
</script>