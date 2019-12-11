var express = require('express');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var User = require('../models/user');
var router = express.Router();
var {check, validationResult } = require('express-validator');
require('dotenv').config();

//verification middleware
auth = function(req,res,next){
    var token = req.body.token || req.query.token || req.headers['x-access-token']
    if(token.startsWith('Bearer')){
        token = token.slice(7, token.length);
    }
    if(token){
        jwt.verify(token,process.env.PRIVATE_KEY,(err, decoded)=>{
            if(err){
                return res.json({
                    success: false,
                    message:'token is not valid'
                })
            }
            else{
                req.decoded = decoded;
                next();
            }
        })
    }
    else{
        return res.json({
            success:false,
            message: 'autho token is not provided'
        })
    }
}

router.post('/register', [
    check('email').isEmail().normalizeEmail(),
    check('username').isLength({min:5,max:15}),
    check('password').isLength({min:5,max:20})
],(req,res) =>{
    const errors =validationResult(req);
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    User.find({username:username},function(err,account){
        if(err){
            res.status(500).json({error:err});
        }
        if(account.length){
            res.json({success:false,
                      message:"Register failed. username already existed",
                      account:account});
        }
        else{
            User.create({
                name: name,
                email: email,
                username: username,
                password: password
            })
            res.json({success:true,
                message:"Register success."});
        }
    });
});
router.post('/signin',(req,res) =>{
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username:username},function(err,user){
        if(err){
            res.status(500).json({error:err});
        }
        if(!user){
            res.json({success:false,
                      message:"Signin failed. account does not exist",
                      token:''
                    });
        }
        else if(user){
            bcrypt.compare(password,user.password,function(err,isMatch){
                if(err) {throw (err);}
                if(!isMatch){
                    res.json({success:false,
                              message:"Signin failed. password not match",
                              token:'',
                            });
                }
                else{
                    var token = jwt.sign(user.toJSON(),process.env.PRIVATE_KEY,{
                        algorithm: 'HS256',
                        expiresIn: process.env.JWT_EXPIRE_SECONDS
                    });
                    res.json({
                        success:true,
                        message:'Login success.',
                        token: token
                    });
                }
            })
        }
    })
})

router.post('/signout', auth, (req,res) =>{
    console.log(req.headers);
    res.json({
        success:true,
        message:'Logout success.'
    })
})

module.exports = router;