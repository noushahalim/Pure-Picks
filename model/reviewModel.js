const mongoose=require("mongoose")

const reviewSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref: 'clientSignUpDatas',
        required:true
    },
    productId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    reviewDescription:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("reviewDatas",reviewSchema)

module.exports=collection