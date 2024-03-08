const signUpModel=require('../model/clientSignUpModel')
const cartModel=require('../model/cartModel')
const couponModel=require('../model/couponModel')
const profileModel=require('../model/clientProfileModel')
const addressModel=require('../model/addressModel')
const productModel=require('../model/productModel')
const orderModel=require('../model/orderModel')


//Client Checkout

exports.checkoutGet=async (req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const cart=await cartModel.findOne({userId:userData._id})
        const profile=await profileModel.findOne({userId:userData._id}) || ''
        const address=await addressModel.find({userId:userData._id}).limit(1) || ''
        const addresses=await addressModel.find({userId:userData._id})
        if(cart){
            const cartLength=cart.products.length
            if (cartLength > 0) {
                const cartProducts = await cartModel.findOne({userId:userData._id}).populate("products.productId")
                if (cartProducts) {
                    const coupon=await couponModel.findOne({minAmount:{$lte:cart.discountedPrice},maxAmount:{ $gte: cart.discountedPrice }}) || ''
                    res.render("checkout", { addresses,address:address[0],userData,profile,coupon,cartProducts:cartProducts.products, user: true ,cartLength,cart,page:'cart'});
                    return;
                }
            }
            else{
                res.redirect("/cart")
            }
        }
        else{
            res.redirect("/cart")
        }
        
        
    }catch(err){
        console.log("error when get checkout",err.message);
    }
}


//Client placeOrder Post

exports.placeOrderPost=async(req,res)=>{
    try{
        const {payment,coupenId,addressId}=req.body
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const bestProducts=await productModel.aggregate([{ $match: { rating: 5 } }, {$sample: { size: 4 } }])
        const cart=await cartModel.findOne({userId:userData._id})
        const productsInfo = await Promise.all(cart.products.map(async (product) => {
            const productData = await productModel.findOne({ _id: product.productId });
            const price = productData.newPrice;
            const totalPrice = price * product.quantity;
        
            return {
                productId: product.productId,
                quantity: product.quantity,
                price: price,
                totalPrice: totalPrice
            };
        }));
        const deliveryInfo = await addressModel.findOne({_id:addressId})
        

        const data=new orderModel({
            userId:userData._id,
            products:productsInfo,
            deliveryDetails:deliveryInfo,
            subTotal:cart.discountedPrice,
            discountedPrice:cart.discountedPrice,
            paymentMethod:payment
        })
        await data.save()
        if(coupenId){
            const coupen = await couponModel.findOne({_id:coupenId})
            await orderModel.updateOne(
                {userId:userData._id},
                {$set:{
                    coupenDiscount: coupen.discount,
                    discountedPrice:cart.discountedPrice-coupen.discount
                }},
                {upsert:true})
        }
        if(payment==='UPI'){
            
        }
        else if(payment==='COD'){
            await cartModel.findOneAndDelete({userId:userData._id})
            res.render('orderPlaced.ejs',{bestProducts})
        }
    }
    catch(err){
        console.log("error when post placeOrder",err.message);
    }
}