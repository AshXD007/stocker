const mongoose = require('mongoose');

const rawMaterialModel = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    chemical_id:{
        type:String,
        required:true,
    },
    chemical_name:{
        type:String,
        required:true
    },
    chemical_details:{
        type:String,
    }
})
const rawModel = mongoose.model('rawMaterials',rawMaterialModel);
module.exports = rawModel;