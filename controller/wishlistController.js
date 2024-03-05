const signUpModel=require('../model/clientSignUpModel')
const productModel=require('../model/productModel')
const wishlistModel=require('../model/wishlistModel')
const cartModel=require('../model/cartModel')

//client wishlist

exports.wishlistGet=async (req,res)=>{
    try{
        const products=await productModel.find()
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:client._id})
        if(wishlist){
            const wlProducts=await productModel.find({_id:wishlist.products})
            if(wlProducts){
                const cart=await cartModel.findOne({userId:client._id})
                if(cart){
                    const cartLength=cart.products.length
                    res.render("wishlist",{products,wlProducts,user:true,cartLength,page:'wishlist'})
                }
                else{
                    res.render("wishlist",{products,wlProducts,user:true,cartLength:'',page:'wishlist'})
                }
            }
            else{
                res.render("wishlist",{products,wlProducts:'',user:true,cartLength:'',page:'wishlist'})
            }
        }
        else{
            res.render("wishlist",{products,wlProducts:'',user:true,cartLength:'',page:'wishlist'})
        }
        
    }catch(err){
        console.log("error when get wishlist",err.message);
    }
}

//client Add wishlist

exports.wishlistAddPost=async (req,res)=>{
    try{
        const productId=req.body.productId
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:client._id})
        if(wishlist){
            const product=await wishlistModel.findOne({userId:client._id,products:productId})
            if(product){
                res.status(403).json({message:"Already added"})
            }
            else{
                await wishlistModel.findOneAndUpdate(
                    {userId:client._id},
                    {$push:{products:productId}},
                    {new:true}
                )
                res.status(200).json({message:"added to wishlist"})
            }
            
        }
        else{
            const newWishlist=new wishlistModel({
                userId:client._id,
                products:[productId]
            })
            await newWishlist.save()
            res.status(200).json({message:"added to wishlist"})
        }
    }catch(err){
        console.log("error when post add wishlist",err.message);
    }
}

//client Remove from wishlist

exports.wishlistRemoveGet= async (req,res)=>{
    try{
        const productId=req.params.id
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:client._id})
        if(wishlist){
            const product=await wishlistModel.findOne({userId:client._id,products:productId})
            if(product){
                await wishlistModel.findOneAndUpdate(
                    {userId:client._id},
                    {$pull:{products:productId}},
                    {new:true}
                )
                res.redirect("/wishlist")
            }
            else{
                res.redirect("/wishlist")
            }
            
        }
        else{
            res.redirect("/wishlist")
        }
    }catch(err){
        console.log("error when delete wishlist product",err.message);
    }
}

//client Remove All from wishlist

exports.wishlistRemoveAllGet= async (req,res)=>{
    try{
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:client._id})
        if(wishlist){
            await wishlistModel.findOneAndDelete({userId:client._id})
            res.redirect("/wishlist")
        }
        else{
            res.redirect("/wishlist")
        }
    }catch(err){
        console.log("error when delete wishlist",err.message);
    }
}