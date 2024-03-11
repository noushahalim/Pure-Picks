const cartModel=require('../model/cartModel')
const signUpModel=require('../model/clientSignUpModel')
const Razorpay = require('razorpay');
const orderModel=require('../model/orderModel')
const productModel=require('../model/productModel')


const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpay = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY,
  });


exports.createOrderPost=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const latestOrder= await orderModel.findOne({userId:userData._id}).sort({ orderDate: -1 });

        if (!latestOrder) {
          return res.status(404).json({ error: 'No orders found' });
        }

        const amount = latestOrder.discountedPrice;
        const currency = 'INR'
        const receipt= userData.email
        
        const data={
          key:RAZORPAY_ID_KEY,
          contact:userData.mobileNumber,
          name: userData.userName,
          email: userData.email
        }
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt
          });

        res.json({order,data});
        
    }
    catch(err){
        console.log("error when post createOrder",err.message);
    }
}

exports.paymentSuccessGet=async(req,res)=>{
  try{
    const clientUserName=req.session.userName
    const userData=await signUpModel.findOne({userName:clientUserName})
    const bestProducts=await productModel.aggregate([{ $match: { rating: 5 } }, {$sample: { size: 4 } }])
    const latestOrder= await orderModel.findOne({userId:userData._id}).sort({ orderDate: -1 });
    await orderModel.findOneAndUpdate(
      {userId:userData._id},
      {paymentStatus:'paid'},
      {upsert:true}
    )

    await cartModel.findOneAndDelete({userId:userData._id})
    res.render('orderPlaced.ejs',{bestProducts,id:latestOrder._id})
  }
  catch(err){
    console.log("error when get paymentSuccess",err.message);
  }
}