<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right">
            <button class="btn btn-info mt-3" @click="openModal(true)">Add new candidate</button>
        </div>
        <div class="row mt-4">
            <div class="col-md-4 mb-4"  v-for=" candidate in candidates" :key="candidate.cid"> 
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">{{candidate.name}}</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Title: {{candidate.title}}</li>
                            <li class="list-group-item">Age: {{candidate.age}}</li>
                            <li class="list-group-item">Date of Birth: {{candidate.dob | moment("dddd, MMMM Do YYYY")}}</li>
                            <li class="list-group-item">Code: {{candidate.code}}</li>
                        </ul>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="openModal(false,candidate)">
                        <!-- <i class="fas fa-spinner fa-spin"></i> -->
                        Edit
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="openDelCandidateModal(candidate)">
                        <!-- <i class="fas fa-spinner fa-spin"></i> -->
                        Delete
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="newcandidateModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title">
                        <span>add new candidate</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form">
                            <div class="row">
                                <div class="col">
                                    <label for="name">Name</label>
                                    <input type="text" class="form-control" id="name"
                                    placeholder="please enter name" v-model="tempCandidate.name">
                                </div>
                                <div class="col">
                                    <label for="age">Age</label>
                                    <input type="number" class="form-control" id="age"
                                    placeholder="please enter age" v-model="tempCandidate.age">
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col">
                                    <label for="title">Title</label>
                                    <input type="text" class="form-control" id="title"
                                    placeholder="please enter title" v-model="tempCandidate.title">
                                </div>
                                <div class="col">
                                    <label for="dob">Day of Birth</label>
                                    <datepicker id="dob" placeholder="Select Date" v-model="tempCandidate.dob"></datepicker>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="updateCandidate">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
         <div class="modal fade" id="delCandidateModal" tabindex="-1" role="dialog" aria-labelledby="delCandidateModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Delete Candidate {{tempCandidate.title}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this candidate?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="delCandidate">Delete</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import Datepicker from 'vuejs-datepicker';
export default {
    data(){
        return{
            candidates: [],
            tempCandidate: {},
            isLoading: false,
            isNew: false,
        };
    },
    components:{
        Datepicker
    },
    methods:{
        getCandidates(){
            const api = `${process.env.APIPATH}/candidates?page=1`;
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response)=>{
                console.log(response.data);
                vm.isLoading = false;
                vm.candidates=response.data.candidates;
            })
        },
        openModal(isNew, candidate){
            $('#newcandidateModal').modal('show');
            if(isNew){
                this.tempCandidate = {};
                this.isNew = true;
            }else{
                this.tempCandidate = Object.assign({}, candidate);
                this.isNew = false;
            }
        },
        openDelCandidateModal(candidate){
            const vm=this;
            $('#delCandidateModal').modal('show');
            vm.tempCandidate = Object.assign({},candidate);
        },
         delCandidate(){
            const vm = this;
            const api = `${process.env.APIPATH}/candidates/${vm.tempCandidate.cid}`;
            this.$http.delete(api).then((response)=>{
                console.log(response.data);
                $('#delCandidateModal').modal('hide');
                this.getCandidates();
            })
        },
        updateCandidate(){
            let api = `${process.env.APIPATH}/candidates`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.APIPATH}/candidates/${vm.tempCandidate.cid}`;
                httpMethod = 'put'
            }
            this.$http[httpMethod](api,{data:vm.tempCandidate}).then((response)=>{
                console.log(response.data);
                if(response.data.success){
                    $('#newcandidateModal').modal('hide');
                    vm.getCandidates();
                }else{
                    $('#newcandidateModal').modal('hide');
                    vm.getCandidates();
                    console.log('新增失敗');
                }
            })
        },
        uploadFile(){
            console.log(this);
            const uploadedFile = this.$refs.files.files[0];
            const vm=this;
            const formData = new FormData();
            formData.append('file-to-upload',uploadedFile);
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
            vm.status.fileUploading = true;
            this.$http.post(url,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }).then((response)=>{
                console.log(response.data);
                vm.status.fileUploading = false;
                if(response.data.success){
                    vm.$set(vm.tempProduct,'imageUrl',response.data.imageUrl);
                }else{
                    this.$bus.$emit('message:push',response.data.message,'danger');
                }
            })
        }
    },
    created(){
       this.getCandidates();
    }
}
</script>