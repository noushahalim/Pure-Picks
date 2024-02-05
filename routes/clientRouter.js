const express=require('express')
const clientRouter=express()
const clientController=require('../controller/clientController')

clientRouter.use(express.json())
clientRouter.use(express.urlencoded({ extended: true }));
clientRouter.set('view engine','ejs')
clientRouter.set('views','./views/client')


clientRouter.get("/",clientController.clientGet)

//client login

clientRouter.get("/login",clientController.loginGet)
clientRouter.post("/login",clientController.loginPost)

//client SignUp

clientRouter.get("/signUp",clientController.signUpGet)
clientRouter.post("/signUp",clientController.signUpPost)

//client otp

clientRouter.get("/otp/:mobileNumber",clientController.otpGet)
clientRouter.post("/otp/:otp",clientController.otpPost)


module.exports=clientRouter