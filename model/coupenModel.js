const mongoose=require('mongoose')

const coupenModelSchema=new mongoose.Schema({
    coupenCode:{
        type:String,
        required:true
    },
    minAmount:{
        type:Number,
        required:true
    },
    maxAmount:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
})

const collection=new mongoose.model("coupenDatas",coupenModelSchema)

module.exports=collection