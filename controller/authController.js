const adminProfileModel=require('../model/adminProfileModel')
const bcrypt=require('bcrypt')
const nodemailer = require('nodemailer');

const signUpModel=require('../model/clientSignUpModel')

const Account_SID=process.env.ACCOUNT_SID
const Auth_Token=process.env.AUTH_TOKEN
const otpNumber=process.env.OTP_NUMBER 

const otpGenerator = require('otp-generator')
const client = require('twilio')(Account_SID, Auth_Token);

const NODE_MAILER_GMAIL=process.env.NODE_MAILER_GMAIL
const NODE_MAILER_PASSWORD=process.env.NODE_MAILER_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODE_MAILER_GMAIL,
    pass: NODE_MAILER_PASSWORD
  }
});

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

//client otp

let otp

exports.otpGet=async(req,res)=>{
    try{
        const mobileNumber=req.params.mobileNumber
        otp= otpGenerator.generate(6, { upperCaseAlphabets: false,lowerCaseAlphabets: false, specialChars: false });
        const message=await client.messages
            .create({
            body: `Your verification code for Pure Picks registration is ${otp} . Please enter this code to complete your sign-up process. Thank you for choosing Pure Picks!`,
            to: `+91${mobileNumber}`,
            from: otpNumber,
        })
        // .then((message) => console.log(message.sid));
        if(!message){
            res.status(400).json({error:'cant send opt'})
        }
        else{
            res.status(200).json({success:true,message:'otp sented'})
        }
    }catch(err){
        console.log('error when get otp',err.message);
        res.status(500).json({error:'Internal server error'})
    }
}

exports.otpPost=async(req,res)=>{
    try{
        const reqOtp=req.params.otp
        console.log(otp,reqOtp);
        if(otp==reqOtp){
            res.status(200).json({success:true,message:'Mobile number verified'})
        }
    }
    catch(err){
        console.log('error when post otp');
        // res.status(400).json({success:false,message:'Mobile number Not verified'})
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

exports.forgotPasswordPost=async(req,res)=>{
    try{
        const email=req.body.email
        const user=await signUpModel.findOne({email:email})
        if(user){

            const nodemailerOtp= otpGenerator.generate(6, { upperCaseAlphabets: false,lowerCaseAlphabets: false, specialChars: false });

            const mailOptions = {
              from: 'Pure Picks noreply@purepicks.xyz',
              to: user.email,
              subject: 'Pure Picks Password Reset OTP',
              text: `Dear Pure Picks User,

                    You have requested to reset your password. Here is your One Time Password (OTP) for password reset: ${nodemailerOtp}.
              
                    If you did not request this, please ignore this email.
              
                    Thank you,
                    The Pure Picks Team`,
              html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Forgot Password OTP</title>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                        }
                        .container {
                          max-width: 600px;
                          margin: 0 auto;
                          padding: 20px;
                          border: 1px solid #ccc;
                          border-radius: 5px;
                          background-color: #f9f9f9;
                        }
                        .logo {
                          text-align: center;
                          margin-bottom: 20px;
                        }
                        .logo img {
                          width: 150px;
                        }
                        .message {
                          margin-bottom: 20px;
                        }
                        .message p {
                          margin: 0;
                        }
                        .footer {
                          text-align: center;
                          color: #666;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <div class="logo">
                          <img src="https://i.ibb.co/bsX3hzq/Pure-Picks-Png.png" alt="Pure Picks Logo">
                        </div>
                        <div class="message">
                          <p>Dear Pure Picks User,</p>
                          <p>You have requested to reset your password. Here is your One Time Password (OTP) for password reset: <strong>${nodemailerOtp}</strong>.</p>
                          <p>If you did not request this, please ignore this email.</p>
                          <p>Thank you,</p>
                          <p>The Pure Picks Team</p>
                        </div>
                        <div class="footer">
                          <p>This email was sent from Pure Picks. Please do not reply to this email.</p>
                        </div>
                      </div>
                    </body>
                    </html>`
            };

            const mailHelperId=await bcrypt.hash(nodemailerOtp,10)
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Error occurred:', error);
                res.redirect("/forgotPassword")
              } else {
                const userId=user._id
                res.render("forgotPasswordOtp",{userId,mailHelperId,user:'',cartLength:'',page:'forgotPasswordOtp'})
              }
            });
        }else{
            res.redirect("/forgotPassword")
        }

    }catch(err){
        console.log("error when post forgotPassword page",err.message);
    }
}


exports.forgotPasswordOtpPost=async(req,res)=>{
    try{
        const userId=req.body.userId
        const userOtp=req.body.combinedOTP
        const hashedOtp=req.body.mailHelperId
        const compareOtp=await bcrypt.compare(userOtp,hashedOtp)
        if(compareOtp){
            const user=await signUpModel.find({_id:userId})
            if(user){
                res.status(200).json({userId:userId})
            }
            else{
                res.status(400).json({message:"can't find user"})
            }
        }
        else{
            res.status(400).json({message:'otp not valid'})
        }

    }catch(err){
        console.log("error when post forgotPasswordOtp page",err.message);
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
