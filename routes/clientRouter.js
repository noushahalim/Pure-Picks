const express=require('express')
const clientRouter=express()
const clientController=require('../controller/clientController')
const authController=require("../controller/authController")
const wishlistController=require("../controller/wishlistController")
const cartController=require("../controller/cartController")
const accountController=require("../controller/accountController")
const checkoutController=require("../controller/checkoutController")
const couponController=require("../controller/couponController")
const paymentController=require("../controller/paymentController")
const orderController=require('../controller/orderController')
const productsController=require("../controller/productsController")


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

//Client Logout

clientRouter.get("/logout",authenticatedClient,authController.logoutGet)

//client otp

clientRouter.get("/otp/:mobileNumber",authController.otpGet)
clientRouter.post("/otp/:otp",authController.otpPost)

//Client All Products

clientRouter.get("/products",productsController.allProductsGet)

//client Product Details

clientRouter.get("/product/:id",clientController.productGet)

//client wishlist

clientRouter.get("/wishlist",authenticatedClient,wishlistController.wishlistGet)

//client Add wishlist

clientRouter.post("/wishlistAdd",authenticatedClient,wishlistController.wishlistAddPost)

//client Remove from wishlist

clientRouter.get("/wishlistRemove/:id",authenticatedClient,wishlistController.wishlistRemoveGet)

//client Remove All from wishlist

clientRouter.get("/wishlistRemoveAll",authenticatedClient,wishlistController.wishlistRemoveAllGet)

//client cart

clientRouter.get("/cart",authenticatedClient,cartController.cartGet)

//client Add cart

clientRouter.post("/cartAdd",authenticatedClient,cartController.cartAddPost)

//client Remove Cart

clientRouter.get("/cartDelete/:id",authenticatedClient,cartController.cartRemoveGet)

//client Cart Increment & Decrement 

clientRouter.get("/cartInc/:id",authenticatedClient,cartController.cartIncGet)
clientRouter.get("/cartDec/:id",authenticatedClient,cartController.cartDecGet)

//client Remove All Cart

clientRouter.get("/cartDeleteAll",authenticatedClient,cartController.cartRemoveAllGet)

//client Account

clientRouter.get("/account",authenticatedClient,accountController.accountGet)

//client Profile

clientRouter.get("/profile",authenticatedClient,accountController.profileGet)

//client Profile Edit

clientRouter.get("/profileEdit",authenticatedClient,accountController.profileEditGet)
clientRouter.post("/profileEdit",authenticatedClient,accountController.profileEditPost)

//Client Checkout

clientRouter.get("/checkout",authenticatedClient,checkoutController.checkoutGet)

//Client Coupon

clientRouter.post("/couponApply",authenticatedClient,couponController.couponApplyPost)

//Client Address Add on checkout

clientRouter.post("/addressAdd",authenticatedClient,accountController.addressAddPost)

//Client placeOrder Post

clientRouter.post("/placeOrder",authenticatedClient,checkoutController.placeOrderPost)

//Client Payment 

clientRouter.post("/createOrder",authenticatedClient,paymentController.createOrderPost)
clientRouter.get("/paymentSuccess/:id",authenticatedClient,paymentController.paymentSuccessGet)

//Client Orders

clientRouter.get("/orders",authenticatedClient,orderController.ordersGet)

//Client Cancelled Orders

clientRouter.get("/cancelledOrders",authenticatedClient,orderController.cancelledOrdersGet)

//Client Order Cancel

clientRouter.get("/orderCancel/:id",authenticatedClient,orderController.orderCancelGet)

//Client Order Details

clientRouter.get("/order/:id",authenticatedClient,orderController.orderGet)

//Client Addresses

clientRouter.get("/addresses",authenticatedClient,accountController.addressesGet)

//Client Add Address

clientRouter.get("/addAddress",authenticatedClient,accountController.addAddressGet)
clientRouter.post("/addAddress",authenticatedClient,accountController.addAddressPost)

//Client Delete Address

clientRouter.get("/deleteAddress/:id",authenticatedClient,accountController.deleteAddressGet)

//Client Product Review

clientRouter.post("/review",clientController.reviewPost)

//Client Contact

clientRouter.post("/contact",clientController.contactPost)

//Client AboutUs

clientRouter.get("/about",clientController.aboutUsGet)

//Client forgotPassword

clientRouter.get("/forgotPassword",authController.forgotPasswordGet)

module.exports=clientRouter