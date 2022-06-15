const transactionModel = require('../model/transactions');
const inventoryModel = require('../model/inventory');
const purchaseModel = require('../model/purchase');
const lotUsageModel = require('../model/lotUsage');
const helpers = require('../helpers/helpers');




exports.inventory = async (req,res) =>{
    const user_id = req.body.user_id;
    let data = "";
    if(!user_id) return res.status(400).send({message:"no data"})
    try {
        //if query has chemical id
        if(req.query.chemical_id && req.query.chemical_name){
        const chemical_id = req.query.chemical_id.toUpperCase();
        const chemical_name = req.query.chemical_name.toUpperCase();
        data = await inventoryModel.findOne({user_id:user_id,chemical_id:chemical_id,chemical_name:chemical_name});
        console.log("if:",data);
        }else{
        data = await inventoryModel.find({user_id:user_id});
        console.log("else:",data);
        }

        

        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
}