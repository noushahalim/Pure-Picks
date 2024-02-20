const signUpModel=require('../model/clientSignUpModel')
const bannerModel=require('../model/bannerModel')
const categoryModel=require('../model/categoryModal')
const productModel=require('../model/productModel')

//client home

exports.homeGet=async (req,res)=>{
    try{
        const category=await categoryModel.find()
        const banner=await bannerModel.find()
        const recentProducts=await productModel.find().sort({createdAt:-1}).limit(8)
        const recentOurProducts=await productModel.find({brand:"purepicks"}).sort({createdAt:-1}).limit(4)
        const products=await productModel.find()

        if(category){
            if(req.session.userName){
                if(banner){
                    res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:true})
                }
                else{
                    res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:true})
                }
            }
            else{
                if(banner){
                    res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:''})
                }
                else{
                    res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:''})
                }
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

//client Product Details

exports.productGet=async (req,res)=>{
    try{
        const productId=req.params.id
        const products=await productModel.find()
        const product=await productModel.findOne({_id:productId})
        const avProducts=await productModel.find({category:product.category,subCategory:product.subCategory}).limit(6)
        if(product){
            if(req.session.userName){
                res.render("product",{products,product,avProducts,user:true})
            }else{
                res.render("product",{products,product,avProducts,user:''})
            }
        }
        else{
            res.redirect("/")
        }

    }catch(err){
        console.log("error when get product page",err.message);
    }
}