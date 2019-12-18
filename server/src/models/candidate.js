const mongoose  = require('../db').mongoose;
const autoincrement =  require('../db').autoincrement;
const CandidateSchema  = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true
    },
    dob:{
        type: Date,
        require: true
    },
    code:{
        type: String,
    },
    title:{
        type: String,
        require: false
    },
    cid:{
        type: Number
    }
})
CandidateSchema.plugin(autoincrement,{inc_field:'cid'});
//create candidate code
CandidateSchema.pre('save', function(next){
    var date = new Date(this.dob);
    var month = date.getMonth();
    var day = date.getDate();
    var name_array = this.name.split(" ");
    var code= "";
    for (i=0; i<name_array.length; i++){
        code = code + name_array[i].charAt(0);
    }
    code = code + this.age + month + day;
    this.code = code;
    next();
})
const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;