const transactionModel = require('../model/transactions');
const inventoryModel = require('../model/inventory');
const purchaseModel = require('../model/purchase');
const lotUsageModel = require('../model/lotUsage');
const helpers = require('../helpers/helpers');


exports.purchase = async (req,res) =>{
    const body = req.body;
    const user_id = body.user_id;
    const date_time = {
        year:body.date_time.year,
        month:body.date_time.month,
        day:body.date_time.day,
        // hour:"00",
        // min:"00",
        // sec:"00"
    }
    const chemicalName = body.chemical_name;
    const chemicalId = body.chemical_id;
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
    // if(date_time.month > 12 || date_time.month < 1 || date_time.day > 31 || date_time.day < 1)return res.status(400).send({message:"wrong date"});
    //empty fields
    if(!user_id ||!date_time||!chemicalId||!chemicalName||!quantity||!price||!seller||!amount||!gst ) return res.status(400).send({message:"empty field/s"});

    const chemical_id = chemicalId.toUpperCase();
    const chemical_name = chemicalName.toUpperCase();
    //data checks 
    if(date_time.month > 12 || date_time.month < 1 || date_time.day > 31 || date_time.day < 1)return res.status(400).send({message:"wrong date"});
    //negative quantity
    if(quantity <= 0 ) return res.status(400).send({message:"nill quantity"});
    //wrong amount
    const tempAmt = price * quantity
    if(amount != tempAmt ) return res.status(400).send({message:"wrong amount"});

    //wrong gst calculation
    if(gst.bool === true ){
        const tempAt  = (amount * gst.perc) / 100 ;
        if(tempAt != gst.amount || gst.totalAmount != (amount + tempAt)) return res.status(400).send({message:"wrong gst calculation"});
    }else{
        if(gst.amount != 0 || gst.perc != 0 || gst.totalAmount != amount) return res.status(400).send({message:"wrong gst amount input"});
    }



    //check if chemical exists in raw materials 
    if(helpers.existsInRaw({user_id:user_id,chemical_id:chemical_id,chemical_name:chemical_name}) === false ) return res.status(400).send({message:"please add chemical to raw material "});


    //setup date time to store easily
    const date = await helpers.dateValidate(date_time);

    
    // tempDate = date_time.year + "-" + date_time.month+ "-" + date_time.day + "T00:00:01Z";
    // const finalDate = await helpers.dateValidate(tempDate);
    //add to purchase database
    const purchase = new purchaseModel({
        user_id:user_id,
        date_time: new Date(date),
        chemical_name:chemical_name,
        chemical_id:chemical_id,
        quantity:quantity,
        price:price,
        seller:seller,
        amount:amount,
        gst:{
            bool:gst.bool,
            perc:gst.perc,
            amount:gst.amount,
            totalAmount:gst.totalAmount
        },
        remarks:remarks
    })
    //check current inventory levels
    const invData = await inventoryModel.findOne({user_id:user_id,chemical_id:chemical_id.toUpperCase(),chemical_name:chemical_name.toUpperCase()});

    //inventory levels
    const invQuantity = invData.quantity;
    const invAvgPrice = invData.inventoryAvgPrice;

    //final levels 
    const finalQuantity = invQuantity + quantity;
    let finalAvgPrice;
    if(invAvgPrice !== 0 ){
        finalAvgPrice = (invAvgPrice + price ) /2;
    }else{
        finalAvgPrice = price;
    }


    //transaction database

    const transaction = new transactionModel({
        user_id:user_id,
        date_time:new Date(date),
        t_type:"PURCHASE",
        chemical_name:chemical_name,
        chemical_id:chemical_id,
        quantity:quantity,
        currentInvQuantity:finalQuantity,
        price:price,
        remarks:remarks
    })
    try {
        const savedPurchase = await purchase.save();
        const updatedInventory = await inventoryModel.updateOne({user_id:user_id,chemical_id:chemical_id,chemical_name:chemical_name},{quantity:finalQuantity,inventoryAvgPrice:finalAvgPrice});
        const savedTransaction = await transaction.save();
        res.status(200).send({saved:savedPurchase,updated:updatedInventory,transaction:savedTransaction});
    } catch (error) {
     res.send(error)   
    }
}



//manual increase

exports.manualIncrease = async (req,res)=>{
    const {user_id,date_time,chemical_id,chemical_name,quantity,price,t_type,remarks} = req.body;


    //empty fields
    if(!user_id ||!date_time||!chemical_id||!chemical_name||!quantity||!t_type) return res.status(400).send({message:"empty field/s"});

    const cid = chemical_id.toUpperCase();
    const cnm = chemical_name.toUpperCase();
    //data checks 
    if(date_time.month > 12 || date_time.month < 1 || date_time.day > 31 || date_time.day < 1)return res.status(400).send({message:"wrong date"});
    //negative quantity
    if(quantity <= 0 ) return res.status(400).send({message:"nill quantity"});

    //check if chemical exists in raw materials 
    if(helpers.existsInRaw({user_id:user_id,chemical_id:cid,chemical_name:cnm}) === false ) return res.status(400).send({message:"please add chemical to raw material "});

    //setup date time to store easily
    const date = await helpers.dateValidate(date_time);

    //inventory values
    const invData = await inventoryModel.findOne({user_id:user_id,chemical_id:chemical_id.toUpperCase(),chemical_name:chemical_name.toUpperCase()});

    //inventory levels
    const invQuantity = invData.quantity;
    const invAvgPrice = invData.inventoryAvgPrice;

    //final levels 
    const finalQuantity = invQuantity + quantity;
    let finalAvgPrice;
    if(price !== 0){
    if(invAvgPrice !== 0 ){
        finalAvgPrice = (invAvgPrice + price ) /2;
    }else{
        finalAvgPrice = price;
    }
    }

    const transaction = new transactionModel({
        user_id:user_id,
        date_time:new Date(date),
        t_type:t_type.toUpperCase(),
        chemical_name:chemical_name,
        chemical_id:chemical_id,
        quantity:quantity,
        currentInvQuantity:finalQuantity,
        price:price,
        remarks:remarks
    })
    try {
        const updatedInventory = await inventoryModel.updateOne({user_id:user_id,chemical_id:cid,chemical_name:cnm},{quantity:finalQuantity,inventoryAvgPrice:finalAvgPrice});
        const savedTransaction = await transaction.save();
        res.status(200).send({updated:updatedInventory,transaction:savedTransaction});
    } catch (error) {
     res.send(error)   
    }


}



//manual decrease
exports.manualDecrease = async (req,res)=>{
    const {user_id,date_time,chemical_id,chemical_name,quantity,price,t_type,remarks} = req.body;


    //empty fields
    if(!user_id ||!date_time||!chemical_id||!chemical_name||!quantity||!t_type) return res.status(400).send({message:"empty field/s"});

    const cid = chemical_id.toUpperCase();
    const cnm = chemical_name.toUpperCase();
    //data checks 
    if(date_time.month > 12 || date_time.month < 1 || date_time.day > 31 || date_time.day < 1)return res.status(400).send({message:"wrong date"});
    //negative quantity
    if(quantity <= 0 ) return res.status(400).send({message:"nill quantity"});

    //check if chemical exists in raw materials 
    if(helpers.existsInRaw({user_id:user_id,chemical_id:cid,chemical_name:cnm}) === false ) return res.status(400).send({message:"please add chemical to raw material "});

    //setup date time to store easily
    const date = await helpers.dateValidate(date_time);

    //inventory values
    const invData = await inventoryModel.findOne({user_id:user_id,chemical_id:chemical_id.toUpperCase(),chemical_name:chemical_name.toUpperCase()});

    //check inventory levels
    if(quantity > invData.quantity) return res.status(400).send({message:"quantity more than inventory level "});

    //inventory levels
    const invQuantity = invData.quantity;
    const invAvgPrice = invData.inventoryAvgPrice;

    //final levels 
    const finalQuantity = invQuantity - quantity;
    const finalAvgPrice = invAvgPrice;

    const transaction = new transactionModel({
        user_id:user_id,
        date_time:new Date(date),
        t_type:t_type.toUpperCase(),
        chemical_name:chemical_name,
        chemical_id:chemical_id,
        quantity:quantity,
        currentInvQuantity:finalQuantity,
        remarks:remarks
    })
    try {
        const updatedInventory = await inventoryModel.updateOne({user_id:user_id,chemical_id:cid,chemical_name:cnm},{quantity:finalQuantity,inventoryAvgPrice:finalAvgPrice});
        const savedTransaction = await transaction.save();
        res.status(200).send({updated:updatedInventory,transaction:savedTransaction});
    } catch (error) {
     res.send(error)   
    }


}



//lotWise Usage

exports.lotWiseUsage = async(req,res) =>{
    const {user_id,date_time,lot,remarks,data} = req.body;


    //empty fields
    if(!user_id||!date_time||!lot||!remarks||!data) return res.status(400).send({message:"empty fields"});


    //date checks 
    if(date_time.month > 12 || date_time.month < 1 || date_time.day > 31 || date_time.day < 1)return res.status(400).send({message:"wrong date"});

    //setup date time to store easily
    const date = await helpers.dateValidate(date_time);

    for (let e = 0 ; e<data.length;e++){
        cid = data[e].chemical_id.toUpperCase();
        cnm = data[e].chemical_name.toUpperCase();
        quantity = data[e].quantity;

        //negative quantity
        if(quantity <= 0 ) return res.status(400).send({message:"nill quantity",chemical:data[e]});

        //check if chemical exists in raw materials 
        if(helpers.existsInRaw({user_id:user_id,chemical_id:cid,chemical_name:cnm}) === false ) return res.status(400).send({message:"please add chemical to raw material ",chemical:data[e]});


       for(let element = 0 ; element < data.length ; element ++){
        const invData = await inventoryModel.findOne({user_id:user_id,chemical_id:data[element].chemical_id.toUpperCase(),chemical_name:data[element].chemical_name.toUpperCase()});
        //check inventory levels
        if(quantity > invData.quantity) return res.status(400).send({message:"quantity more than inventory level ",chemical:data[element]});
       }

       const invData = await inventoryModel.findOne({user_id:user_id,chemical_id:cid,chemical_name:cnm});

        //inventory levels
        const invQuantity = invData.quantity;
        const invAvgPrice = invData.inventoryAvgPrice;

        //final levels 
        const finalQuantity = invQuantity - quantity;
        const finalAvgPrice = invAvgPrice;

        const transaction = new transactionModel({
            user_id:user_id,
            date_time:new Date(date),
            t_type:"LOTUSAGE",
            chemical_name:cnm,
            chemical_id:cid,
            quantity:quantity,
            currentInvQuantity:finalQuantity,
            lot_id:lot.id,
            process_id:lot.process_id,
            remarks:remarks
        })
        try {
            const updatedInventory = await inventoryModel.updateOne({user_id:user_id,chemical_id:cid,chemical_name:cnm},{quantity:finalQuantity,inventoryAvgPrice:finalAvgPrice});
            const savedTransaction = await transaction.save();
        } catch (error) {
         res.send(error)   
        }
        
    }

    const lotUsage = new lotUsageModel({
        user_id:user_id,
        date_time:new Date(date),
        lot_id:lot.id,
        lot_weight:lot.weight,
        lot_pcs:lot.pcs,
        process_id:lot.process_id,
        process_name:lot.process_name,
        remarks:remarks

    })
    
   try {
    const lotSaved = await lotUsage.save();
    res.status(200).send({message:"transaction done",lot:lotSaved});
   } catch (error) {
    res.status(500).send(error);
   }

}