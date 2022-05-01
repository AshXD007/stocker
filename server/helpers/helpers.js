const bcrypt = require('bcrypt');

exports.tokenCreator = async(string)=>{
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(string,salt);
    return hashed
}

exports.idValidate = async(s)=>{
    const len = s.length;
    const Flag = false;
    for (let i = 0 ; i < length ; i++){
        if(s[i] === ' ' ||s[i] === '!' ||s[i] === '.' ||s[i] === ',' || s[i] === ';')
        {
            Flag = true
        } 
    }

    return Flag;
}