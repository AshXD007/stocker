const bcrypt = require('bcrypt');
const rawModel = require('../model/rawMaterialModel');


//create token
exports.tokenCreator = async(string)=>{
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(string,salt);
    return hashed
}

//check if raw material exists
exports.existsInRaw = async(data) =>{
    let flag = false;
    const user_id = data.user_id;
    const chemical_id = data.chemical_id.toUpperCase();
    const chemical_name = data.chemical_id.toUpperCase();

    const query ={
        user_id:user_id,
        chemical_id:chemical_id,
        chemical_name:chemical_name
    }
    const cExist = await rawModel.find(query);
    if (JSON.stringify(cExist) !== '[]'){
        flag = true;
    }

    return flag;
}