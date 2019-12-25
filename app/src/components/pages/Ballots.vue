<template>
    <div>
        <loading :active.sync="isLoading" ></loading>
        <div class="text-right">
            <button class="btn btn-info mt-3" @click="openModal(true)">Create New Ballot</button>
        </div>
        <table class="table mt-4 table-dark table-striped table-hover">
            <thead class="thead-light">
                <th width="150">title</th>
                <th width="100">number of district</th>
                <th width="100">number of candidate</th>
                <th width="100">start time</th>
                <th width="100">end time</th>
                <th width="150">key</th>
            </thead>
            <tbody>
                <tr v-for="(ballot) in ballots" :key="ballot.id">
                    <td>{{ballot.title}}</td>
                    <td>{{ballot.candidates}}</td>
                    <td>{{ballot.districts}}</td>
                    <td class="text-right">
                        {{ballot.startTime}}
                    </td>
                    <td class="text-right">
                        {{ballot.endTime}}
                    </td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">deployed</span>
                        <span v-else>undeployed</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false, ballot)">edit</button>
                        <button class="btn btn-outline-danger btn-sm" @click="openDelBallotModal(ballot)">delete</button>
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
                                        <p>{{tempBallot.starttime}}</p>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="endtime">End Date</label>
                                        <date-picker id="endtime" name="date" v-model="tempBallot.endtime" :config="options"></date-picker>
                                        <!-- <datepicker id="endtime" :format="customFormatter" placeholder="Select Date" v-model="tempBallot.endTime"></datepicker> -->
                                         <p>{{tempBallot.endtime}}</p>
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
            isNew: false,
            isLoading: false,
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
                this.tempBallot = Object.assign({}, item);
                this.isNew = false;
            }
        },
        openDelBallotModal(item){
            const vm=this;
            $('#delBallotModal').modal('show');
            vm.tempBallot = Object.assign({},item);
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
            if(!vm.isNew){
                api = `${process.env.APIPATH}/ballots/${vm.tempBallot.id}`;
                httpMethod = 'put'
            }
            this.$http[httpMethod](api,{data:vm.tempBallot}).then((response)=>{
                console.log(response.data);
                if(response.data.success){
                    $('#newballotModal').modal('hide');
                    vm.getBallots();
                }else{
                    $('#newballotModal').modal('hide');
                    vm.getBallots();
                }
            })
        },
    },
    created(){
        this.getBallots();
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css">

</style>