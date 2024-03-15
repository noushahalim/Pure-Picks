const mongoose=require("mongoose")

const contactSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("contactDatas",contactSchema)

module.exports=collection