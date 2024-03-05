const mongoose=require("mongoose")

const clientProfileSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    fName:{
        type:String,
        required:true
    },
    lName:{
        type:String,
        required:true
    },
    birthMonth:{
        type:String,
        required:true,
    },
    birthDay:{
        type:Number,
        required:true,
    },
    birthYear:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true
    },
    streetAddress:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pin:{
        type:Number,
        required:true
    }
})

const collection=new mongoose.model("clientProfileDetails",clientProfileSchema)

module.exports=collection