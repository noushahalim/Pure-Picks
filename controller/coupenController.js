const adminProfileModel=require('../model/adminProfileModel')
const coupenModel=require('../model/coupenModel')


//admin coupen

exports.coupensGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const coupens=await coupenModel.find()
        
        const page="coupens"
        if(adminProfile){
            res.render("coupens",{adminProfile,page,coupens})
        }
        else{
            res.render("coupens",{adminProfile:" ",page,coupens})
        }
    }catch(err){
        console.log("error when get coupens",err.message);
    }
}

//admin add coupen

exports.addcoupenGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const page="coupens"
        if(adminProfile){
            res.render("addCoupen",{adminProfile,page})
        }
        else{
            res.render("addCoupen",{adminProfile:" ",page})
        }
    }catch(err){
        console.log("error when get add coupen",err.message);
    }
}

exports.addcoupenPost=async(req,res)=>{
    try{
        const {coupenCode,minAmount,maxAmount,discount}=req.body
        const data= new coupenModel({
            coupenCode:coupenCode,
            minAmount:minAmount,
            maxAmount:maxAmount,
            discount:discount
        })
        await data.save()
        res.redirect("/admin/coupens")
    }
    catch(err){
        console.log("error when post add coupen",err.message);
    }
}

//admin delete coupen

exports.deleteCoupenGet=async (req,res)=>{
    try{
        const coupenId = req.params.id;
        const data=await coupenModel.findOne({_id:coupenId})
        if(data){
            await coupenModel.findOneAndDelete({_id:coupenId})
        }
        res.redirect("/admin/coupens")
    }catch(err){
        console.log("error when delete coupen",err.message);
    }
}