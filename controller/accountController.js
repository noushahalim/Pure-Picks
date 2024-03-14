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
        const placedOrders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}) || ''
        const cancelledOrders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}) || ''
        const orderLength=placedOrders.length || 0
        const cancelledOrdersLength=cancelledOrders.length || 0
        const address = await addressModel.find({userId:userData._id}).limit(1) || ''
        const processedOrders = await Promise.all(orders.map(async (order) => {
            const firstProduct = order.products[0];
            const productDetails = await productModel.findById(firstProduct.productId);
            
            return {
                _id: order._id,
                orderDate: formatDate(new Date(order.orderDate)),
                productImage: productDetails.productImagePath,
                discountedPrice: order.discountedPrice,
                totalItems:order.products.length,
            };
        }));
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("account",{address,cancelledOrdersLength,processedOrders,orderLength,userData,user:true,cartLength,wishlistLength,page:'',dash:'account'})
            }
            else{
                res.render("account",{address,cancelledOrdersLength,processedOrders,orderLength,userData,user:true,cartLength:'',wishlistLength,page:'',dash:'account'})
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
        const placedOrders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}) || ''
        const cancelledOrders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}) || ''
        const orderLength=placedOrders.length || 0
        const cancelledOrdersLength=cancelledOrders.length || 0
        const wishlistLength=wishlist?.products.length || 0
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("profile",{cancelledOrdersLength,orderLength,userData,user:true,cartLength,wishlistLength,page:'',profile,dash:'profile'})
            }
            else{
                res.render("profile",{cancelledOrdersLength,orderLength,userData,user:true,cartLength:'',wishlistLength,page:'',profile,dash:'profile'})
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
        const placedOrders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}) || ''
        const cancelledOrders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}) || ''
        const orderLength=placedOrders.length || 0
        const cancelledOrdersLength=cancelledOrders.length || 0
        const wishlistLength=wishlist?.products.length || 0
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("profileEdit",{cancelledOrdersLength,orderLength,userData,user:true,cartLength,wishlistLength,page:'',profile,dash:'profile'})
            }
            else{
                res.render("profileEdit",{cancelledOrdersLength,orderLength,userData,user:true,cartLength:'',wishlistLength,page:'',profile,dash:'profile'})
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

//Client Addresses

exports.addressesGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const wishlistLength=wishlist?.products.length || 0
        const cart=await cartModel.findOne({userId:userData._id})
        const placedOrders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}) || ''
        const cancelledOrders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}) || ''
        const orderLength=placedOrders.length || 0
        const cancelledOrdersLength=cancelledOrders.length || 0
        const addresses = await addressModel.find({userId:userData._id})
        if(cart){
            const cartLength=cart.products.length
            
            res.render("addresses",{cancelledOrdersLength,user:true,cartLength,wishlistLength,page:'',dash:'addresses',userData,addresses,orderLength})
        }
        else{
            res.render("addresses",{cancelledOrdersLength,user:true,cartLength:'',wishlistLength,page:'',dash:'addresses',userData,addresses,orderLength})
        }
    }
    catch(err){
        console.log("error when get addresses",err.message)
    }
}

//Client Add Address

exports.addAddressGet=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const wishlistLength=wishlist?.products.length || 0
        const cart=await cartModel.findOne({userId:userData._id})
        const placedOrders=await orderModel.find({userId:userData._id,deliveryStatus:{$ne:'Cancelled'}}) || ''
        const cancelledOrders=await orderModel.find({userId:userData._id,deliveryStatus:'Cancelled'}) || ''
        const orderLength=placedOrders.length || 0
        const cancelledOrdersLength=cancelledOrders.length || 0
        if(cart){
            const cartLength=cart.products.length
            
            res.render("addAddress",{cancelledOrdersLength,user:true,cartLength,wishlistLength,page:'',dash:'addresses',userData,orderLength})
        }
        else{
            res.render("addAddress",{cancelledOrdersLength,user:true,cartLength:'',wishlistLength,page:'',dash:'addresses',userData,orderLength})
        }
    }
    catch(err){
        console.log("error when get add Address",err.message)
    }
}

exports.addAddressPost=async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const {fName,lName,number,streetAddress,country,state,city,pin}=req.body
        const alreadyAddedAddress=await addressModel.findOne({fName:fName,lName:lName,number:number,streetAddress:streetAddress,country:country,state:state,city:city,pin:pin})
        if(alreadyAddedAddress){
            res.redirect("/addresses")
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
            res.redirect("/addresses")
        }
    }
    catch(err){
        console.log("error when post add Address",err.message)
    }
}

//Client Delete Address


exports.deleteAddressGet=async(req,res)=>{
    try{
        const addressId=req.params.id
        const address= await addressModel.findOne({_id:addressId})
        if(address){
            await addressModel.findByIdAndDelete({_id:addressId})
            res.redirect("/addresses")
        }
        else{
            res.redirect("/addresses")
        }
    }
    catch(err){
        console.log("error when delete Address",err.message)
    }
}

// -------------------------------------------------------------------------------

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return formattedDay + '/' + formattedMonth + '/' + year;
}