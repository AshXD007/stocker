const mongoose = require('mongoose');

const userAuth = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    verification_token:{
        type:String,
        required:true,
        unique:true
    }

})
const userModel = mongoose.model('users',userAuth);
module.exports = userModel;