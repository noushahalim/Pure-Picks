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
adminRouter.get("/subCategory/:category",authenticatedAdmin,lockedAdmin,adminController.subCategoryGet)
adminRouter.post("/addSubCategory",authenticatedAdmin,lockedAdmin,adminController.addSubCategoryPost)
adminRouter.post("/deleteSubCategory",authenticatedAdmin,lockedAdmin,adminController.deleteSubCategoryPost)



module.exports=adminRouter