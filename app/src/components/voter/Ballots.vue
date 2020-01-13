<template>
    <div>
        <loading :active.sync="isLoading" ></loading>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link to="/voter" class="navbar-brand col-sm-3 col-md-2 mr-0" >Smart Voting <span class="text-success">VOTER</span> </router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
            </button>
            <div class="container mr-0">
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
                        <li class="nav-item ml-4" >
                            <a class="nav-link" href="#" @click="signout">Sign out</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <table id="ballot-table" class="table mt-4 table-striped table-hover ml-1">
            <thead class="thead-light text-center" style="text-transform:uppercase">
                <th width=6% >id</th>
                <th width=11% >title</th>
                <th width=15% >candidates</th>
                <th width=5% >district</th>
                <th width=11% >start time</th>
                <th width=11% >end time</th>
                <th width=5% >key</th>
                <th width=15% >description</th>
                <th >action</th>
            </thead>
            <tbody>
                <tr v-for="(ballot) in ballots" :key="ballot.id" class="bg-white">
                    <td class="bg-white text-center align-middle">{{ballot.id}}</td>
                    <td class="bg-white text-center align-middle">{{ballot.title}}</td>
                    <td class="align-middle">{{ballot.candidates}}</td>
                    <td class="align-middle">{{ballot.districts}}</td>
                    <td class="align-middle">
                        {{ballot.starttime}}
                    </td>
                    <td class="align-middle"> 
                        {{ballot.endtime}}
                    </td>
                    <td class="align-middle">
                       <font-awesome-icon icon="key" class="key-hover text-warning" size="lg" @click="openKeyModal(ballot)"/>
                    </td>
                    <td>
                        {{ballot.description}}
                    </td>
                    <td class="align-middle text-center">
                        <span v-if="voteState == 5" class="badge badge-danger">voted</span>
                        <button v-else class="btn btn-primary btn" @click="openVoteModal(ballot)">vote</button>
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
        <div class="modal" id="VoteModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Vote for {{tempVote.title}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Candidates:</p>
                    <div class="form-check-inline" v-for="candidate in tempVote.candidates" :key="candidate">
                        <label class="form-check-label">
                            <input :disabled="voteState !== 1" type="radio" class="form-check-input" name="optradio" :value="candidate" v-model="tempVoteString">{{candidate}}
                        </label>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea2">Vote String:</label>
                        <textarea disabled class="form-control rounded-0" id="exampleFormControlTextarea2" rows="3" v-model="tempVoteString"></textarea>
                    </div>
                    <div class="d-flex flex-row justify-content-around">
                        <div v-if="voteState == 4" class="text-center" >
                            <div class="form-group">
                                <label for="AddressSelect">Select Vote Address</label>
                                <multiselect id="AddressSelect" v-model="selectAddress" :options="addressList" :searchable="false" :close-on-select="false" :show-labels="false" placeholder="Pick an address"></multiselect>
                            </div>
                            <button type="button" class="btn btn-danger" @click="vote()">Vote</button>
                        </div>
                        <button v-else-if="voteState == 3" type="button" class="btn btn-warning" @click="unblindVote(tempVote)">Unblind</button>
                        <div v-else-if="voteState < 3">
                            <button :disabled="voteState !== 1" type="button" class="btn btn-info" @click="blindVote(tempVote)">Blind Vote</button>
                            <button :disabled="voteState !== 2" type="button" class="btn btn-info ml-5" @click="getSign">Get Sign</button>
                        </div>
                    </div>
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
import Multiselect from 'vue-multiselect'
const sha256 = require('js-sha256')
const BigInteger = require('jsbn').BigInteger;
export default {
    data(){
        return{
            ballots: [],
            addressList: [],
            selectAddress:"",
            //save list of ballot id and its N
            // ballot_IN_list:[],
            pagination: {},
            tempBallot: {},
            currentKey:{},
            tempVote:{},
            tempVoteString:"",
            tempMessage:"",
            voteState: 1, //0 is candidate select, 1 is blinded, 2 is signed , 3 is unblinded
            isNew: false,
            isLoading: false,
        };
    },
     components: {
        Multiselect
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
                const ballot_IN_list = []
                vm.ballots.forEach(ballot =>{
                    ballot_IN_list.push({
                        id: ballot.id,
                        N: ballot.key.N
                    })
                })
                this.$store.dispatch('generateSecret',ballot_IN_list)
            })
        },
        getAddressList(){
            const api = `${process.env.APIPATH}/ballots/addresslist`;
            const vm = this;
            vm.$http.get(api).then((response)=>{
                vm.addressList = response.data.addresses
                console.log(response.data.addresses)
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
        openVoteModal(ballot){
            const vm=this; 
            $('#VoteModal').modal('show');
             vm.tempVote = Object.assign({},ballot);
             vm.voteState = 1;
             vm.tempVoteString = "";
             vm.selectAddress = "";
        },
        blindVote(ballot){
            let message = this.tempVoteString;
            if(message && typeof(message) === 'string'){
                this.tempMessage = message;
                const messageHash = sha256(message);
                let messageInt = new BigInteger(messageHash, 16);
                //store messageInt for verify test
                // this.tempMessageInt = messageInt;
                let ballot_id = ballot.id;
                let E = new BigInteger(ballot.key.E);
                let N = new BigInteger(ballot.key.N);
                let r = new BigInteger(localStorage.getItem(ballot_id));
                let blinded = messageInt.multiply(r.modPow(E,N)).mod(N);
                this.tempVoteString = blinded.toString();
                this.voteState = 2;
            }
        },
        //retrieve sign message from server
        getSign(){
            let id = this.tempVote.id;
            const api = `${process.env.APIPATH}/voter/sign/${id}`;
            const vm = this;
            let voteChoice = vm.tempVoteString;
            console.log(voteChoice)
            this.$http.post(api,{vote_string:voteChoice}).then((response)=>{
                console.log(response.data)
                if(response.data.success){
                    vm.tempVoteString = response.data.signed_message
                    vm.voteState = 3
                }
            })
        },
        unblindVote(ballot){
            const vm = this;
            let ballot_id = ballot.id;
            let r = new BigInteger(localStorage.getItem(ballot_id));
            let N = new BigInteger(ballot.key.N);
            let signed = new BigInteger(vm.tempVoteString)
            const unblinded = signed.multiply(r.modInverse(N)).mod(N);
            vm.tempVoteString = unblinded.toString();
            vm.voteState = 4;
            // vm.verify(ballot,unblinded);
        },
        vote(){
            let id = this.tempVote.id;
            const api = `${process.env.APIPATH}/ballots/vote/${id}`;
            const vm = this;
            let signed_message = vm.tempVoteString;
            let message = vm.tempMessage
            let send_address = vm.selectAddress;
            vm.$http.post(api,{signed_message:signed_message,message:message,send_address:send_address}).then((response)=>{
                if(response.data.success){
                     this.$bus.$emit('message:push','vote!','success');
                     vm.voteState = 5;
                     $('#VoteModal').modal('hide');
                }
            })
            
        },
        // verify(ballot,unblinded){
        //     const vm = this;
        //     const messageHash = vm.tempMessageInt;
        //     let unblind_message = unblinded
        //     let N = new BigInteger(ballot.key.N);
        //     let D = new BigInteger(ballot.key.D);
        //     const msgSig = messageHash.modPow(D, N);
        //     const result = unblind_message.equals(msgSig);
        //     console.log(result)
        // },
        signout(){
            const vm = this;
            this.$store.dispatch('logout');
            vm.$router.push('/login');
        },
    },
    created(){
        this.getBallots();
        this.getAddressList();
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

// body {
//   background: #007bff;
//   background: linear-gradient(to right, #0062E6, #33AEFF);
// }
.navbar-brand{
    background: #f8f9fa;
}
</style>