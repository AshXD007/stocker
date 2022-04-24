// import libraries and files
const userM = require('../model/users');
const bcrypt = require('bcrypt');
const randomString = require("random-string-gen");
// const cryptoRandomString  = require('crypto-random-string');
const helpers  = require('../helpers/helpers')

//create user

exports.createUser = async(req,res)=>{
    console.log('here in req body;',req.body);
    //get data from request
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const company = req.body.company;
    //validate req
    if (!username) return res.status(400).send({message:"no username"});
    if (!password) return res.status(400).send({message:"no password"});
    if (!confirmPassword) return res.status(400).send({message:"no confirmPassword"});
    if (!company) return res.status(400).send({message:"no company"});
    
    //check for existing user
    const usernameExist = await userM.findOne({username:username});
    const companyExist = await userM.findOne({company:company});
    if(companyExist) return res.status(400).send({message:'Company Already exist'});
    if(usernameExist) return res.status(400).send({message:'username taken'});
    if(password != confirmPassword) return res.status(400).send({message:'check password'});


    //assign token and id and check for same 
    let user_id = await randomString();
    let tempToken = await randomString();
    let verification_token = await helpers.tokenCreator(tempToken);
    let uidExist = await userM.findOne({user_id:user_id});
    let tokenExist = await userM.findOne({verification_token:verification_token});
    while(uidExist){
        user_id = await randomString();
        uidExist = await userM.findOne({user_id:user_id});
    }
    while(tokenExist){
        verification_token = await helpers.tokenCreator(tempToken);
        tokenExist = await userM.findOne({verification_token:verification_token});
    }

    //hash the password

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password,salt);

    //create new user
    const user = new userM({
        user_id:user_id,
        username:username,
        password:hashed,
        company:company,
        verification_token:verification_token
    })

    //put user in database
    try {
        const savedUser = await user.save();
        // #TODO
        res.status(200).send({message:'user saved'})
    } catch (error) {
        res.status(400).send({message:error})
    }

}