const express=require('express')
const multer=require('multer')
const storage = require('../middleware/multer')
const adminRouter=express()
const adminController=require("../controller/adminController")
const adminProfileController=require("../controller/adminProfileController")
const authController=require("../controller/authController")
const categoriesController=require("../controller/categoriesController")
const productsController=require("../controller/productsController")
const bannersController=require("../controller/bannersController")


const upload = multer({ storage: storage })
const authenticatedAdmin=require('../middleware/adminAuthentication')
const lockedAdmin=require('../middleware/adminLockscreenAuthentication')

adminRouter.use(express.json())
adminRouter.use(express.urlencoded({ extended: true }));
adminRouter.set('view engine','ejs')
adminRouter.set('views','./views/admin')
// adminRouter.use(express.static('./public'))


// redirect admin to login

adminRouter.get("/",authController.adminGet)

//admin login

adminRouter.get("/login",authController.adminLoginGet)
adminRouter.post("/login",authController.adminLoginPost)

//admin Dashboard

adminRouter.get("/dashboard",authenticatedAdmin,lockedAdmin ,adminController.dashboardGet)

//admin Profile

adminRouter.get("/profile",authenticatedAdmin,lockedAdmin ,adminProfileController.profileGet)
adminRouter.post("/editProfile",upload.single('adminProfileImage'),authenticatedAdmin,lockedAdmin,adminProfileController.editProfilePost)

//admin Security

adminRouter.post("/editSecurity",authenticatedAdmin,lockedAdmin,adminProfileController.editSecurityPost)

//admin LockScreen

adminRouter.get("/lockScreen",authenticatedAdmin ,authController.adminLockScreenGet)
adminRouter.post("/lockScreen",authenticatedAdmin,authController.adminLockScreenPost)

//admin logout

adminRouter.get("/logout",authenticatedAdmin,lockedAdmin,authController.adminLogoutGet)

//admin categories

adminRouter.get("/categories",authenticatedAdmin,lockedAdmin,categoriesController.categoriesGet)
adminRouter.post("/addCategory",authenticatedAdmin,lockedAdmin,categoriesController.addCategoryPost)
adminRouter.delete("/deleteCategory/:categoryName",authenticatedAdmin,lockedAdmin,categoriesController.deleteCategoryDelete)

//admin sub categories

adminRouter.get("/subCategory/:category",authenticatedAdmin,lockedAdmin,categoriesController.subCategoryGet)
adminRouter.post("/addSubCategory",authenticatedAdmin,lockedAdmin,categoriesController.addSubCategoryPost)
adminRouter.post("/deleteSubCategory",authenticatedAdmin,lockedAdmin,categoriesController.deleteSubCategoryPost)

//admin Products

adminRouter.get("/products",authenticatedAdmin,lockedAdmin,productsController.productsGet)

//admin add Products

adminRouter.get("/addProduct",authenticatedAdmin,lockedAdmin,productsController.addProductGet)
adminRouter.post("/addProduct",authenticatedAdmin,lockedAdmin,upload.array('productImage',3),productsController.addProductPost)

//admin edit Product

adminRouter.get("/editProduct/:id",authenticatedAdmin,lockedAdmin,productsController.editProductGet)
adminRouter.post("/editProduct/:id",authenticatedAdmin,lockedAdmin,upload.array('productImage',3),productsController.editProductPost)

//admin product ban

adminRouter.post("/banProduct/:id",authenticatedAdmin,lockedAdmin,productsController.banProductPost)

//admin user Management

adminRouter.get("/users",authenticatedAdmin,lockedAdmin,adminController.userGet)

//admin user ban

adminRouter.post("/banUser/:id",authenticatedAdmin,lockedAdmin,adminController.banUserPost)


//admin banners

adminRouter.get("/banners",authenticatedAdmin,lockedAdmin,bannersController.bannersGet)

//admin add Banner

adminRouter.get("/addBanner",authenticatedAdmin,lockedAdmin,bannersController.addBannerGet)
adminRouter.post("/addBanner",authenticatedAdmin,lockedAdmin,upload.single('bannerImage'),bannersController.addBannerPost)

//admin edit banner

adminRouter.get("/editBanner/:id",authenticatedAdmin,lockedAdmin,bannersController.editBannerGet)
adminRouter.post("/editBanner/:id",authenticatedAdmin,lockedAdmin,upload.single('bannerImage'),bannersController.editBannerPost)

//admin delete banner

adminRouter.delete("/deleteBanner/:bannerId",authenticatedAdmin,lockedAdmin,bannersController.deleteBannerDelete)


module.exports=adminRouter