const signUpModel=require('../model/clientSignUpModel')
const bannerModel=require('../model/bannerModel')
const categoryModel=require('../model/categoryModal')
const productModel=require('../model/productModel')
const cartModel=require('../model/cartModel')
const orderModel=require('../model/orderModel')
const reviewModel=require('../model/reviewModel')
const contactModel=require('../model/contactModel')

//client home

exports.homeGet=async (req,res)=>{
    try{
        const clientUserName=req.session.userName
        const category=await categoryModel.find()
        const banner=await bannerModel.find({isBlocked:0})
        const recentProducts=await productModel.find().sort({addedDate:-1}).limit(8)
        const recentOurProducts=await productModel.find({brand:"purepicks"}).sort({addedDate:-1}).limit(4)
        const products=await productModel.find().limit(40)
        const client=await signUpModel.findOne({userName:clientUserName})

        if(category){
            if(client){
                const cart=await cartModel.findOne({userId:client._id})
                if(cart){
                    const cartLength=cart.products.length
                    if(banner){
                        res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:true,cartLength,page:'home'})
                    }
                    else{
                        res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:true,cartLength,page:'home'})
                    }
                }
                else{
                    if(banner){
                        res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:true,cartLength:'',page:'home'})
                    }
                    else{
                        res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:true,cartLength:'',page:'home'})
                    }
                }
            }
            else{
                if(banner){
                    res.render("home",{banner,category,recentProducts,recentOurProducts,products,user:'',cartLength:'',page:'home'})
                }
                else{
                    res.render("home",{banner:'',category,recentProducts,recentOurProducts,products,user:'',cartLength:'',page:'home'})
                }
            }
        }
        else{
            if(banner){
                res.render("home",{banner,category:'',page:'home'})
            }
            else{
                res.render("home",{banner:'',category:'',page:'home'})
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
        const avProducts=await productModel.find({category:product.category}).limit(6)
        const client=await signUpModel.findOne({userName:clientUserName})
        const reviews=await reviewModel.find({productId:productId}).populate('userId', 'userName').exec() || ''
        reviews.forEach(review => {
            review.date = formatDate(new Date(review.date));
        });

        if(product){
            if(client){
                const cart=await cartModel.findOne({userId:client._id})
                if(cart){
                    const cartLength=cart.products.length
                    res.render("product",{reviews,products,product,avProducts,user:true,cartLength,page:'productDetails'})
                }
                else{
                    res.render("product",{reviews,products,product,avProducts,user:true,cartLength:'',page:'productDetails'})
                }
            }else{
                res.render("product",{reviews,products,product,avProducts,user:'',cartLength:'',page:'productDetails'})
            }
        }
        else{
            res.redirect("/")
        }

    }catch(err){
        console.log("error when get product page",err.message);
    }
}

//Client Product Review

exports.reviewPost=async(req,res)=>{
    try{
        const {productId,rating,reviewDescription}=req.body
        const clientUserName=req.session.userName

        const userData=await signUpModel.findOne({userName:clientUserName})
        if(!userData){
            return res.status(401).json({message:"You should login to review."})
        }

        const order=await orderModel.findOne({userId:userData._id,'products.productId':productId,deliveryStatus:"Delivered"})
        if(!order){
            return res.status(403).json({message:"You should buy this product to review."})
        }

        const review = new reviewModel({ 
            userId: userData._id,
            productId, 
            rating, 
            reviewDescription,
            date: new Date()
        });
        await review.save();

        return res.status(200).json({ message: "Review posted successfully." });
    }
    catch(err){
        console.log("error when post review",err.message);
        res.status(500).json({ message: "Internal server error." });
    }
}

//Client Contact

exports.contactPost=async(req,res)=>{
    try{
        const {email,message}=req.body
        const contact = new contactModel({ 
            email,
            message,
            date: new Date()
        });
        await contact.save();
        res.redirect("/")
    }
    catch(err){
        console.log("error when post contact",err.message);
        res.status(500).json({ message: "Internal server error." });
    }
}

//client About Us

exports.aboutUsGet=async (req,res)=>{
    try{
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        if(client){
            const cart=await cartModel.findOne({userId:client._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("about",{user:true,cartLength,page:'about'})
            }
            else{
                res.render("about",{user:true,cartLength:'',page:'about'})
            }
        }else{
            res.render("about",{user:'',cartLength:'',page:'about'})
        }

    }catch(err){
        console.log("error when get about page",err.message);
    }
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}