const express=require('express')
const clientRouter=express()
const clientController=require('../controller/clientController')
const authController=require("../controller/authController")


clientRouter.use(express.json())
clientRouter.use(express.urlencoded({ extended: true }));
clientRouter.set('view engine','ejs')
clientRouter.set('views','./views/client')

//client home

clientRouter.get("/",clientController.clientGet)

//client login

clientRouter.get("/login",authController.loginGet)
clientRouter.post("/login",authController.loginPost)

//client SignUp

clientRouter.get("/signUp",authController.signUpGet)
clientRouter.post("/signUp",authController.signUpPost)

//client otp

clientRouter.get("/otp/:mobileNumber",authController.otpGet)
clientRouter.post("/otp/:otp",authController.otpPost)


module.exports=clientRouter