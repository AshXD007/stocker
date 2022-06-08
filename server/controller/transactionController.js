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
    const chemical_name = body.chemical_name.toUpperCase();
    const chemical_id = body.chemical_id.toUpperCase();
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
    if(date_time.month > 12 || date_time.month < 1 || date_time.day > 31 || date_time.day < 1)return res.status(400).send({message:"wrong date"});
    //empty fields
    if(!user_id ||!date_time||!chemical_id||!chemical_name||!quantity||!price||!seller||!amount||!gst ) return res.status(400).send({message:"empty field/s"});
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
    console.log(finalAvgPrice);


    //transaction database

    const transaction = new transactionModel({
        user_id:user_id,
        date_time:new Date(date),
        t_type:"PURCHASE",
        chemical_name:chemical_name,
        chemical_id:chemical_id,
        quantity:quantity,
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
