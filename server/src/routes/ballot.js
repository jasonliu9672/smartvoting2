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
const ganache_cli = "http://localhost:7545";
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
//compile voting.sol
const input = fs.readFileSync(path.resolve(__dirname,'../../../Vote/contracts/Voting.sol'),'utf8');
const output = solc.compile(input.toString());
const bytecode = output.contracts[':'+'Voting'].bytecode;
const abi = JSON.parse(output.contracts[':'+'Voting'].interface);
const Contract = new web3.eth.Contract(abi);
router.get('/addresslist', (req,res)=>{
    web3.eth.getAccounts().then(addresses =>{
        res.json({success:true,
            addresses: addresses});
    })
})
router.post('/vote',(req,res)=>{
    var message = req.body.message;
    var signed_message = req.body.signed_message;
    var send_address = req.body.send_address;
    Contract.methods.verify([message,signed_message]).send({from: send_address}, function(error, result){
        console.log(result)
    });

}) 
router.get('/deploy/:id', async (req, res) => {
    var ballot_id = req.params.id;
    console.log(ballot_id)
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
            //var pKN = web3.utils.toHex(ballot.key.N);
            var pKN = ballot.key.N;
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
                        console.log(deploy_res);
                        Ballot.findOneAndUpdate({id:ballot_id},{is_deployed:true},{useFindAndModify: false},(err,result)=>{
                        if(err){
                            console.log(err);
                        }
                        res.json({success:true,
                            message:"Ballot Successfully Deployed"});
                    })
                })
                .then(function(newContractInstance){
                    console.log(newContractInstance.options.address)
                })
            })
        }
    });
})
/*
const sha256 = require('js-sha256')
const contractUri = "http://localhost:7545";
var provider = new Web3.providers.HttpProvider(contractUri);
var contract = require("@truffle/contract");
//const contract = require('truffle-contract');
var VotingArtifacts = require("../../../Vote/build/contracts/Voting.json");
const BigInteger = require('jsbn').BigInteger;
const Voting = contract(VotingArtifacts);
Voting.setProvider(provider);
//Set an account for sending deployed contract
Voting.defaults({
   from: "0xFaf62991b8DDD5953F5fDac5ea689C83D9433e36"
});
//const voting = Voting.at("0x6b17F32E623c15507E982204A59F97039773b117");
router.get('/test', async (req, res) => {
    const ballot = await Ballot.findOne({title: "Presidential Election"});
    const signedMsg = new BigInteger("48323128154290828385683446030412402444136180340464220963639050973970971035883");
    const signed = "48323128154290828385683446030412402444136180340464220963639050973970971035883";
    const msg = "TIW63731";
    const e = new BigInteger(ballot.key.E);
    const n = new BigInteger(ballot.key.N);
    var d = signedMsg.modPow(e,n);
    console.log(d.toString());
    msgHash = sha256(msg);
    let messageInt = new BigInteger(msgHash, 16);
    console.log(messageInt.toString());
    console.log(msgHash);
    console.log(signedMsg.toString());
    const voting = await Voting.deployed();
    const result = await voting.verify(msg, signed);
    console.log(result);
})
/*
58639812522817345304249820608953445364178878399563037660546123600364729088304
58639812522817345304249820608953445364178878399563037660546123600364729088304
81a4f52cd910dfeac9ef08862ef2135c0fd09743aa6d504564d606fdae913930
48323128154290828385683446030412402444136180340464220963639050973970971035883
*/
// router.get('/deploy', async (req, res) => {
//     console.log("Deploy");
//     const ballot = await Ballot.findOne({title: "Presidential Election"});
//     const title = ballot.title;
//     const id = 123;
//     const starttime = Date.parse(ballot.starttime);
//     const endtime = Date.parse(ballot.endtime);
//     const pKE = ballot.key.E;
//     const pKN = ballot.key.N;
//     const candidates = ballot.candidates;
//     const voters = ['0xB70b10C39DC9Bf0F1A1A6729D1E7b736c40bf82f', '0x225970CEcF9f0cBaFD30805c83ee44FDAefeDE12'];
//     var value = web3.utils.toHex(ballot.key.N);
//     const voting = await Voting.deployed();
//     try {
//         //await voting.create(title, id, starttime, endtime, pKE, pKN, voters, candidates);
//         const result = await voting.getHash.call();
//         console.log(result[0]);
//         console.log(result[1]);
//         //console.log(value);
//         //res.json({success:true,
//         //    contract_address: voting.options.address});
//     } catch (err) {
//         console.log(err);
//     }
    
     
//     //console.log(result.logs[0].args.val.toNumber());
// })

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