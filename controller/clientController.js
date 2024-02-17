const signUpModel=require('../model/clientSignUpModel')
const bannerModel=require('../model/bannerModel')
const categoryModel=require('../model/categoryModal')
const productModel=require('../model/productModel')


exports.homeGet=async (req,res)=>{
    try{
        const category=await categoryModel.find()
        const banner=await bannerModel.find()
        const recentProducts=await productModel.find().sort({createdAt:-1}).limit(8)
        const recentOurProducts=await productModel.find({brand:"purepicks"}).sort({createdAt:-1}).limit(4)
        const products=await productModel.find()

        if(category){
            if(banner){
                res.render("home",{banner,category,recentProducts,recentOurProducts,products})
            }
            else{
                res.render("home",{banner:'',category,recentProducts,recentOurProducts,products})
            }
        }
        else{
            if(banner){
                res.render("home",{banner,category:''})
            }
            else{
                res.render("home",{banner:'',category:''})
            }
        }
    }
    catch(err){
        console.log("error on Home Get",err.message);
    }
}

