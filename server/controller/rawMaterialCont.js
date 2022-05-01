const rawModel = require('../model/rawMaterialModel');
const helpers = require('../helpers/helpers');

exports.addRaw = async(req,res) =>{
    const body = req.body;
    const user_id = body.user_id;
    const raw_id = body.raw_id.toUpperCase();
    const raw_name = body.raw_name.toUpperCase();
    const raw_details = body.raw_details;

    //data check
    if(!user_id || !raw_id || !raw_name || !raw_details) return res.status(400).send({message:"empty field"});
    //if id contains space
    if(helpers.idValidate(raw_id)) return res.status(400).send({message:'id contains harmful char'})
    //if raw material exists for user
    const idExist = await rawModel.findOne({user_id:user_id,raw_id:raw_id});
    if(idExist) return res.status(400).send({message:'raw material with same id exist'});

    //if data pass all checks
    const raw = new rawModel({
        user_id:user_id,
        raw_id:raw_id,
        raw_name:raw_name,
        raw_details:raw_details
    })

    try {
        const savedRaw = await raw.save();
        res.status(200).send({message:'saved raw material',raw:savedRaw});
    } catch (error) {
        res.status(400).send({message:error});
    }
} 