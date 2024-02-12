const express=require('express')
const multer=require('multer')
const storage = require('../middleware/multer')
const adminRouter=express()
const adminController=require("../controller/adminController")
const upload = multer({ storage: storage })
const authenticatedAdmin=require('../middleware/adminAuthentication')
const lockedAdmin=require('../middleware/adminLockscreenAuthentication')

adminRouter.use(express.json())
adminRouter.use(express.urlencoded({ extended: true }));
adminRouter.set('view engine','ejs')
adminRouter.set('views','./views/admin')
// adminRouter.use(express.static('./public'))


// redirect admin to login

adminRouter.get("/",adminController.adminGet)

//admin login

adminRouter.get("/login",adminController.loginGet)
adminRouter.post("/login",adminController.loginPost)

//admin Dashboard

adminRouter.get("/dashboard",authenticatedAdmin,lockedAdmin ,adminController.dashboardGet)

//admin Profile

adminRouter.get("/profile",authenticatedAdmin,lockedAdmin ,adminController.profileGet)
adminRouter.post("/editProfile",upload.single('adminProfileImage'),authenticatedAdmin,lockedAdmin,adminController.editProfilePost)

//admin Security

adminRouter.post("/editSecurity",authenticatedAdmin,lockedAdmin,adminController.editSecurityPost)

//admin LockScreen

adminRouter.get("/lockScreen",authenticatedAdmin ,adminController.lockScreenGet)
adminRouter.post("/lockScreen",authenticatedAdmin,adminController.lockScreenPost)

//admin logout

adminRouter.get("/logout",authenticatedAdmin,lockedAdmin,adminController.logoutGet)

//admin categories

adminRouter.get("/categories",authenticatedAdmin,lockedAdmin,adminController.categoriesGet)
adminRouter.post("/addCategory",authenticatedAdmin,lockedAdmin,adminController.addCategoryPost)
adminRouter.delete("/deleteCategory/:categoryName",authenticatedAdmin,lockedAdmin,adminController.deleteCategoryDelete)

//admin sub categories

adminRouter.get("/subCategory/:category",authenticatedAdmin,lockedAdmin,adminController.subCategoryGet)
adminRouter.post("/addSubCategory",authenticatedAdmin,lockedAdmin,adminController.addSubCategoryPost)
adminRouter.post("/deleteSubCategory",authenticatedAdmin,lockedAdmin,adminController.deleteSubCategoryPost)

//admin Products

adminRouter.get("/products",authenticatedAdmin,lockedAdmin,adminController.productsGet)

//admin add Products

adminRouter.get("/addProduct",authenticatedAdmin,lockedAdmin,adminController.addProductGet)
adminRouter.post("/addProduct",authenticatedAdmin,lockedAdmin,upload.array('productImage',3),adminController.addProductPost)

//admin edit Product

adminRouter.get("/editProduct/:id",authenticatedAdmin,lockedAdmin,adminController.editProductGet)
adminRouter.post("/editProduct/:id",authenticatedAdmin,lockedAdmin,upload.array('productImage',3),adminController.editProductPost)

//admin product ban

adminRouter.post("/banProduct/:id",authenticatedAdmin,lockedAdmin,adminController.banProductPost)

//admin user Management

adminRouter.get("/users",authenticatedAdmin,lockedAdmin,adminController.userGet)

//admin user ban

adminRouter.post("/banUser/:id",authenticatedAdmin,lockedAdmin,adminController.banUserPost)






module.exports=adminRouter