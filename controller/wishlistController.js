const signUpModel=require('../model/clientSignUpModel')
const productModel=require('../model/productModel')

exports.wishlistGet=async (req,res)=>{
    try{
        const products=await productModel.find()
        const wlProducts=await productModel.find().limit(4)
        res.render("wishlist",{products,wlProducts,user:true})
    }catch(err){
        console.log("error when get wishlist",err.message);
    }
}