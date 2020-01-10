var express = require('express');
var Ballot = require('../models/ballot');
var router = express.Router();
router.get('/ballots',(req,res) =>{
    const size = 9; // results per page
    const page = req.query.page || 1;
    var query = {};
    var has_prev,has_next;
    query.skip = size * (page-1);
    query.limit = size;
    Ballot.countDocuments({},function(err,totalCount){
        if(err){
            res.json({success:false,
                    message:"Error fetching data."});
        }
        Ballot.find({},{},query,function(err,ballots){
            //only display deployed contract
            ballots = ballots.filter(ballot => ballot.is_deployed)
            //remove private key for voter 
            ballots.forEach(ballot => delete ballot.key.d)
            if(err){
                res.json({success:false,
                        message:"Error fetching data."});
            }else{
                var totalPages = Math.ceil(totalCount/size);
                has_prev = (page > 1);
                has_next = (page < totalPages);
                res.json({success:true,
                          ballots:ballots,
                          pagination:{
                              current_page:page,
                              total_pages:totalPages,
                              has_prev:has_prev,
                              has_next:has_next
                          }}
                )
            }
        });
    })
})
module.exports = router;