const adminProfileModel=require('../model/adminProfileModel')
const categoryModel=require('../model/categoryModal')
const productModel=require('../model/productModel')
const bcrypt=require('bcrypt')

//redirect admin to login

exports.adminGet=(req,res)=>{
    res.redirect("/admin/login")
}

//admin login

exports.loginGet=(req,res)=>{
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

exports.loginPost=async (req,res)=>{
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

//admin Dashboard

exports.dashboardGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        // console.log(adminProfile);
        const page="dashboard"
        if(adminProfile){
            res.render("dashboard",{adminProfile,page})
        }
        else{
            res.render("dashboard",{adminProfile:" ",page})
        }
    }catch(err){
        console.log("error when get dashboard",err.message);
    }
}

//admin Profile

exports.profileGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        // console.log(adminProfile);
        const page="profile"
        if(adminProfile){
            res.render("profile",{adminProfile,page})
        }
        else{
            res.render("profile",{adminProfile:" ",page})
        }
    }catch(err){
        console.log("error when get profile",err.message);
    }
}

exports.editProfilePost=async(req,res)=>{
    try{
        const { fullName, email, adminName, mobNumber } = req.body;
        const adminProfileImage = req.file;
        const admin=req.session.admin
        const adminProfile= await adminProfileModel.findOne({adminName:admin})
        const id=adminProfile._id
        
        await adminProfileModel.updateOne({_id:id},
            {$set:
                {
                    fullName:fullName,
                    email:email,
                    adminName:adminName,
                    mobNumber:mobNumber,
                }},
                {upsert:true})
                
        if(adminProfileImage){
            const path='/images/upload/admin/'+adminProfileImage.filename
            await adminProfileModel.updateOne({_id:id},
                {$set:
                    {
                        imagePath:path
                    }},
                    {upsert:true})    
        }
        
        console.log(`${fullName} is successfuly updated profile`);
        req.session.admin=adminName
        // console.log(req.session.admin);
        res.redirect("/admin/profile")
    }catch(error){
        console.log("error while edit profile",error.message);
    }

}

//admin Security

exports.editSecurityPost=async (req,res)=>{
    try{
        const {password,lockscreenPassword} = req.body;
        const admin=req.session.admin
        const adminProfile= await adminProfileModel.findOne({adminName:admin})
        const id=adminProfile._id
        const hashedpass=await bcrypt.hash(password,10)
        
        await adminProfileModel.updateOne({_id:id},
            {$set:
                {
                    password:hashedpass,
                    lockscreenPassword:lockscreenPassword
                }},
                {upsert:true})
                
        
        console.log(`${adminProfile.fullName} is successfuly updated password`);
        res.redirect("/admin/profile")
    }catch(err){
        console.log("error when edit security",err.message);
    }
}

//admin LockScreen

exports.lockScreenGet=async (req,res)=>{
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

exports.lockScreenPost=async (req,res)=>{
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

exports.logoutGet=(req,res)=>{
    req.session.destroy()
    res.redirect("/admin/login")
}


//admin categories

exports.categoriesGet=async (req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const categories=await categoryModel.find()
        // console.log(adminProfile);
        const page="categories"
        if(adminProfile){
            res.render("categories",{adminProfile,categories,page})
        }
        else{
            res.render("categories",{adminProfile:" ",categories,page})
        }
    }catch(err){
        console.log("error when get categories",err.message);
    }
}

exports.addCategoryPost=async (req,res)=>{
    try{
        const category=req.body.categoryName
        const data=await categoryModel.findOne({categoryName:category})
        if(data){
            res.status(403).json({message:"Already added"})
        }
        else{
            const newCategory=new categoryModel({
                categoryName:category,
                subCategory:[]
            })
            await newCategory.save()
            res.status(200).json({message:"category added successfully"})
        }
    }
    catch(err){
        console.log("error when add category",err.message);
    }
}

exports.deleteCategoryDelete=async (req,res)=>{
    try{
        const categoryName = req.params.categoryName;
        const data=await categoryModel.findOne({categoryName:categoryName})
        if(data){
            await categoryModel.findOneAndDelete({categoryName:categoryName})
            res.status(200).json({message:"Category deleted successfully"})
        }
        else{
            res.status(404).json({message:"Category not found"})
        }
    }catch(err){
        console.log("error when delete category",err.message);
    }
}

//admin sub categories

exports.subCategoryGet=async(req,res)=>{
    try{
        
        const categry=req.params.category
        const category=await categoryModel.findOne({categoryName:categry})
        if(category){
            res.status(200).json({category})
        }
        else{
            res.status(404).json({message:"Sub Category not found"})
        }
    }
    catch(err){
        console.log("error when get Sub categories",err.message);
    }
}

exports.addSubCategoryPost=async (req,res)=>{
    try{
        const {category,subCategory}=req.body
        // const category=req.body.categoryName
        const data=await categoryModel.findOne({categoryName:category})
        if(data){
            const subdata=await categoryModel.findOne({categoryName:category,subCategory:subCategory})
            if(subdata){
                res.status(403).json({message:"Already added"})
            }
            else{
                await categoryModel.findOneAndUpdate(
                    {categoryName:category},
                    {$push:{subCategory:subCategory}},
                    {new:true}
                )
                res.status(200).json({message:"sub category added successfully"})
            }
        }
        else{
            res.status(404).json({message:"Category Not Found. Please select a category!"})
        }
        
    }
    catch(err){
        console.log("error when add category",err.message);
    }
}

exports.deleteSubCategoryPost=async (req,res)=>{
    try{
        const {category,subCategory} =req.body
        const categoryData=await categoryModel.findOne({categoryName:category})
        if(categoryData){
            const updatedCategory=await categoryModel.findOneAndUpdate(
                { categoryName: category },
                { $pull: { subCategory: subCategory } },
                { new: true }
            )
            if(updatedCategory){
                // console.log(updatedCategory);
                return res.status(200).json({message:"Category deleted successfully"})
            }
            else{
                return res.status(404).json({ message: "Subcategory not found in the category" });
            }
        }
        else{
            return res.status(404).json({message:"Category not found"})
        }
    }catch(err){
        console.log("error when delete category",err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}


//admin Products

exports.productsGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const products=await productModel.find()
        // console.log(adminProfile);
        const page="products"
        if(adminProfile){
            res.render("products",{adminProfile,page,products})
        }
        else{
            res.render("products",{adminProfile:" ",page,products})
        }
    }catch(err){
        console.log("error when get products",err.message);
    }
}

//admin add Products

exports.addProductGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const categories=await categoryModel.find()
        const page="products"
        if(adminProfile){
            res.render("addProduct",{adminProfile,page,categories,product:''})
        }
        else{
            res.render("addProduct",{adminProfile:" ",page,categories,product:''})
        }
    }catch(err){
        console.log("error when get add product",err.message);
    }
}

exports.addProductPost=async(req,res)=>{
    try{
        const {productName,oldPrice,newPrice,productDescription,stock,color,size,category,subCategory}=req.body
        const image=req.files.map((file)=> '/images/upload/others/products/'+file.filename)
        // console.log(image);
        const data= new productModel({
            productName:productName,
            oldPrice:oldPrice,
            newPrice:newPrice,
            productDescription:productDescription,
            stock:stock,
            color:color,
            size:size,
            category:category,
            subCategory:subCategory,
            productImagePath:image
        })
        await data.save()

        res.redirect("/admin/products")
    }
    catch(err){
        console.log("error when product add",err.message);
    }
}

//admin Edit product

exports.editProductGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const categories=await categoryModel.find()
        const productid=req.params.id
        const product=await productModel.findOne({_id:productid})
        const page="products"
        if(product){
            if(adminProfile){
                res.render("addProduct",{adminProfile,page,categories,product})
            }
            else{
                res.render("addProduct",{adminProfile:" ",page,categories,product})
            }
        }else{
            res.redirect("/admin/products")
        }
    }catch(err){
        console.log("error when get edit product",err.message);
    }
}


exports.editProductPost=async(req,res)=>{
    try{
        const {productName,oldPrice,newPrice,productDescription,stock,color,size,category,subCategory}=req.body
        const image=req.files.map((file)=> '/images/upload/others/products/'+file.filename)
        const productid=req.params.id
        const product=await productModel.findOne({_id:productid})
        if(product){
            
            await productModel.updateOne({_id:productid},
                {$set:{
                    productName:productName,
                    oldPrice:oldPrice,
                    newPrice:newPrice,
                    productDescription:productDescription,
                    stock:stock,
                    color:color,
                    size:size,
                    category:category,
                    subCategory:subCategory,
                    productImagePath:image
                }},
                {upsert:true})
            
        }
        res.redirect("/admin/products")
    }
    catch(err){
        console.log("error when product edit",err.message);
    }
}
