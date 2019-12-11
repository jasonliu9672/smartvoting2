var express = require('express');
var Ballot = require('../models/ballot');
var router = express.Router();
var blindSignature = require('blind-signatures');
var {check, validationResult } = require('express-validator');

router.post('/ballot/create', [
    check('starttime').isAfter().withMessage('chosen date is not a valid date'),
    check('endtime').isAfter().withMessage('chosen date is not a valid date')
],(req,res) =>{
    const errors =validationResult(req);
    var title = req.body.title;
    var candidates = req.body.candidates;
    var districts = req.body.districts;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
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
            key: {
                N: new_key.keyPair.n.toString(),
                E: new_key.keyPair.e.tostring()
            }
        })
        res.json({success:true,
            message:"Ballot is created."});
    }
})