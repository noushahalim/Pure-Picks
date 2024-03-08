const mongoose=require('mongoose')

const couponModelSchema=new mongoose.Schema({
    couponCode:{
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

const collection=new mongoose.model("couponDatas",couponModelSchema)

module.exports=collection