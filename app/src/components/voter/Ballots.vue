<template>
    <div>
        <loading :active.sync="isLoading" ></loading>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link to="/voter" class="navbar-brand col-sm-3 col-md-2 mr-0" >Smart Voting <span class="text-success">VOTER</span> </router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
            </button>
            <div class="container">
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Account Status
                        </a>
                        <!-- Here's the magic. Add the .animate and .slide-in classes to your .dropdown-menu and you're all set! -->
                        <div class="dropdown-menu dropdown-menu-right animate slideIn" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <table id="ballot-table" class="table mt-4 table-striped table-hover ml-1">
            <thead class="thead-light text-center" style="text-transform:uppercase">
                <th width=11% >title</th>
                <th width=15% >candidates</th>
                <th width=11% >district</th>
                <th width=11% >start time</th>
                <th width=11% >end time</th>
                <th width=5% >key</th>
                <th width=15% >description</th>
                <th width=5% >status</th>
                <th></th>
            </thead>
            <tbody class="text-center">
                <tr v-for="(ballot) in ballots" :key="ballot.id" class="bg-white">
                    <td class="bg-white text-center align-middle">{{ballot.title}}</td>
                    <td>{{ballot.candidates}}</td>
                    <td>{{ballot.districts}}</td>
                    <td>
                        {{ballot.starttime}}
                    </td>
                    <td>
                        {{ballot.endtime}}
                    </td>
                    <td>
                       <font-awesome-icon icon="key" class="key-hover text-warning" size="lg" @click="openKeyModal(ballot)"/>
                    </td>
                    <td>
                        {{ballot.description}}
                    </td>
                    <td>
                        <span v-if="ballot.is_deployed" class="text-success">deployed</span>
                        <span v-else><button class="btn btn-success">deploy</button></span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm">vote</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled': !pagination.has_prev}">
                <a class="page-link" href="#" aria-label="Previous"
                    @click.prevent="getBallots(pagination.current_page-1)">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                <li class="page-item" v-for="page in pagination.total_pages" :key="page"
                    :class="{'active':pagination.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getBallots(page)">{{page}}</a>
                </li>
                <li class="page-item" :class="{'disabled': !pagination.has_next}">
                <a class="page-link" href="#" aria-label="Next" 
                    @click.prevent="getBallots(pagination.current_page+1)">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
                </li>
            </ul>
        </nav>
        <div class="modal" id="KeyModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ballot Key</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div><span class="font-weight-bold">Public Key E: </span>{{currentKey.E}}</div>
                        <hr>
                        <div style="word-wrap:break-word"> <span class="font-weight-bold">Public Key N:</span> {{currentKey.N}}</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    data(){
        return{
            ballots: [],
            pagination: {},
            tempBallot: {},
            currentKey:{},
            isNew: false,
            isLoading: false,
        };
    },
    methods:{
        getBallots(page = 1){
            const api = `${process.env.APIPATH}/voter/ballots?page=${page}`;
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response)=>{
            console.log(response.data);
            vm.isLoading = false;
            vm.ballots=response.data.ballots;
            vm.pagination = response.data.pagination;
            })
        },
        openModal(isNew, ballot){
            this.getCandidateList();
            $('#newballotModal').modal('show');
            if(isNew){
                this.tempBallot = {};
                this.isNew = true;
            }else{
                this.tempBallot = Object.assign({}, ballot);
                this.isNew = false;
            }
        },
        openKeyModal(ballot){
            const vm=this;
            $('#KeyModal').modal('show');
            vm.currentKey = Object.assign({},ballot.key);
        },
    },
    created(){
        this.getBallots();
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css" lang="scss">
</style>
<style lang="scss">
.key-hover{
        transition: transform 0.2s;
        cursor:pointer;
        &:hover{
            transform: scale(2);
            transform: rotate(45deg);
        }
    }
    @media (min-width: 992px) {
  .animate {
    animation-duration: 0.3s;
    -webkit-animation-duration: 0.3s;
    animation-fill-mode: both;
    -webkit-animation-fill-mode: both;
  }
}

@keyframes slideIn {
  0% {
    transform: translateY(1rem);
    opacity: 0;
  }
  100% {
    transform:translateY(0rem);
    opacity: 1;
  }
  0% {
    transform: translateY(1rem);
    opacity: 0;
  }
}

@-webkit-keyframes slideIn {
  0% {
    -webkit-transform: transform;
    -webkit-opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    -webkit-opacity: 1;
  }
  0% {
    -webkit-transform: translateY(1rem);
    -webkit-opacity: 0;
  }
}

.slideIn {
  -webkit-animation-name: slideIn;
  animation-name: slideIn;
}

/* Other styles for the page not related to the animated dropdown */

body {
  background: #007bff;
  background: linear-gradient(to right, #0062E6, #33AEFF);
}
.navbar-brand{
    background: #f8f9fa;
}
</style>