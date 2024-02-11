const mongoose=require('mongoose')

const productModelSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    oldPrice:{
        type:Number,
        required:true
    },
    newPrice:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        // required:true
    },
    stock:{
        type:Number,
        required:true
    },
    color:{
        type:String,
        // required:true
    },
    size:{
        type:String,
        // required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    productImagePath:{
        type:Array,
        required:true
    },
    bannedProduct:{
        type:Number,
        default:0,
    }
})

const collection=new mongoose.model("productDatas",productModelSchema)

module.exports=collection