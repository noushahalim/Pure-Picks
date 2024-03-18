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

//client otp

exports.otpGet=async(req,res)=>{
    try{
        const mobileNumber=req.params.mobileNumber
        const otp= otpGenerator.generate(6, { upperCaseAlphabets: false,lowerCaseAlphabets: false, specialChars: false });
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
            const otpHelperId=await bcrypt.hash(otp,10)
            res.status(200).json({success:true,message:'otp sented',otpHelperId:otpHelperId})
        }
    }catch(err){
        console.log('error when get otp',err.message);
        res.status(500).json({error:'Internal server error'})
    }
}

exports.otpPost=async(req,res)=>{
    try{
        const otpHelperId=req.body.otpHelperId
        const reqOtp=req.body.combinedOTP
        const compareOtp=await bcrypt.compare(reqOtp,otpHelperId)
        if(compareOtp){
            res.status(200).json({success:true,message:'Mobile number verified'})
        }
        else{
            res.status(400).json({success:false,message:'Mobile number Not verified'})
        }
    }
    catch(err){
        console.log('error when post otp',err.message);
    }
}

//Client Forgot Password 
//using nodemailer

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