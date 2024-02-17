const mongoose=require('mongoose')

const categoryModelSchema=new mongoose.Schema({
    categoryName:{
        type:String
        // required:true
    },
    subCategory:{
        type:Array
        // required:true
    },
    categoryImagePath:{
        type:String
        // required:true
    }
})

const collection=new mongoose.model("categoryDatas",categoryModelSchema)

module.exports=collection