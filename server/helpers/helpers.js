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
    let flag = true;
    const user_id = data.user_id;
    const chemical_id = data.chemical_id.toUpperCase();
    const chemical_name = data.chemical_id.toUpperCase();

    const query ={
        user_id:user_id,
        chemical_id:chemical_id,
        chemical_name:chemical_name
    }
    const cExist = await rawModel.find(query);
    if (JSON.stringify(cExist) === '[]'){
        flag = false;
    }

    return flag;
}



exports.dateValidate = async(date) =>{
    let tempDate= "";
    //if month single digit
    if(date.month < 10 )
    {
        tempDate = date.year + "-0" + date.month+ "-" + date.day + "T00:00:01Z";
    }
    //if day single digit
    if(date.day < 10 )
    {
        tempDate = date.year + "-" + date.month+ "-0" + date.day + "T00:00:01Z";
    }
    //if both are single digit
    if(date.month < 10 && date.day < 10 ){
        tempDate = date.year + "-0" + date.month+ "-0" + date.day + "T00:00:01Z";
    }

    return tempDate;
}