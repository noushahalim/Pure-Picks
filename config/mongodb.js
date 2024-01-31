const mongoose=require('mongoose')


const dbconnect=()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected Successfully");
    }
    catch(error){
        console.log("DB connection not successful");
    }
}

module.exports={dbconnect}