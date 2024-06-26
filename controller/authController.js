const adminProfileModel=require('../model/adminProfileModel')
const bcrypt=require('bcrypt')

const signUpModel=require('../model/clientSignUpModel')



//////////////////////////////////////////////////////admin side

//redirect admin to login

exports.adminGet=(req,res)=>{
    res.redirect("/admin/login")
}

//admin login

exports.adminLoginGet=(req,res)=>{
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

exports.adminLoginPost=async (req,res)=>{
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



//admin LockScreen

exports.adminLockScreenGet=async (req,res)=>{
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

exports.adminLockScreenPost=async (req,res)=>{
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

exports.adminLogoutGet=(req,res)=>{
    req.session.destroy()
    res.redirect("/admin/login")
}








//////////////////////////////////////////////////////client side






//client login

exports.loginGet=(req,res)=>{
    if(req.session.userName){
        res.redirect("/")
    }else{
        res.render("login")
    }
}

exports.loginPost=async (req,res)=>{
    try{
        const loginData=req.body
        const {userName,password}=loginData
        const clientData= await signUpModel.findOne({userName:userName})
        if(clientData){
            const pass=await bcrypt.compare(password,clientData.password)
            if(pass){
                if(clientData.bannedUser==0){
                    req.session.userName=userName
                    res.status(200).json({message:"login successfuly"})
                }
                else{
                    res.status(400).json({message:"Banned User !!!"})
                }
            }
            else{
            res.status(400).json({message:"Invalid Password"})
            }
        }
        else{
            res.status(400).json({message:"Invalid User Name"})
        }
    }
    catch(error){
        console.log("error on login post",error.message);
    }


}

//client SignUp

exports.signUpGet=(req,res)=>{
    if(req.session.userName){
        res.redirect("/")
    }else{
        res.render("signUp")
    }
}



const usernameRegex = /^[a-zA-Z0-9_-]{3,12}$/;
const emailRejex=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.signUpPost=async (req,res)=>{
    try{
        const data=req.body
        const {userName,email,mobileNumber,password}= data
        const alreadyUserName=await signUpModel.findOne({userName:userName})
        const alreadyUserEmail=await signUpModel.findOne({email:email})
        const alreadyUserNumber=await signUpModel.findOne({mobileNumber:mobileNumber})
        if(userName==""||email==""||mobileNumber==""||password==""){
            res.status(422).json({message:'Please Provide All Details'})
        }
        else if(!usernameRegex.test(userName)){
            res.status(422).json({message:'Invalid username'})
        }
        else if(!emailRejex.test(email)){
            res.status(422).json({message:'Invalid email address'})
        }
        else if(mobileNumber.length!==10){
            res.status(422).json({message:'Please check your Mobile Number'})
        }
        else if(!passwordRegex.test(password)){
            res.status(422).json({message:'Invalid Password'})
        }
        else if(alreadyUserName){
           
            res.status(422).json({message:'User Name is Already Taken'})
        }
        else if(alreadyUserEmail){
            res.status(422).json({message:'email is Already Taken'})
        }
        else if(alreadyUserNumber){
            res.status(422).json({message:'Mobile Number is Already Taken'})
        }
        else{
            const hashedpass=await bcrypt.hash(password,10)
            const newUser=new signUpModel({
                userName:userName,
                email:email,
                mobileNumber:mobileNumber,
                password:hashedpass,
                registerDate:new Date()
            })
            await newUser.save()
            res.status(200).json({message:'Signup Successful'})
        }
    }catch(err){
        console.log("error on SignUp post",err.message);
    }
    
}

//Client Logout

exports.logoutGet=async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect("/")
    }
    catch(err){
        console.log("error when logout",err.message);
    }
}

//Client forgotPassword

exports.forgotPasswordGet=async(req,res)=>{
    try{
        if(req.session.userName){
            res.redirect("/")
        }else{
            res.render("forgotPassword",{user:'',cartLength:'',page:''})
        }

    }catch(err){
        console.log("error when get forgotPassword page",err.message);
    }
}



//Client Password Change

exports.changePasswordGet=async(req,res)=>{
    try{
        if(req.session.userName){
            res.redirect("/")
        }else if(! req.query.userId){
            res.redirect("/")
        }
        else{
            const userId=req.query.userId
            res.render("changePassword",{userId,user:'',cartLength:'',page:''})
        }

    }catch(err){
        console.log("error when get changePassword page",err.message);
    }
}

exports.changePasswordPost=async(req,res)=>{
    try{
        const {userId,password}= req.body
        if(!passwordRegex.test(password)){
            res.redirect('/login')
        }else{
            const hashedpass=await bcrypt.hash(password,10)
            await signUpModel.findOneAndUpdate(
                {_id:userId},
                {password:hashedpass},
                {upsert:true}
            )
            res.redirect('/login')
        }
    }
    catch(err){
        console.log("error when change password",err.message);
    }
}
