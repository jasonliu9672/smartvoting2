const mongoose  = require('../db')
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);
const CandidateSchema  = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    age:{
        type: Number,
        require: false
    },
    title:{
        type: String,
        require: false
    }
})
CandidateSchema.plugin(AutoIncrement,{inc_field:'id'});
const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;