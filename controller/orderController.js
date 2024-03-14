const signUpModel=require('../model/clientSignUpModel')
const wishlistModel=require('../model/wishlistModel')
const cartModel=require('../model/cartModel')
const orderModel=require('../model/orderModel')
const productModel=require('../model/productModel')

//Client Orders Get 

exports.ordersGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const orders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}).sort({ orderDate: -1 }) || ''
        const wishlistLength=wishlist?.products.length || 0
        const cart=await cartModel.findOne({userId:userData._id})
        const cancelledOrders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}) || ''
        const cancelledOrdersLength=cancelledOrders.length || 0
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
            
            res.render("orders",{cancelledOrdersLength,user:true,cartLength,wishlistLength,page:'',dash:'orders',userData,orders:processedOrders,orderLength})
        }
        else{
            res.render("orders",{cancelledOrdersLength,user:true,cartLength:'',wishlistLength,page:'',dash:'orders',userData,orders:processedOrders,orderLength})
        }
    }
    catch(err){
        console.log("error when get orders",err.message)
    }
}

//Client cancelled Orders

exports.cancelledOrdersGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const orders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}).sort({ orderDate: -1 }) || ''
        const wishlistLength=wishlist?.products.length || 0
        const cart=await cartModel.findOne({userId:userData._id})
        const placedOrders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}) || ''
        const orderLength=placedOrders.length || 0
        const cancelledOrdersLength=orders.length || 0
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
            
            res.render("cancelledOrders",{cancelledOrdersLength,user:true,cartLength,wishlistLength,page:'',dash:'cancelledOrders',userData,orders:processedOrders,orderLength})
        }
        else{
            res.render("cancelledOrders",{cancelledOrdersLength,user:true,cartLength:'',wishlistLength,page:'',dash:'cancelledOrders',userData,orders:processedOrders,orderLength})
        }
    }
    catch(err){
        console.log("error when get cancelled Orders",err.message)
    }
}

//Client Order Details

exports.orderGet=async(req,res)=>{
    try{
        const orderId=req.params.id
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const order=await orderModel.findOne({_id:orderId})
        const wishlistLength=wishlist?.products.length || 0
        const cart=await cartModel.findOne({userId:userData._id})
        const placedOrders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}) || ''
        const cancelledOrders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}) || ''
        const orderLength=placedOrders.length || 0
        const cancelledOrdersLength=cancelledOrders.length || 0
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
            
            res.render("orderDetails",{cancelledOrdersLength,deliveredDate,orderDate,order,orderProducts,user:true,cartLength,wishlistLength,page:'',dash:'orders',userData,orderLength})
        }
        else{
            res.render("orderDetails",{cancelledOrdersLength,deliveredDate,orderDate,order,orderProducts,user:true,cartLength:'',wishlistLength,page:'',dash:'orders',userData,orderLength})
        }
    }
    catch(err){
        console.log("error when get order details",err.message)
    }
}

//Client Order Cancel

exports.orderCancelGet=async(req,res)=>{
    try{
        const orderId=req.params.id
        const order=await orderModel.findOne({_id:orderId,deliveryStatus:{$ne:'Cancelled'}})
        if(order){
            await orderModel.findByIdAndUpdate(
                {_id:orderId},
                {deliveryStatus:'Cancelled'},
                {upsert:true}
            )
            res.redirect("/cancelledOrders")
        }
        else{
            res.redirect("/orders")
        }

    }
    catch(err){
        console.log("error when cancel order",err.message)
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