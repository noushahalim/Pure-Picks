const mongoose=require('mongoose')

const cartElement={
    productId:{
        type:mongoose.Types.ObjectId,
        ref:"productDatas",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
}

const cartSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:[cartElement],
    totalItems:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    totalDiscount:{
        type:Number,
        required:true
    },
    discountedPrice:{
        type:Number,
        required:true
    }
})

const collection=mongoose.model("cartDatas",cartSchema)

module.exports=collection