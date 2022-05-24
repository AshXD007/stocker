const mongoose = require('mongoose');
const processModel = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    chemical_name:{
        type:String,
        required:true
    },
    chemical_id:{
        type:String,
        required:true
    },
    chemical_perc:{
        type:Number,
        required:true
    },
    
    process_name:{
        type:String,
        required:true
    },
    process_id:{
        type:String,
        required:true
    },
    remarks:{
        type:String,
    }
});

const process = new mongoose.model('process',processModel);
module.exports = process;