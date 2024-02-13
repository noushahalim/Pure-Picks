const adminProfileModel=require('../model/adminProfileModel')
const categoryModel=require('../model/categoryModal')


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