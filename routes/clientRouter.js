const express=require('express')
const clientRouter=express()
const clientController=require('../controller/clientController')
const authController=require("../controller/authController")
const wishlistController=require("../controller/wishlistController")
const cartController=require("../controller/cartController")

const authenticatedClient=require('../middleware/clientAuthentication')


clientRouter.use(express.json())
clientRouter.use(express.urlencoded({ extended: true }));
clientRouter.set('view engine','ejs')
clientRouter.set('views','./views/client')

//client home

clientRouter.get("/",clientController.homeGet)

//client login

clientRouter.get("/login",authController.loginGet)
clientRouter.post("/login",authController.loginPost)

//client SignUp

clientRouter.get("/signUp",authController.signUpGet)
clientRouter.post("/signUp",authController.signUpPost)

//client otp

clientRouter.get("/otp/:mobileNumber",authController.otpGet)
clientRouter.post("/otp/:otp",authController.otpPost)

//client Product Details

clientRouter.get("/:productName/:id",clientController.productGet)

//client wishlist

clientRouter.get("/wishlist",authenticatedClient,wishlistController.wishlistGet)

//client cart

clientRouter.get("/cart",authenticatedClient,cartController.cartGet)


module.exports=clientRouter