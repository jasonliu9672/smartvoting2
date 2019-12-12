const mongoose  = require('../db')
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
        type: [Number],
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
    key:{
        type: Object,
        required: true
    }
})
const Ballot = mongoose.model('Ballot', BallotSchema);

module.exports = Ballot;