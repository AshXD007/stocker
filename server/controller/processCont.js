const processModel = require('../model/process');
const rawModel = require('../model/rawMaterialModel');
const chemicalModel = require('../model/rawMaterialModel');

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
    console.log(process_id,process_name,chemical_name,chemical_id,chemical_perc);
    console.log(typeof(process_id),typeof(process_name),typeof(chemical_name),typeof(chemical_id),typeof(chemical_perc))
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
        cid = chemical_id[i].toUpperCase();
        cnm = chemical_name[i].toUpperCase();
        const cExist = await rawModel.find({user_id:user_id,chemical_id:cid,chemical_name:cnm});
        if (JSON.stringify(cExist) === '[]'){
            return res.status(400).send({message:"please add chemical",chemical_id:cid});
        }
        const process = new processModel({
            user_id:user_id,
            chemical_name:cnm,
            chemical_id:cid,
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

    let data;
    try {
        data = await processModel.find({user_id:user_id,process_id:process_id,process_name:process_name});
    } catch (error) {
        res.status(400).send(error);
    }
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

exports.allProcess = async(req,res)=>{
    const body = req.body;
    const user_id = body.user_id;

    if(!user_id) return res.status(400).send({message:"no user_id"});

    let data;
    try {
        //get whole process data from database
        data = await processModel.find({user_id:user_id});
    } catch (error) {
        res.status(400).send(error);
    }

    //array to store response
    let process = [];
    //loop over data 
    for(let i =0 ; i < data.length ; i++){
        //flag to check if process id exist in res
        //this removes multiple same process id and name cause by poor database architecture
        let flag = false;
        //loop over res array (process)
        for(let k = 0 ; k < process.length ; k++){
            //if current data's process id is same as any process id in process array flag
            if(process[k].process_id === data[i].process_id) {
                flag = true;
            }
        }
        //if flag remains false
        if(flag === false){
            //object to store process
            const details = {};
            details.process_id = data[i].process_id;
            details.process_name = data[i].process_name;
            details.remarks = data[i].remarks;
            process.push(details);
        }
    }

    //send the response array
    res.status(200).send({process:process});

}


//delete process

exports.deleteProcess = async (req,res) =>{
    const body = req.body;
    const user_id = body.user_id;
    const process_id = body.process_id;
    const process_name = body.process_name;

    if(!user_id || !process_id || !process_name) return res.status(400).send({message:"empty fields"});

    const pid = process_id;
    const pnm = process_name;
    const query = {
        user_id:user_id,
        process_id:pid,
        process_name:pnm
    }
    try {
        const deletedProcess = await processModel.deleteMany(query);
        if(deletedProcess.deletedCount === 0) return res.status(400).send({message:"check input or no process with id"});
        res.status(200).send({message:"deleted successfully"});

    } catch (error) {
        res.status(500).send(error)
    }
}
