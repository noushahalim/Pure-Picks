const adminProfileModel=require('../model/adminProfileModel')
const bcrypt=require('bcrypt')



//admin Profile

exports.profileGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        // console.log(adminProfile);
        const page="profile"
        if(adminProfile){
            res.render("profile",{adminProfile,page})
        }
        else{
            res.render("profile",{adminProfile:" ",page})
        }
    }catch(err){
        console.log("error when get profile",err.message);
    }
}

exports.editProfilePost=async(req,res)=>{
    try{
        const { fullName, email, adminName, mobNumber } = req.body;
        const adminProfileImage = req.file;
        const admin=req.session.admin
        const adminProfile= await adminProfileModel.findOne({adminName:admin})
        const id=adminProfile._id
        
        await adminProfileModel.updateOne({_id:id},
            {$set:
                {
                    fullName:fullName,
                    email:email,
                    adminName:adminName,
                    mobNumber:mobNumber,
                }},
                {upsert:true})
                
        if(adminProfileImage){
            const path='/images/upload/admin/'+adminProfileImage.filename
            await adminProfileModel.updateOne({_id:id},
                {$set:
                    {
                        imagePath:path
                    }},
                    {upsert:true})    
        }
        
        console.log(`${fullName} is successfuly updated profile`);
        req.session.admin=adminName
        // console.log(req.session.admin);
        res.redirect("/admin/profile")
    }catch(error){
        console.log("error while edit profile",error.message);
    }

}

//admin Security

exports.editSecurityPost=async (req,res)=>{
    try{
        const {password,lockscreenPassword} = req.body;
        const admin=req.session.admin
        const adminProfile= await adminProfileModel.findOne({adminName:admin})
        const id=adminProfile._id
        const hashedpass=await bcrypt.hash(password,10)
        
        await adminProfileModel.updateOne({_id:id},
            {$set:
                {
                    password:hashedpass,
                    lockscreenPassword:lockscreenPassword
                }},
                {upsert:true})
                
        
        console.log(`${adminProfile.fullName} is successfuly updated password`);
        res.redirect("/admin/profile")
    }catch(err){
        console.log("error when edit security",err.message);
    }
}