const mongoose=require('mongoose')

const categoryModelSchema=new mongoose.Schema({
    categoryName:{
        type:String,
        // required:true
    },
    subCategory:{
        type:Array
        // required:true
    }
})

const collection=new mongoose.model("categoryModel",categoryModelSchema)

module.exports=collection