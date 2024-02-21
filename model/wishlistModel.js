const mongoose=require('mongoose')

const wishlistSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        required:true
    }
})

const collection=mongoose.model("wishlistDatas",wishlistSchema)

module.exports=collection