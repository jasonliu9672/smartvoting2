<template>
    <div>
        <loading :active.sync="isLoading" ></loading>
        <div class="text-right">
            <button class="btn btn-info" @click="openModal(true)">Create New Ballot</button>
        </div>
        <table class="table mt-4">
            <thead>
                <th width="150">title</th>
                <th width="100">number of district</th>
                <th width="100"> number of candidate</th>
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
                            <label for="title">title</label>
                            <input type="text" class="form-control" id="title"
                                placeholder="please enter title" v-model="tempBallot.title">
                        </div>
                        <div class="form-group">
                            <label for="title">title</label>
                            <input type="text" class="form-control" id="title"
                                placeholder="please enter title" v-model="tempBallot.title">
                        </div>
                        <div class="form-group">
                            <label for="districts">districts</label>
                            <input type="number" class="form-control" id="districts"
                                placeholder="please enter districts" v-model="tempBallot.districts">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="starttime">Start Time</label>
                                <input type="text" class="form-control" id="starttime"
                                placeholder="enter start time" v-model="tempBallot.startTime">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="endtime">End Time</label>
                                <input type="number" class="form-control" id="endtime"
                                placeholder="enter end time" v-model="tempBallot.endTime">
                            </div>
                        </div>
                        <hr>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="description">description</label>
                                <textarea class="form-control" id="description" rows="3" v-model="tempBallot.description"></textarea>
                            </div>
                        </div>
                        <hr>
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
import $ from 'jquery';
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
            }
        };
    },
    methods:{
        getBallots(page = 1){
            const api = `${process.env.APIPATH}/get-ballots/ballots?page=${page}`;
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
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
            this.$http.delete(api).then((response)=>{
                console.log(response.data,vm.tempBallot);
                $('#delBallotModal').modal('hide');
                this.getBallots();
            })
        },
        updateBallot(){
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
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
                    vm.$set(vm.tempBallot,'imageUrl',response.data.imageUrl);
                }else{
                    this.$bus.$emit('message:push',response.data.message,'danger');
                }
            })
        }
    },
    created(){
        this.getBallots();
    }
}
</script>