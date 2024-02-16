const adminProfileModel=require('../model/adminProfileModel')
const bannerModel=require('../model/bannerModel')


exports.bannersGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const banners=await bannerModel.find()
        const page="banners"
        if(adminProfile){
            res.render("banners",{adminProfile,page,banners})
        }
        else{
            res.render("banners",{adminProfile:" ",page,banners})
        }
    }catch(err){
        console.log("error when get banner managment",err.message);
    }
}

exports.addBannerGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const page="banners"
        if(adminProfile){
            res.render("addBanner",{adminProfile,page,banner:''})
        }
        else{
            res.render("addBanner",{adminProfile:" ",page,banner:''})
        }
    }catch(err){
        console.log("error when get add banner page",err.message);
    }
}

exports.addBannerPost=async(req,res)=>{
    try{
        const {title1,title2,title3,title4,titleColor,price,priceColor,targetUrl}=req.body
        const image=req.file;
        // console.log(image);
        const path='/images/upload/others/banners/'+image.filename
        const data= new bannerModel({
            title1:title1,
            title2:title2,
            title3:title3,
            title4:title4,
            titleColor:titleColor,
            price:price,
            priceColor:priceColor,
            targetUrl:targetUrl,
            bannerImagePath:path
        })
        await data.save()

        res.redirect("/admin/banners")
    }catch(err){
        console.log("error when post add banner page",err.message);
    }
}


exports.editBannerGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const bannerid=req.params.id
        const banner=await bannerModel.findOne({_id:bannerid})
        const page="banners"
        if(banner){
            if(adminProfile){
                res.render("addBanner",{adminProfile,page,banner})
            }
            else{
                res.render("addBanner",{adminProfile:" ",page,banner})
            }
        }else{
            res.redirect("/admin/banners")
        }
    }catch(err){
        console.log("error when get edit banner page",err.message);
    }
}


exports.editBannerPost=async(req,res)=>{
    try{
        const {title1,title2,title3,title4,titleColor,price,priceColor,targetUrl}=req.body
        const bannerid=req.params.id
        const banner=await bannerModel.findOne({_id:bannerid})
        if(banner){
            
            await bannerModel.updateOne({_id:bannerid},
                {$set:{
                    title1:title1,
                    title2:title2,
                    title3:title3,
                    title4:title4,
                    titleColor:titleColor,
                    price:price,
                    priceColor:priceColor,
                    targetUrl:targetUrl
                }},
                {upsert:true})

            if(req.file){
                const image=req.file;
                const path='/images/upload/others/banners/'+image.filename

                await bannerModel.updateOne({_id:bannerid},
                    {$set:{
                        bannerImagePath:path
                    }},
                    {upsert:true})
            }
            
        }
        res.redirect("/admin/banners")
    }
    catch(err){
        console.log("error when banner edit post",err.message);
    }
}


exports.deleteBannerDelete=async (req,res)=>{
    try{
        const id=req.params.bannerId
        const deleteBanner=await bannerModel.findByIdAndDelete({_id:id})
        if(deleteBanner){
            res.status(200).json({message:"Banner Deleted"})
        }
        else{
            res.status(404).json({message:"Can't find Banner From Database"})
        }
    }catch(err){
        console.log("error when delete banner",err.message);
    }
}