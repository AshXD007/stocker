const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true});
        console.log(`MongoDB Connected : `);
    } catch(error){
        console.log(error);
    }
}

module.exports = connectDB;