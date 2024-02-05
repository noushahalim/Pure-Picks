const mongoose=require("mongoose")

const clientSignUpSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    registerDate:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("clientSignUpDatas",clientSignUpSchema)

module.exports=collection