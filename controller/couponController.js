const adminProfileModel=require('../model/adminProfileModel')
const couponModel=require('../model/couponModel')


//admin coupon

exports.couponsGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const coupons=await couponModel.find()
        
        const page="coupons"
        if(adminProfile){
            res.render("coupons",{adminProfile,page,coupons})
        }
        else{
            res.render("coupons",{adminProfile:" ",page,coupons})
        }
    }catch(err){
        console.log("error when get coupons",err.message);
    }
}

//admin add coupon

exports.addcouponGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const page="coupons"
        if(adminProfile){
            res.render("addCoupon",{adminProfile,page})
        }
        else{
            res.render("addCoupon",{adminProfile:" ",page})
        }
    }catch(err){
        console.log("error when get add coupon",err.message);
    }
}

exports.addcouponPost=async(req,res)=>{
    try{
        const {couponCode,minAmount,maxAmount,discount}=req.body
        const data= new couponModel({
            couponCode:couponCode,
            minAmount:minAmount,
            maxAmount:maxAmount,
            discount:discount
        })
        await data.save()
        res.redirect("/admin/coupons")
    }
    catch(err){
        console.log("error when post add coupon",err.message);
    }
}

//admin delete coupon

exports.deleteCouponGet=async (req,res)=>{
    try{
        const couponId = req.params.id;
        const data=await couponModel.findOne({_id:couponId})
        if(data){
            await couponModel.findOneAndDelete({_id:couponId})
        }
        res.redirect("/admin/coupons")
    }catch(err){
        console.log("error when delete coupon",err.message);
    }
}

//client Coupon apply

exports.couponApplyPost=async (req,res)=>{
    try{
        const coupenCode=req.body.coupenCode
        const totalAmound=req.body.totalAmound
        const coupon=await couponModel.findOne({couponCode:coupenCode})
        if(coupon){
            const validCoupon=coupon.minAmount<totalAmound && coupon.maxAmount>totalAmound
            if(validCoupon===true){
                res.status(200).json({couponId:coupon._id,couponAmount:coupon.discount})
            }
            else{
                res.status(404).json({message:"Coupon not valid"})
            }
        }
        else{
            res.status(404).json({message:"Coupon not find"})
        }
        
    }
    catch(err){
        console.log("error when apply coupon",err.message)
    }
}