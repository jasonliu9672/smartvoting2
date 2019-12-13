const mongoose  = require('../db')
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);
const BallotSchema  = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    candidates:{
        type: [Number],
        required: true,
        trim: true,
    },
    districts:{
        type: Number,//change to Number array in the future
        required: true,
    },
    startTime:{
        type: Date,
        default: Date.now,
        required: true
    },
    endTime:{
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
BallotSchema.plugin(AutoIncrement,{inc_field:'id'});
const Ballot = mongoose.model('Ballot', BallotSchema);

module.exports = Ballot;