var express = require('express');
var Ballot = require('../models/ballot');
var router = express.Router();
// var blindSignature = require('blind-signatures');
// var {check, validationResult } = require('express-validator');
var NodeRSA = require('node-rsa');
var Web3 = require('web3');
const path = require("path");
const fs = require('fs');
const solc = require('solc');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const input = fs.readFileSync(path.resolve(__dirname,'../../../Vote/contracts/Voting.sol'),'utf8');
const output = solc.compile(input.toString());
const bytecode = output.contracts[':'+'Voting'].bytecode;
const abi = JSON.parse(output.contracts[':'+'Voting'].interface);
const Contract = new web3.eth.Contract(abi);

router.get('/addresslist', (req,res)=>{
    web3.eth.getAccounts().then(addresses =>{
        addresses.shift();
        res.json({success:true,
            addresses: addresses});
    })
})
router.post('/vote/:id',(req,res)=>{
    var ballot_id = req.params.id;
    var message = req.body.message;
    var signed_message = web3.utils.toHex(req.body.signed_message);
    var send_address = req.body.send_address;
    Ballot.findOne({id: ballot_id},function(err,ballot){
        Contract.options.address = ballot.contract_address
<<<<<<< HEAD
        Contract.methods.vote(message,signed_message).send({from: send_address}, function(error, result){
            res.json({success:true,
                message:"test"});
            console.log(result)
=======
        Contract.methods.vote(message,signed_message).send({from: send_address,gas:3000000}, function(error, result){
            console.log(result, error)
>>>>>>> 120801ba4cb8075a1bfa286c55cb4342f235c2c9
        });
    })

}) 
router.get('/collectvote/:id',(req,res)=>{
    var ballot_id = req.params.id;
    Ballot.findOne({id: ballot_id},function(err,ballot){
        Contract.options.address = ballot.contract_address
        web3.eth.getAccounts().then(accounts =>{
            Contract.methods.collectVotes().call({from: accounts[0]}, function(error, result){
                console.log('result',result[0], result[1], error)
            });
        })
    })

}) 
router.get('/deploy/:id', async (req, res) => {
    var ballot_id = req.params.id;
    Ballot.findOne({id: ballot_id},function(err,ballot){
        if(err){
            res.json({success:false,
                message:"DB Query Error"});
        }
        else if(ballot.is_deployed){
            res.json({success:false,
                message:"Ballot Already Deployed"});
        }
        else{
            var title = ballot.title;
            var starttime = Date.parse(ballot.starttime);
            var endtime = Date.parse(ballot.endtime);
            var pKE = ballot.key.E;
            var pKN = web3.utils.toHex(ballot.key.N);
            //var pKN = ballot.key.N;
            var candidates = ballot.candidates;
            web3.eth.getAccounts().then(accounts =>{
                Contract.deploy({data:bytecode,arguments:[title, ballot_id, starttime, endtime, pKE, pKN, candidates]})
                .send({
                        from: accounts[0],
                        gas: 4700000
                    },(err,deploy_res) => {
                        if(err){
                            console.log(err);
                        }
                        Ballot.findOneAndUpdate({id:ballot_id},{is_deployed:true},{useFindAndModify: false},(err,result)=>{
                        if(err){
                            console.log(err);
                        }
                        res.json({success:true,
                            message:"Ballot Successfully Deployed"});
                    })
                })
                .then(function(newContractInstance){
                    Ballot.findOneAndUpdate({id:ballot_id},{contract_address:newContractInstance.options.address},{useFindAndModify: false},(err,result)=>{
                        console.log(newContractInstance.options.address)
                    })
                })
            })
        }
    });
})

router.post('/',(req,res) =>{
    var title = req.body.data.title;
    var candidates = Object.values(req.body.data.candidates).map(item => item.code);
    var districts = req.body.data.districts;
    var starttime = req.body.data.starttime;
    var endtime = req.body.data.endtime;
    var description = req.body.data.description;
    console.log(Date.parse(starttime),Date.parse(endtime),Date.now());
    if( Date.parse(starttime) < Date.now() && Date.parse(endtime) < Date.now() && Date.parse(starttime) >= Date.parse(endtime) ){
        console.log("date is not right")
        return res.status(422).json({success:false, message:"date is not right"});
    }
    else{
        var new_key = new NodeRSA({ b: 256 });
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
            is_deployed: false,
            contract_address: ""
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
