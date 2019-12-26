const mongoose  = require('../db').mongoose;
const autoincrement =  require('../db').autoincrement;
const BallotSchema  = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    candidates:{
        type: [String],
        required: true,
        trim: true,
    },
    districts:{
        type: Number,//change to Number array in the future
        required: true,
    },
    starttime:{
        type: Date,
        default: Date.now,
        required: true
    },
    endtime:{
        type: Date,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    key:{
        type: Object,
        required: true
    }
})
BallotSchema.plugin(autoincrement,{inc_field:'id'});
const Ballot = mongoose.model('Ballot', BallotSchema);

module.exports = Ballot;