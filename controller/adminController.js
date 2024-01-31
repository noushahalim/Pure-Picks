const adminProfileModel=require('../model/adminProfileModel')
const bcrypt=require('bcrypt')

//redirect admin to login

exports.adminGet=(req,res)=>{
    res.redirect("/admin/login")
}

//admin login

exports.loginGet=(req,res)=>{
    if(req.session.lockedScreen){
        req.session.destroy()
        res.redirect("/admin/login")
    }
    else if(req.session.admin){
        res.redirect("/admin/dashboard")
    }
    else{
        res.render("login")
    }
}

exports.loginPost=async (req,res)=>{
    try {
        const admin=req.body.adminName
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        // console.log(adminProfile);
        if(adminProfile){
            const password=await bcrypt.compare(req.body.password,adminProfile.password)
            if(password){
                req.session.admin=req.body.adminName
                if(!adminProfile.fullName || !adminProfile.imagePath || !adminProfile.email || !adminProfile.mobNumber){
                    res.redirect("/admin/profile")
                }
                else{
                    res.redirect("/admin/dashboard")
                }
            }
            else{
                console.log("password is wrong, can't login");
                res.redirect("/admin/login")
            }
        }
        else{
            console.log("admin is wrong, can't login");
            res.redirect("/admin/login")
        }
    } catch (error) {
        console.log("error when login to admin",error);
    }
}

//admin Dashboard

exports.dashboardGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        // console.log(adminProfile);
        if(adminProfile){
            res.render("dashboard",{adminProfile})
        }
        else{
            res.render("dashboard",{adminProfile:" "})
        }
    }catch(err){
        console.log("error when get dashboard",err.message);
    }
}

//admin Profile

exports.profileGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        // console.log(adminProfile);
        if(adminProfile){
            res.render("profile",{adminProfile})
        }
        else{
            res.render("profile",{adminProfile:" "})
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

//admin LockScreen

exports.lockScreenGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        if(adminProfile.lockscreenPassword){
            req.session.lockedScreen=true
            res.render("lockScreen",{adminProfile})
        }
        else{
            res.redirect("/admin/profile")
        }
    }catch(err){
        console.log("error when get dashboard",err.message);
    }
}

exports.lockScreenPost=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        if(req.body.lockScreenPassword==adminProfile.lockscreenPassword){
            delete req.session.lockedScreen
            res.redirect('/admin/dashboard')
        }
        else{
            res.redirect('/admin/lockScreen')
        }
    } catch (error) {
        console.log("error when post on lockScreen",error);
    }
    
}


//admin logout

exports.logoutGet=(req,res)=>{
    req.session.destroy()
    res.redirect("/admin/login")
}