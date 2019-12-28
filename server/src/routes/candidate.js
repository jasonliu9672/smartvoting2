var express = require('express');
var router = express.Router();
var Candidate = require('../models/candidate');
const handleError = require('../helpers/error');

router.post('/',(req,res) =>{
    //console.log(req);
    var name = req.body.data.name;
    var age = req.body.data.age;
    var dob = req.body.data.dob;
    var title = req.body.data.title;
    Candidate.create({
        name:name,
        age:age,
        dob:dob,
        title:title
    },function(err){
        if(err){
            res.json({success:false,
                message:"add candidate failed."});
        }
        else{
            res.json({success:true,
                message:"Candidate is added."});
        }
    })
});
router.put('/:id', (req,res) =>{
    var target_id = req.params.id;
    var candidate = req.body.data;
    var update = {
        name: candidate.name,
        age: candidate.age,
        dob: candidate.dob,
        title: candidate.title
    }
    Candidate.findOneAndUpdate({id:target_id},update,function(doc){
        if(doc){
            res.json({success:true,
                message:`Candidate ${candidate.name} is updated.`});
        }
        else{
            res.json({success:false,
                message:`Candidate ${candidate.name} is not updated.`});
        }
    })
})
router.delete('/:cid', (req,res) =>{
    var cid = req.params.cid;
    Candidate.deleteOne({cid:cid},function(err){
        if(err){
            res.json({success:false,
                message:"Error deleting data."});
        }
        else{
            res.json({success:true,
                message:"Candidate deleted."});
        }
    })
})
router.get('/',(req,res) =>{
    console.log("getting cadidates");
    const size = 10; // results per page
    const page = req.query.page || 1;
    var query = {};
    var has_prev,has_next;
    query.skip = size * (page-1);
    query.limit = size;
    Candidate.countDocuments({},function(err,totalCount){
        if(err){
            res.json({success: true,
                    message:"Error fetching data."});
        }
        Candidate.find({},{},query,function(err,candidates){
            if(err){
                res.json({success:false,
                        message:"Error fetching data."});
            }else{
                var totalPages = Math.ceil(totalCount/size);
                has_prev = (page > 1);
                has_next = (page < totalPages);
                res.json({success:true,
                          candidates:candidates,
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
router.get('/list',function(req, res){
    Candidate.find({}, function(err, candidates){
        var candidateList = [];
        candidates.forEach(function(candidate){
            candidateList.push({
                name: candidate.name,
                code: candidate.code
            })
        })
        res.json({
            success:true,
            candidateList: candidateList
        })
    })
})
module.exports = router;