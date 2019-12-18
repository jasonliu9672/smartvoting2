var express = require('express');
var Ballot = require('../models/ballot');
var router = express.Router();
var blindSignature = require('blind-signatures');
var {check, validationResult } = require('express-validator');

router.post('/', [
    check('starttime').isAfter().withMessage('chosen date is not a valid date'),
    check('endtime').isAfter().withMessage('chosen date is not a valid date')
],(req,res) =>{
    const errors =validationResult(req);
    var title = req.body.data.title;
    var candidates = req.body.data.candidates;
    var districts = req.body.data.districts;
    var starttime = req.body.data.starttime;
    var endtime = req.body.data.endtime;
    var description = req.body.data.description;
    if(!errors.isEmpty()){
        return res.status(422).json({success:false, errors: errors.array()});
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
router.put('/:id', (req,res) =>{
    var target_id = req.params.id;
    var ballot = req.body;
    var update = {
        title: ballot.title,
        candidates: ballot.candidates,
        districts: ballot.districts,
        starttime: ballot.starttime,
        endtime: ballot.endtime,
        description: ballot.description,
        key: ballot.new_key
    }
    Ballot.findOneAndUpdate({id:target_id},update,function(doc){
        if(doc){
            res.json({success:true,
                message:"Ballot is updated."});
        }
        else{
            res.json({success:false,
                message:"Ballot is not updated."});
        }
    })
})
router.delete('/:id', (req,res) =>{
    var id = req.params.id;
    Ballot.deleteOne({id:id},function(ok){
        if(ok){
            res.json({success:true,
                message:"Ballot deleted."});
        }
        else{
            res.json({success:false,
                message:"Error deleting data."});
        }
    })
})
router.get('/',(req,res) =>{
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