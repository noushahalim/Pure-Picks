const mongoose=require('mongoose')

const bannerModelSchema=new mongoose.Schema({
    title1:{
        type:String,
        required:true
    },
    title2:{
        type:String,
        required:true
    },
    title3:{
        type:String,
        required:true
    },
    title4:{
        type:String,
        required:true
    },
    titleColor:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    priceColor:{
        type:String,
        required:true
    },
    targetUrl:{
        type:String,
        required:true
    },
    bannerImagePath:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Number,
        default:0
    }
})

const collection=new mongoose.model("bannerDatas",bannerModelSchema)

module.exports=collection