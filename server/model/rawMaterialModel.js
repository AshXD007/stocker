const mongoose = require('mongoose');

const rawMaterialModel = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    raw_id:{
        type:String,
        required:true,
    },
    raw_name:{
        type:String,
        required:true
    },
    raw_details:{
        type:String,
    }
})
const rawModel = mongoose.model('rawMaterials',rawMaterialModel);
module.exports = rawModel;