var express = require('express');
var Ballot = require('../models/ballot');
var router = express.Router();
var blindSignature = require('blind-signatures');
var {check, validationResult } = require('express-validator');
var NodeRSA = require('node-rsa');
var Web3 = require('web3');
const contractUri = "http://localhost:7545";
var provider = new Web3.providers.HttpProvider(contractUri);
var contract = require("@truffle/contract");
//const contract = require('truffle-contract');
var VotingArtifacts = require("../../../Vote/build/contracts/Voting.json");

const Voting = contract(VotingArtifacts);
Voting.setProvider(provider);
//Set an account for sending deployed contract
Voting.defaults({
   from: "0xeF299fab18F62e4413B818fB8af56ea038B4b099"
});
//const voting = Voting.at("0x6b17F32E623c15507E982204A59F97039773b117");
router.get('/deploy', async (req, res) => {
    console.log("Deploy");
    const ballot = await Ballot.findOne({title: "Presidential Election"});
    const title = ballot.title;
    const id = 123;
    const starttime = Date.parse(ballot.starttime);
    const endtime = Date.parse(ballot.endtime);
    const pKE = ballot.key.E;
    const pKN = ballot.key.N;
    const candidates = ballot.candidates;
    const voters = ['0xB70b10C39DC9Bf0F1A1A6729D1E7b736c40bf82f', '0x225970CEcF9f0cBaFD30805c83ee44FDAefeDE12'];
    
    const voting = await Voting.deployed();
    try {
        await voting.create(title, id, starttime, endtime, pKE, pKN, voters, candidates);
    } catch (err) {
        console.log(err);
    }
    
     
    //console.log(result.logs[0].args.val.toNumber());
})

router.post('/',(req,res) =>{
    var title = req.body.data.title;
    var candidates = Object.values(req.body.data.candidates).map(item => item.code);
    var districts = req.body.data.districts;
    var starttime = req.body.data.starttime;
    var endtime = req.body.data.endtime;
    var description = req.body.data.description;
    // console.log(new Date(starttime));
    // console.log(typeof(starttime));
    console.log(Date.parse(starttime),Date.parse(endtime),Date.now());
    if( Date.parse(starttime) < Date.now() && Date.parse(endtime) < Date.now() && Date.parse(starttime) >= Date.parse(endtime) ){
        console.log("date is not right")
        return res.status(422).json({success:false, message:"date is not right"});
    }
    else{
        var new_key = new NodeRSA({ b: 512 });
        Ballot.create({
            title: title,
            candidates: candidates,
            districts: districts,
            starttime: starttime,
            endtime: endtime,
            description: description,
            key: {E: new_key.keyPair.e.toString(),
                  N: new_key.keyPair.n.toString(),
                  D: new_key.keyPair.d.toString()},
            is_deployed: false
        }, function(err){
            if (err){
                res.json({success:false,
                    message:"Ballot create failed"});
            }
            else{
                res.json({success:true,
                    message:"Ballot is created."});
            }
        })
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