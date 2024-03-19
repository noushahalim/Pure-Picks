const adminProfileModel=require('../model/adminProfileModel')
const productModel=require('../model/productModel')
const categoryModel=require('../model/categoryModal')
const reviewModel=require('../model/reviewModel')
const signUpModel=require('../model/clientSignUpModel')
const cartModel=require('../model/cartModel')


//admin Products

exports.productsGet=async(req,res)=>{
    try{
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const products=await productModel.find().sort({addedDate:-1})
        
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

//admin Product Details

exports.productDetailsGet=async(req,res)=>{
    try{
        const productId=req.params.id
        const admin=req.session.admin
        const adminProfile=await adminProfileModel.findOne({adminName:admin})
        const product=await productModel.findOne({_id:productId})
        const reviews=await reviewModel.find({productId:productId}).populate('userId', 'userName').exec() || ''
        reviews.forEach(review => {
            review.date = formatDate(new Date(review.date));
        });

        const page="products"

        if(product){
            if(adminProfile){
                res.render("productDetails",{page,adminProfile,reviews,product})
            }else{
                res.render("productDetails",{page,adminProfile:" ",reviews,product})
            }
        }
        else{
            res.redirect("/admin")
        }
    }catch(err){
        console.log("error when get product details",err.message);
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
            productImagePath:image,
            addedDate:new Date()
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
                rating
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

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}


// -----------------------------------------------------------------------------------


//Client All Products

exports.allProductsGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const categories=await categoryModel.find()
        const cart= await cartModel.findOne({userId:client ?._id})
        const productsPerPage = 12;
        let currentPage = parseInt(req.query.page) || 1;
        const search = req.query.search;
        const category = req.query.category;
        const sort = req.query.sort;

        let query = {
            stock: { $gt: 0 },
            bannedProduct: { $ne: 1 }
        };

        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        let sortQuery = {};

        if (sort === "price low to high") {
            sortQuery = { newPrice: 1 };
        } else if (sort === "price high to low") {
            sortQuery = { newPrice: -1 };
        }

        let totalProducts = await productModel.countDocuments(query);
        let totalPages = Math.ceil(totalProducts / productsPerPage);

        currentPage = Math.min(currentPage, totalPages);

        let visiblePages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 3);

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        let products = await productModel.find(query)
            .sort(sortQuery)
            .skip((currentPage - 1) * productsPerPage)
            .limit(productsPerPage);


        res.render("products", {
            categories,
            products,
            user: client ? true : '',
            cartLength: client ? cart ? cart.products.length : '' : '',
            page: 'products',
            currentPage,
            totalPages,
            visiblePages,
            search, 
            category,
            sort 
        });
        
    }
    catch(err){
        console.log("Error when getting all products", err.message);
        res.status(500).send("Internal Server Error");
    }
}