const chemicalModel = require('../model/rawMaterialModel');
const inventoryModel = require('../model/inventory');

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
    const inventory = new inventoryModel({
        user_id:user_id,
        chemical_id:chemical_id,
        chemical_name:chemical_name,
        quantity:0,
        inventoryAvgPrice:0
    })

    try {
        //save the user in the database
        const savedChemical = await chemical.save();
        const savedInventory = await inventory.save();
        res.status(200).send({message:'saved chemical material',chemical:savedChemical,inventory:savedInventory});
    } catch (error) {
        res.status(500).send({message:error});
    }
} 



exports.viewRaw = async(req,res)=>{
    const user_id = req.body.user_id;
    if(!user_id) return res.status(400).send({message:'empty data field'});

    //get data from db
    const data = await chemicalModel.find({user_id:user_id});
    //if data is empty
    const testData = JSON.stringify(data);
    if(testData === '[]') return res.status(200).send({message:"no raw"});
    //if data has raw materials
    return res.status(200).send(data);
}


exports.deleteRawMaterials = async (req,res)=>{
    const body = req.body;
    const user_id = body.user_id;
    const chemical_id = body.chemical_id;
    const chemical_name = body.chemical_name;

    if(!user_id || !chemical_id || !chemical_name) return res.status(400).send({message:"empty fields"});

    const query = {
        user_id:user_id,
        chemical_id:chemical_id.toUpperCase(),
        chemical_name:chemical_name.toUpperCase()
    }
    try {
        const deleted = await chemicalModel.deleteOne(query);
        if(deleted.deletedCount === 0) return res.status(400).send({message:"check input or no chemical with same data"});
        
        return res.status(200).send({message:"deleted successfully"});
    } catch (error) {
        return res.status(500).send({error})
    }
}