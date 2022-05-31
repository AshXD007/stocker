const mongoose = require('mongoose');
const purchaseModel = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    date_time:{
        type:Date,
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
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    gst:{
        bool:{
            type:Boolean,
            required:true
        },
        perc:{
            type:Number,
        },
        amount:{
            type:Number,
        },
        totalAmount:{
            type:Number
        }
    },
    seller:{
        type:String
    },
    remarks:{
        type:String,
    },
})

const purchase = mongoose.model('purchase',purchaseModel);
module.exports = purchase; 