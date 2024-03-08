const mongoose=require("mongoose")

const addressSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
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
    number:{
        type:Number,
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

const collection=new mongoose.model("clientAddressDatas",addressSchema)

module.exports=collection