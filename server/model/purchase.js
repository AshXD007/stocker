const mongoose = require('mongoose');
const purchaseModel = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    date:{
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
    Price:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    gst:{
        Bool:{
            type:Boolean,
            required:true
        },
        perc:{
            type:String,
        },
        amount:{
            type:String,
        },
        totalAmount:{
            type:String
        }
    },
    seller_name:{
        type:String,
        required:true
    },
    remarks:{
        type:String,
    },
})

const purchase = mongoose.model('purchase',purchaseModel);
module.exports = purchase; 