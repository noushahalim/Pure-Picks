const adminProfileModel=require('../model/adminProfileModel')
const clientModel=require('../model/clientSignUpModel')
const contactModel=require('../model/contactModel')


//admin Dashboard

exports.dashboardGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        // console.log(adminProfile);
        const page="dashboard"
        if(adminProfile){
            res.render("dashboard",{adminProfile,page})
        }
        else{
            res.render("dashboard",{adminProfile:" ",page})
        }
    }catch(err){
        console.log("error when get dashboard",err.message);
    }
}


//admin user management

exports.userGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const users=await clientModel.find()
        const page="users"
        if(adminProfile){
            res.render("users",{adminProfile,page,users})
        }
        else{
            res.render("users",{adminProfile:" ",page,users})
        }
    }catch(err){
        console.log("error when get user managment",err.message);
    }
}


//admin User ban

exports.banUserPost= async(req,res)=>{
    try{
        const userId=req.params.id
        const user=await clientModel.findOne({_id:userId})
        if(user){
            if(user.bannedUser==0){
                await clientModel.updateOne({_id:userId},
                    {$set:{
                        bannedUser:1
                    }},
                    {upsert:true})
                    res.status(200).json({message:"banned"})
            }
            else if(user.bannedUser==1){
                await clientModel.updateOne({_id:userId},
                    {$set:{
                        bannedUser:0
                    }},
                    {upsert:true})
                    res.status(200).json({message:"unBanned"})
            }
            else{
                res.status(404).json({message:"Can't find ban details in UserDetails"})
            }
        }
        else{
            res.status(404).json({message:"Can't find UserDetails"})
        }
    }catch(err){
        console.log("error when ban user",err.message);
    }
}

//admin Contact management

exports.contactsGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const contacts=await contactModel.find()
        const page="contacts"
        if(adminProfile){
            res.render("contacts",{adminProfile,page,contacts})
        }
        else{
            res.render("contacts",{adminProfile:" ",page,contacts})
        }
    }catch(err){
        console.log("error when get contact managment",err.message);
    }
}