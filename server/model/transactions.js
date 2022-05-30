const mongoose = require('mongoose');
const transactionModel = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    t_type:{
        type:String,
        required:true
    },
    chemical_id:{
        type:String,
        required:true
    },
    chemical_name:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    lot_name:{
        type:String,
    },
    process_id:{
        type:String,
    },
    price:{
        type:Number,
    },
    remarks:{
        type:String,
    },
});



const transactions = mongoose.model('transactions',transactionModel);
module.exports = transactions;