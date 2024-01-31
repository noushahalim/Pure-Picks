const mongoose=require("mongoose")

const adminProfileSchema=new mongoose.Schema({
    fullName:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // required:true
    },
    adminName:{
        type:String,
        // required:true
    },
    mobNumber:{
        type:Number,
        // required:true,
    },
    imagePath:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true
    },
    lockscreenPassword:{
        type:String,
        // required:true
    }
})

const collection=new mongoose.model("adminProfileDetails",adminProfileSchema)

module.exports=collection