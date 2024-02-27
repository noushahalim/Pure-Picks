const signUpModel=require('../model/clientSignUpModel')
const bannerModel=require('../model/bannerModel')
const categoryModel=require('../model/categoryModal')
const productModel=require('../model/productModel')
const cartModel=require('../model/cartModel')

//client home

exports.homeGet=async (req,res)=>{
    try{
        const clientUserName=req.session.userName
        const category=await categoryModel.find()
        const banner=await bannerModel.find({isBlocked:0})
        const recentProducts=await productModel.find().sort({createdAt:-1}).limit(8)
        const recentOurProducts=await productModel.find({brand:"purepicks"}).sort({createdAt:-1}).limit(4)
        const products=await productModel.find()
        const client=await signUpModel.findOne({userName:clientUserName})

        if(category){
            if(client){
                const cart=await cartModel.findOne({userId:client._id})
                if(cart){
                    const cartLength=cart.products.length
                    if(banner){
                        res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:true,cartLength})
                    }
                    else{
                        res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:true,cartLength})
                    }
                }
                else{
                    if(banner){
                        res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:true,cartLength:''})
                    }
                    else{
                        res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:true,cartLength:''})
                    }
                }
            }
            else{
                if(banner){
                    res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:'',cartLength:''})
                }
                else{
                    res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:'',cartLength:''})
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
        const clientUserName=req.session.userName
        const productId=req.params.id
        const products=await productModel.find()
        const product=await productModel.findOne({_id:productId})
        const avProducts=await productModel.find({category:product.category,subCategory:product.subCategory}).limit(6)
        const client=await signUpModel.findOne({userName:clientUserName})

        if(product){
            if(client){
                const cart=await cartModel.findOne({userId:client._id})
                const cartLength=cart.products.length
                res.render("product",{products,product,avProducts,user:true,cartLength})
            }else{
                res.render("product",{products,product,avProducts,user:'',cartLength:''})
            }
        }
        else{
            res.redirect("/")
        }

    }catch(err){
        console.log("error when get product page",err.message);
    }
}