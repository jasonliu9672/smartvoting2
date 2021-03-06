const mongoose  = require('../db').mongoose
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema  = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    username:{
        type:String,
        require: true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 7,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!')
            }
        }
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

//hash password before saving
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password'))
        {return next()}
    bcrypt.hash(user.password,10).then((hashedpassword) =>{
        user.password = hashedpassword;
        next();
    })
});
UserSchema.statics.comparePassword = function(candidatePassword,userPassword){
    console.log(candidatePassword,userPassword)
    bcrypt.compare(candidatePassword,userPassword,function(err,isMatch){
        if(err) {throw (err);}
        console.log('ere',isMatch);
        return isMatch;
    })
}
const User = mongoose.model('User', UserSchema);

module.exports = User;