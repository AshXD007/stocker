const processModel = require('../model/process');

//sample data sent from user
// data = {
//     user_id:'q',
//     process_name:'qq',
//     process_id:'qq2',
//     chemical_name:['qq','22','2221','da','313','fer'],
//     chemical_id:['q','22','2221','da','313','fer'],
//     chemical_perc:[1,3,4,5,6,7],
//     remarks:'none'
// }

//add process
exports.addProcess = async(req,res) =>{
    const body = req.body;

    const user_id = body.user_id;
    let process_id = body.process_id;
    let process_name = body.process_name;
    const chemical_name = body.chemical_name;
    const chemical_id = body.chemical_id;
    const chemical_perc = body.chemical_perc;
    const remarks = body.remarks;

    const idLength = chemical_id.length;
    const nameLength = chemical_name.length;
    const percLength = chemical_perc.length;
    //data validation 
    //empty fields
    if(!user_id || !process_id || !process_name || !chemical_name|| !chemical_id|| !chemical_perc) return res.status(400).send({message:"empty field"});
    //length of arrays check 
    if(idLength !== percLength || idLength !== nameLength || nameLength !== percLength) return res.status(400).send({message:"please check data"});

    //capitalize 
    process_id = process_id.toUpperCase();
    process_name = process_name.toUpperCase();
    //add to database 
    //add for every chemical (raw material)

    for(let i = 0 ; i < idLength ; i++) {
        cid = chemical_id[i]
        cnm = chemical_name[i]
        const process = new processModel({
            user_id:user_id,
            chemical_name:cnm.toUpperCase(),
            chemical_id:cid.toUpperCase(),
            chemical_perc:chemical_perc[i],
            process_name:process_name,
            process_id:process_id,
            remarks:remarks,
        })
        //save each raw at once in database
        try {
            const savedProcess = await process.save();
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(200).send({message:"saved process"});
}



//getProcess

exports.getProcess = async(req,res) =>{
    const body = req.body;

    const user_id = body.user_id;
    let process_id = body.process_id;
    let process_name = body.process_name;

    if(!user_id || !process_id || !process_name ) return res.status(400).send({message:"empty fields"});

    //capitalize
    process_id = process_id.toUpperCase();
    process_name = process_name.toUpperCase();

    let data = await processModel.find({user_id:user_id,process_id:process_id,process_name:process_name});
    //if empty data
    const testData = JSON.stringify(data);
    if (testData === "[]") return res.status(400).send({message:"no process"});


    //if data found
    //store chemical in array
    const dArray = [];
    for(let i = 0; i < data.length ; i++)
    {
        const tempData = data[i];
        const tempArray = {
                chemical_name:tempData.chemical_name,
                chemical_id:tempData.chemical_id,
                chemical_perc:tempData.chemical_perc
        }
        dArray.push(tempArray);
    }
     //final response data object
     const resData = {
        process_id:data[0].process_id,
        process_name:data[0].process_name,
        remarks:data[0].remarks,
        data:dArray
    } ;
    return res.status(200).send({resData});
}