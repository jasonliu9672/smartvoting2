<template>
    <div>
        <loading :active.sync="isLoading" ></loading>
        <div class="text-right">
            <button class="btn btn-info mt-3" @click="openModal(true)">Create New Ballot</button>
        </div>
        <table id="ballot-table" class="table mt-4 table-striped table-hover">
            <thead class="thead-light text-center" style="text-transform:uppercase">
                <th width=6% >id</th>
                <th width=11% >title</th>
                <th width=15% >candidates</th>
                <th width=11% >start time</th>
                <th width=11% >end time</th>
                <th width=5% >key</th>
                <th width=15% >description</th>
                <th width=5% >status</th>
                <th></th>
            </thead>
            <tbody class="text-center">
                <tr v-for="(ballot) in ballots" :key="ballot.id" class="bg-white">
                    <td class="text-center align-middle">{{ballot.id}}</td>
                    <td class="text-center align-middle">{{ballot.title}}</td>
                    <td class="align-middle">{{ballot.candidates}}</td>
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
                    <td >
                        <div v-if="ballot.is_deployed">
                             <h5><span class="badge badge-success">deployed</span></h5>
                             <h6>contract address: {{ballot.contract_address}}</h6>
                        </div>
                        <span v-else><button class="btn btn-danger" @click="deploy(ballot.id)">deploy</button></span>
                    </td>
                    <td>
                        <template v-if="!ballot.is_deployed">
                            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, ballot)">Edit</button>
                            <button class="btn btn-outline-danger btn-sm mt-1" @click="openDelBallotModal(ballot)">Delete</button>
                        </template>
                        <button v-else class="btn btn-outline-danger btn-sm" @click="collectVote(ballot)">Collect Vote</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="modal fade" id="newballotModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>create new ballot</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="title">Title</label>
                                    <input type="text" class="form-control" id="title"
                                        placeholder="please enter title" v-model="tempBallot.title">
                                </div>
                                <div class="form-group">
                                    <div>
                                        <label class="typo__label">Candidates</label>
                                        <multiselect id="candidates" v-model="tempBallot.candidates" :options="candidateList" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="select candidates" label="name" track-by="name" :preselect-first="true">
                                            <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} candidate selected</span></template>
                                        </multiselect>
                                        <!-- <pre class="language-json"><code></code></pre> -->
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="districts">Districts</label>
                                    <input type="number" class="form-control" id="districts"
                                        placeholder="please enter districts" v-model="tempBallot.districts">
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="starttime">Start Date</label>
                                        <date-picker id="starttime" name="date" v-model="tempBallot.starttime" :config="options"></date-picker>
                                        <!--<datepicker id="starttime" placeholder="Select Date" v-model="tempBallot.startTime"></datepicker> -->
                                        <!-- <p>{{tempBallot.starttime}}</p> -->
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="endtime">End Date</label>
                                        <date-picker id="endtime" name="date" v-model="tempBallot.endtime" :config="options"></date-picker>
                                        <!-- <datepicker id="endtime" :format="customFormatter" placeholder="Select Date" v-model="tempBallot.endTime"></datepicker> -->
                                         <!-- <p>{{tempTime}}</p> -->
                                    </div>
                                </div>
                                <hr>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="description">Description</label>
                                        <textarea class="form-control" id="description" rows="5" cols="45" v-model="tempBallot.description"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="updateBallot">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
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
         <div class="modal fade" id="delBallotModal" tabindex="-1" role="dialog" aria-labelledby="delBallotModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Delete Ballot {{tempBallot.title}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this ballot?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="delBallot">Delete</button>
                </div>
                </div>
            </div>
        </div>
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
                    <hr>
                    <div style="word-wrap:break-word"><span class="font-weight-bold">Private Key D:</span> {{currentKey.D}}</div>
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
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import moment from 'moment';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
// Using font-awesome 5 icons
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
$.extend(true, $.fn.datetimepicker.defaults, {
  icons: {
    time: 'far fa-clock',
    date: 'far fa-calendar',
    down: 'fas fa-arrow-down',
    previous: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    today: 'fas fa-calendar-check',
    clear: 'far fa-trash-alt',
    close: 'far fa-times-circle'
  }
});
export default {
    data(){
        return{
            ballots: [],
            pagination: {},
            tempBallot: {},
            currentKey:{},
            isNew: false,
            isLoading: false,
            current: null,
            status:{
                fileUploading: false,
            },
            candidateList:[],
             options: {
                date: null,
                format: 'DD/MM/YYYY h A',
                useCurrent: false,
                showClear: true,
                showClose: true,
            }
        };
    },
    components:{
        Datepicker,
        Multiselect,
        //datePicker
    },
    methods:{
        deploy(id) {
            const api = `${process.env.APIPATH}/ballots/deploy/${id}`;
            this.$http.get(api).then(() => {
                this.getBallots();
                this.$bus.$emit('message:push','deploy success!','success');
            })
        },
        customFormatter(date) {
            return moment(date).format('MMMM Do YY');
        },
        getBallots(page = 1){
            const api = `${process.env.APIPATH}/ballots?page=${page}`;
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response)=>{
            console.log(response.data);
            vm.isLoading = false;
            vm.ballots=response.data.ballots;
            vm.pagination = response.data.pagination;
            })
        },
        getCandidateList(){
            const api = `${process.env.APIPATH}/candidates/list`;
            const vm =this;
            this.$http.get(api).then((response)=>{
                console.log(response.data);
                vm.candidateList = response.data.candidateList;
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
        openDelBallotModal(ballot){
            const vm=this;
            $('#delBallotModal').modal('show');
            vm.tempBallot = Object.assign({},ballot);
        },
        openKeyModal(ballot){
            const vm=this;
            $('#KeyModal').modal('show');
            vm.currentKey = Object.assign({},ballot.key);
        },
        delBallot(){
            const vm = this;
            const api = `${process.env.APIPATH}/ballots/${vm.tempBallot.id}`;
            this.$http.delete(api).then((response)=>{
                console.log(response.data,vm.tempBallot);
                $('#delBallotModal').modal('hide');
                this.getBallots();
            })
        },
        updateBallot(){
            let api = `${process.env.APIPATH}/ballots`;
            let httpMethod = 'post';
            const vm = this;
            let newballot = Object.assign({},vm.tempBallot);
            newballot.endtime = vm.tempTime.endobject;
            console.log(typeof(newballot.endtime));
            newballot.starttime = vm.tempTime.startobject;
            if(!vm.isNew){
                api = `${process.env.APIPATH}/ballots/${newballot.id}`;
                httpMethod = 'put'
            }
            this.$http[httpMethod](api,{data:newballot}).then((response)=>{
                console.log(response.data);
                if(response.data.success){
                    this.$bus.$emit('message:push','update successfully!','success');
                    $('#newballotModal').modal('hide');
                    vm.getBallots();
                }else{
                    this.$bus.$emit('message:push','update failed!','danger');
                    $('#newballotModal').modal('hide');
                    vm.getBallots();
                }
            })
        },
        collectVote(ballot){
            let id = ballot.id;
            const api = `${process.env.APIPATH}/ballots/collectvote/${id}`;
            const vm = this;
            vm.$http.get(api).then((response)=>{
                console.log(response.data)
            })
        }
    },
    computed:{
        tempTime: function(){
            let start = this.tempBallot.starttime;
            let end = this.tempBallot.endtime;
            let start_array,end_array,starthour,endhour, startdate,enddate;
            let startobject, endobject;
            if(start && end){
                start_array = start.split(" ");
                end_array = end.split(" ");
                startdate = start_array[0].split("/");
                enddate = end_array[0].split("/");
                if(start_array[2] == "PM" && start_array[1] != 12){
                    starthour = parseInt(start_array[1]) + 12;
                }
                else{
                    starthour = parseInt(start_array[1]);
                }
                if(end_array[2] == "PM" && end_array[1] != 12){
                    endhour = parseInt(end_array[1]) + 12;
                }
                else{
                    endhour = parseInt(end_array[1]);
                }
                startobject = new Date(parseInt(startdate[2]),parseInt(startdate[1])-1,parseInt(startdate[0]),starthour,0,0);
                endobject = new Date(parseInt(enddate[2]),parseInt(enddate[1])-1,parseInt(enddate[0]),endhour,0,0);
                // startobject = new Date(2020,1,20,10,0,0);
                // endobject = new Date(2020,1,20,10,0,0);
                startobject = startobject.toUTCString();
                endobject = endobject.toUTCString();
                // console.log(parseInt(enddate[2]),parseInt(enddate[1]),parseInt(enddate[0]),endhour)
            }
            return {startobject,endobject}
        }
    },
    created(){
        this.getBallots();
        this.current = new Date();
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
// #ballot-table{
//     font-size:1rem;
// }
</style>