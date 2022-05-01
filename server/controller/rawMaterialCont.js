const rawModel = require('../model/rawMaterialModel');

exports.addRaw = async(req,res) =>{
    const body = req.body;
    const user_id = body.user_id;
    let raw_id = body.raw_id;
    let raw_name = body.raw_name;
    const raw_details = body.raw_details;

    //data check
    if(!user_id || !raw_id || !raw_name || !raw_details) return res.status(400).send({message:"empty field"});

    //force capitalize
    raw_id = raw_id.toUpperCase();
    raw_name = raw_name.toUpperCase();
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
        //save the user in the database
        const savedRaw = await raw.save();
        res.status(200).send({message:'saved raw material',raw:savedRaw});
    } catch (error) {
        res.status(400).send({message:error});
    }
} 



exports.viewRaw = async(req,res)=>{
    const user_id = req.body.user_id;
    if(!user_id) return res.status(400).send({message:'empty data field'});

    //get data from db
    const data = await rawModel.find({user_id:user_id});
    //if data is empty
    const testData = JSON.stringify(data);
    if(testData === '[]') return res.status(200).send({message:"no raw"});
    //if data has raw materials
    return res.status(200).send(data);
}