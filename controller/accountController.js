const signUpModel=require('../model/clientSignUpModel')
const wishlistModel=require('../model/wishlistModel')
const cartModel=require('../model/cartModel')
const profileModel=require('../model/clientProfileModel')
const addressModel=require('../model/addressModel')
const orderModel=require('../model/orderModel')
const productModel=require('../model/productModel')

exports.accountGet= async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const wishlistLength=wishlist?.products.length || 0
        const orders=await orderModel.find({userId:userData._id}).limit(5).sort({ orderDate: -1 }) || ''
        const orderLength=orders.length || 0
        const processedOrders = await Promise.all(orders.map(async (order) => {
            const firstProduct = order.products[0];
            const productDetails = await productModel.findById(firstProduct.productId);
            
            return {
                _id: order._id,
                orderDate: formatDate2(new Date(order.orderDate)),
                productImage: productDetails.productImagePath,
                discountedPrice: order.discountedPrice,
                totalItems:order.products.length,
            };
        }));
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("account",{processedOrders,orderLength,userData,user:true,cartLength,wishlistLength,page:'',dash:'account'})
            }
            else{
                res.render("account",{processedOrders,orderLength,userData,user:true,cartLength:'',wishlistLength,page:'',dash:'account'})
            }
        }
        else{
            res.redirect("/")
        }
    }
    catch(err){
        console.log("error when Get Account",err.message)
    }
}

//client Profile

exports.profileGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const profile=await profileModel.findOne({userId:userData._id}) || ''
        const orders=await orderModel.find({userId:userData._id}) || ''
        const orderLength=orders.length || 0
        const wishlistLength=wishlist?.products.length || 0
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("profile",{orderLength,userData,user:true,cartLength,wishlistLength,page:'',profile,dash:'profile'})
            }
            else{
                res.render("profile",{orderLength,userData,user:true,cartLength:'',wishlistLength,page:'',profile,dash:'profile'})
            }
        }
        else{
            res.redirect("/")
        }
    }
    catch(err){
        console.log("error when Get profile",err.message)
    }
}

//client Profile Edit

exports.profileEditGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const profile=await profileModel.findOne({userId:userData._id}) || ''
        const orders=await orderModel.find({userId:userData._id}) || ''
        const orderLength=orders.length || 0
        const wishlistLength=wishlist?.products.length || 0
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("profileEdit",{orderLength,userData,user:true,cartLength,wishlistLength,page:'',profile,dash:'profile'})
            }
            else{
                res.render("profileEdit",{orderLength,userData,user:true,cartLength:'',wishlistLength,page:'',profile,dash:'profile'})
            }
        }
        else{
            res.redirect("/")
        }
    }
    catch(err){
        console.log("error when Get profileEdit",err.message)
    }
}


exports.profileEditPost=async(req,res)=>{
    try{
        const {fName,lName,birthMonth,birthDay,birthYear,gender,streetAddress,country,state,city,pin} =req.body
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})

        await profileModel.findOneAndUpdate(
            {userId:userData._id},
            {$set:{
                userId:userData._id,
                fName:fName,
                lName:lName,
                birthMonth:birthMonth,
                birthDay:birthDay,
                birthYear:birthYear,
                gender:gender,
                streetAddress:streetAddress,
                country:country,
                state:state,
                city:city,
                pin:pin
            }},
            {upsert:true}
        )
        res.redirect("/profile")
        
    }
    catch(err){
        console.log("error when post profileEdit",err.message)
    }

}

//Client Address Add

exports.addressAddPost=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const {fName,lName,number,streetAddress,country,state,city,pin}=req.body
        const alreadyAddedAddress=await addressModel.findOne({fName:fName,lName:lName,number:number,streetAddress:streetAddress,country:country,state:state,city:city,pin:pin})
        if(alreadyAddedAddress){
            res.status(403).json({message:"Already added"})
        }
        else{
            const data= new addressModel({
                userId:userData._id,
                fName:fName,
                lName:lName,
                number:number,
                streetAddress:streetAddress,
                country:country,
                state:state,
                city:city,
                pin:pin
            })
        
            await data.save()
            res.status(200).json({data:data})
        }
    }
    catch(err){
        console.log("error when post addressAdd",err.message)
    }
}

//Client Orders Get 

exports.ordersGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const orders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}).sort({ orderDate: -1 }) || ''
        const wishlistLength=wishlist?.products.length || 0
        const cart=await cartModel.findOne({userId:userData._id})
        const orderLength=orders.length || 0
        const processedOrders = await Promise.all(orders.map(async (order) => {
                const firstProduct = order.products[0];
                const productDetails = await productModel.findById(firstProduct.productId);
                
                return {
                    _id: order._id,
                    orderDate: formatDate(new Date(order.orderDate)),
                    productId: firstProduct.productId,
                    productImage: productDetails.productImagePath,
                    productName: productDetails.productName,
                    discountedPrice: order.discountedPrice,
                    totalItems:order.products.length,
                    totalQuantity: order.products.reduce((acc, curr) => acc + curr.quantity, 0),
                    deliveryStatus:order.deliveryStatus
                };
            }));
        if(cart){
            const cartLength=cart.products.length
            
            res.render("orders",{user:true,cartLength,wishlistLength,page:'',dash:'orders',userData,orders:processedOrders,orderLength})
        }
        else{
            res.render("orders",{user:true,cartLength:'',wishlistLength,page:'',dash:'orders',userData,orders:processedOrders,orderLength})
        }
    }
    catch(err){
        console.log("error when get orders",err.message)
    }
}


//Client Order Details

exports.orderGet=async(req,res)=>{
    try{
        const orderId=req.params.id
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const orders=await orderModel.find({userId:userData._id}) || ''
        const order=await orderModel.findOne({_id:orderId})
        const wishlistLength=wishlist?.products.length || 0
        const cart=await cartModel.findOne({userId:userData._id})
        const orderLength=orders.length || 0
        const orderDate= formatDate(new Date(order.orderDate))
        const deliveredDate= formatDate(new Date(order.deliveredDate)) || ''

        const orderProducts = await Promise.all(order.products.map(async (product) => {
            const productDetails = await productModel.findById(product.productId);
            return {
                productId: product.productId,
                productImage: productDetails.productImagePath,
                productName: productDetails.productName,
                quantity: product.quantity,
                totalPrice: product.totalPrice
            };
        }));
        if(cart){
            const cartLength=cart.products.length
            
            res.render("orderDetails",{deliveredDate,orderDate,order,orderProducts,user:true,cartLength,wishlistLength,page:'',dash:'orders',userData,orderLength})
        }
        else{
            res.render("orderDetails",{deliveredDate,orderDate,order,orderProducts,user:true,cartLength:'',wishlistLength,page:'',dash:'orders',userData,orderLength})
        }
    }
    catch(err){
        console.log("error when get order details",err.message)
    }
}


function formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

function formatDate2(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return formattedDay + '/' + formattedMonth + '/' + year;
}