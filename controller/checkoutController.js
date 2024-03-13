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
        let deliveryInfo = await addressModel.findOne({_id:addressId})
        if(!deliveryInfo){
            const profile= await profileModel.findOne({_id:addressId})
            deliveryInfo={
                userId:userData._id,
                fName:profile.fName,
                lName:profile.lName,
                number:userData.mobileNumber,
                streetAddress:profile.streetAddress,
                country:profile.country,
                state:profile.state,
                city:profile.city,
                pin:profile.pin
            }
        }
        

        if(coupenId){
            const coupen = await couponModel.findOne({_id:coupenId})
        
            const data=new orderModel({
                userId:userData._id,
                products:productsInfo,
                deliveryDetails:deliveryInfo,
                subTotal:cart.discountedPrice,
                coupenDiscount: coupen.discount,
                discountedPrice:cart.discountedPrice-coupen.discount,
                paymentMethod:payment,
                orderDate:new Date()
            })
        await data.save()
        }
        else{
            const data=new orderModel({
                userId:userData._id,
                products:productsInfo,
                deliveryDetails:deliveryInfo,
                subTotal:cart.discountedPrice,
                discountedPrice:cart.discountedPrice,
                paymentMethod:payment,
                orderDate:new Date()
            })

            await data.save()
        }
        if(payment==='UPI'){
            const latestOrder= await orderModel.findOne({userId:userData._id}).sort({ orderDate: -1 });
            const cartLength=cart.products.length
            const data={
                amount:latestOrder.discountedPrice,
                orderId:latestOrder._id
            }
            res.render('payment.ejs',{data,user: true,cartLength,page:'payment'})
        }
        else if(payment==='COD'){
            res.redirect("/paymentSuccess")
        }
    }
    catch(err){
        console.log("error when post placeOrder",err.message);
    }
}