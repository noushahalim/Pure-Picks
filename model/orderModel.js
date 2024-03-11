const mongoose=require('mongoose')

const productDatas={
    productId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    }
}

const orderSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:[productDatas],
    deliveryDetails:{
        type:Object,
        required:true
    },
    coupenDiscount:{
        type:Number
    },
    subTotal:{
        type:Number,
        required:true
    },
    discountedPrice:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    deliveryStatus:{
        type:String,
        default:'Order Placed',
        required:true
    },
    paymentStatus:{
        type:String,
        default:'pending'
    },
    orderDate:{
        type:String,
        required:true
    }
})

const collection=mongoose.model("orderDatas",orderSchema)

module.exports=collection