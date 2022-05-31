const transactionModel = require('../model/transactions');
const inventoryModel = require('../model/inventory');
const purchaseModel = require('../model/purchase');
const lotUsageModel = require('../model/lotUsage');
const helpers = require('../helpers/helpers');


exports.purchase = async (req,res) =>{
    const body = req.body;
    const user_id = body.user_id;
    const date_time = body.date_time;
    const chemical_name = body.chemical_name;
    const chemical_id = body.chemical_id;
    const quantity = body.quantity;
    const price = body.price;
    const seller = body.seller;
    const amount = body.amount;
    const gst = {
        bool:body.gst.bool,
        perc:body.gst.perc,
        amount:body.gst.amount,
        totalAmount:body.gst.totalAmount
    };
    const remarks = body.remarks;

    //data checks 
    //empty fields
    if(!user_id ||!date_time||!chemical_id||!chemical_name||!quantity||!price||!seller||!amount||!gst ) return res.status(400).send({message:"empty field/s"});
    //negative quantity
    if(quantity >= 0 ) return res.status(400).send({message:"nill quantity"});
    //wrong amount
    const tempAmt = price * quantity
    if(amount != tempAmt ) return res.status(400).send({message:"wrong amount"});

    //wrong gst calculation
    if(gst.bool === true ){
        const tempAt  = (amount * perc) / 100 ;
        if(tempAt != gst.amount || gst.totalAmount != (amount + tempAt)) return res.status(400).send({message:"wrong gst calculation"});
    }else{
        if(gst.amount != 0 || gst.perc != 0 || gst.totalAmount != amount) return res.status(400).send({message:"wrong gst amount input"});
    }



    //check if chemical exists in raw materials 
    if(helpers.existsInRaw({user_id:user_id,chemical_id:chemical_id,chemical_name:chemical_name}) === false ) return res.status(400).send({message:"please add chemical to raw material "});


    
    //add to purchase database

    
    
    
}
