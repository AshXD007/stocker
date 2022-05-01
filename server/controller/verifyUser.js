const userM = require('../model/users');

module.exports = async(req,res,next) =>{
    const token = req.cookies.token;
    const username = req.cookies.username;
    if(!token || !username) return res.status(401).send({message:'no cookies'});
    const user = await userM.findOne({username:username});
    if(!user) return res.status('400').send({message:'no user found'})

    const tokenDb = user.verification_token;
    const verified = verify(token,tokenDb);
    if(verified == true ){
        next();
    }else{
        return res.status(400).send({message:'invalid token'});
    }
}


verify = (a,b)=>{
    if (a === b) {return true;}
    else {return false;}
}