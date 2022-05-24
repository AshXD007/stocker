const mongoose = require('mongoose');
const inventoryModel = new mongoose.Schema({
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
    quantity:{
        type:Number,
        required:true
    },
    inventoryAvgPrice:{
        type:Number,
        required:true
    },
});


const inventory = mongoose.model('inventory',inventoryModel);
module.exports = inventory;