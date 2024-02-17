const adminProfileModel=require('../model/adminProfileModel')
const productModel=require('../model/productModel')
const categoryModel=require('../model/categoryModal')



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
        const {productName,oldPrice,newPrice,productDescription,stock,brand,color,size,category,subCategory,rating}=req.body
        const image=req.files.map((file)=> '/images/upload/others/products/'+file.filename)
        // console.log(image);
        const data= new productModel({
            productName:productName,
            oldPrice:oldPrice,
            newPrice:newPrice,
            productDescription:productDescription,
            stock:stock,
            brand:brand,
            color:color,
            size:size,
            category:category,
            subCategory:subCategory,
            rating:rating,
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


exports.editProductPost = async (req, res) => {
    try {
        const { productName, oldPrice, newPrice, productDescription, stock, brand, color, size, category, subCategory, rating } = req.body;
        const productId = req.params.id;
        const product = await productModel.findOne({ _id: productId });

        if (product) {
            const updatedProduct = {
                productName,
                oldPrice,
                newPrice,
                productDescription,
                stock,
                brand,
                color,
                size,
                category,
                subCategory,
                rating,
            };

            if (req.files && req.files.length > 0) {
                updatedProduct.productImagePath = [];
                
                const newImages = req.files.map(file => '/images/upload/others/products/' + file.filename);
                updatedProduct.productImagePath = newImages;
            }

            await productModel.updateOne({ _id: productId }, { $set: updatedProduct }, { upsert: true });
        }

        res.redirect("/admin/products");
    } catch (err) {
        console.error("Error when editing product:", err.message);
        res.status(500).send("Internal Server Error");
    }
};


//admin Product ban

exports.banProductPost= async(req,res)=>{
    try{
        const productId=req.params.id
        const product=await productModel.findOne({_id:productId})
        if(product){
            if(product.bannedProduct==0){
                await productModel.updateOne({_id:productId},
                    {$set:{
                        bannedProduct:1
                    }},
                    {upsert:true})
                    res.status(200).json({message:"banned"})
            }
            else if(product.bannedProduct==1){
                await productModel.updateOne({_id:productId},
                    {$set:{
                        bannedProduct:0
                    }},
                    {upsert:true})
                    res.status(200).json({message:"unBanned"})
            }
            else{
                res.status(404).json({message:"Can't find ban details in ProductDetails"})
            }
        }
        else{
            res.status(404).json({message:"Can't find ProductDetails"})
        }
    }catch(err){
        console.log("error when ban product",err.message);
    }
}

