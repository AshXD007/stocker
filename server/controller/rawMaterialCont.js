const chemicalModel = require('../model/rawMaterialModel');

exports.addRaw = async(req,res) =>{
    const body = req.body;
    const user_id = body.user_id;
    let chemical_id = body.chemical_id;
    let chemical_name = body.chemical_name;
    const chemical_details = body.chemical_details;

    //data check
    if(!user_id || !chemical_id || !chemical_name || !chemical_details) return res.status(400).send({message:"empty field"});

    //force capitalize
    chemical_id = chemical_id.toUpperCase();
    chemical_name = chemical_name.toUpperCase();
    //if chemical material exists for user
    const idExist = await chemicalModel.findOne({user_id:user_id,chemical_id:chemical_id});
    if(idExist) return res.status(400).send({message:'chemical material with same id exist'});

    //if data pass all checks
    const chemical = new chemicalModel({
        user_id:user_id,
        chemical_id:chemical_id,
        chemical_name:chemical_name,
        chemical_details:chemical_details
    })

    try {
        //save the user in the database
        const savedChemical = await chemical.save();
        res.status(200).send({message:'saved chemical material',chemical:savedChemical});
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