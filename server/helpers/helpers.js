const bcrypt = require('bcrypt');

exports.tokenCreator = async(string)=>{
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(string,salt);
    return hashed
}

