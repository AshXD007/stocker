const mongoose = require('mongoose');
const lotModel = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    date_time:{
        type:Date,
        required:true
    },
    lot_id:{
        type:String,
        required:true
    },
    lot_weight:{
        type:String,
        required:true
    },
    lot_pcs:{
        type:String,
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


const lotUsage = mongoose.model('lotUsage',lotModel);
module.exports = lotUsage;