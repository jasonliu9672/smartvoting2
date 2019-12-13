var express = require('express');
var Ballot = require('../models/ballot');
var router = express.Router();
var blindSignature = require('blind-signatures');
var {check, validationResult } = require('express-validator');

router.post('/create-ballot', [
    check('starttime').isAfter().withMessage('chosen date is not a valid date'),
    check('endtime').isAfter().withMessage('chosen date is not a valid date')
],(req,res) =>{
    const errors =validationResult(req);
    var title = req.body.title;
    var candidates = req.body.candidates;
    var districts = req.body.districts;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var description = req.body.description;
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    else{
        new_key = blindSignature.keyGeneration({b:2048});
        Ballot.create({
            title: title,
            candidates: candidates,
            districts: districts,
            starttime: starttime,
            endtime: endtime,
            description: description,
            key: new_key
        })
        res.json({success:true,
            message:"Ballot is created."});
    }
})
router.put('/update-ballot/:id', (req,res) =>{
    var target_id = req.params.id;
    Ballot.findByIdAndUpdate({id:target_id})
})
router.get('/get-ballots/ballots:page',(req,res) =>{
    const size = 9; // results per page
    const page = req.params.page || 1;
    var query = {};
    var has_prev,has_next;
    query.skip = size * (page-1);
    query.limit = size;
    Ballot.count({},function(err,totalCount){
        if(err){
            res.json({success:false,
                    message:"Error fetching data"});
        }
        Ballot.find({},{},query,function(err,ballots){
            if(err){
                res.json({success:false,
                        message:"Error fetching data"});
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