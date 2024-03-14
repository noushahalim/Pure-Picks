const productModel=require('../model/productModel')
const signUpModel=require('../model/clientSignUpModel')
const cartModel=require('../model/cartModel')

//client cart

exports.cartGet=async (req,res)=>{
    try{
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const cart=await cartModel.findOne({userId:client._id})
        if(cart){
            const cartLength=cart.products.length
            const cartProductIds = cart.products.map(product => product.productId);
            if (cartProductIds.length > 0) {
                const cartProducts = await productModel.find({ _id: { $in: cartProductIds } });
                if (cartProducts) {
                    res.render("cart", { cartProducts, user: true ,cartLength,cart,page:'cart'});
                    return;
                }
            }
        }
        res.render("cart", { cartProducts: [], user: true ,cartLength:'',cart,page:'cart'});
        
    }catch(err){
        console.log("error when get cart",err.message);
    }
}


//client Add cart

exports.cartAddPost=async (req,res)=>{
    try{
        const productId=req.body.productId
        const quantity=1
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const alreadyInCart = await cartModel.findOne({
            userId: client._id,
            products: { $elemMatch: { productId: productId } }
        });
        const cart= await cartModel.findOne({userId:client._id})
        const product= await productModel.findOne({_id:productId})
        
        if(alreadyInCart){
            await cartModel.findOneAndUpdate(
                { userId: client._id, "products.productId": productId },
                { $inc: { "products.$.quantity": 1 } },
                { new: true }
            );
            await cartModel.findOneAndUpdate(
                {userId:client._id},
                {
                    $set:{
                        totalItems: cart.totalItems + 1,
                        totalPrice: cart.totalPrice + product.oldPrice,
                        totalDiscount: cart.totalDiscount + (product.oldPrice - product.newPrice),
                        discountedPrice: cart.discountedPrice + product.newPrice
                    }
                }
            )
            res.status(200).json({ message: "Quantity updated in cart" });
        }
        else if(cart){
            await cartModel.findOneAndUpdate(
                {userId:client._id},
                {$push:{products:{productId:productId,quantity:quantity}},
                $set:{
                    totalItems:cart.totalItems + quantity,
                    totalPrice:cart.totalPrice + product.oldPrice,
                    totalDiscount:cart.totalDiscount + (product.oldPrice-product.newPrice),
                    discountedPrice:cart.discountedPrice + product.newPrice
                }
                },
                {new:true, upsert: true}
            )
            res.status(200).json({message:"added to cart"})
        }
        else{
            const totalDiscount=product.oldPrice-product.newPrice
            await cartModel.findOneAndUpdate(
                {userId:client._id},
                {$push:{products:{productId:productId,quantity:quantity}},
                $set:{
                    totalItems:quantity,
                    totalPrice:product.oldPrice,
                    totalDiscount:totalDiscount,
                    discountedPrice:product.newPrice
                }
                },
                {new:true, upsert: true}
            )
            res.status(200).json({message:"added to cart"})
        }
    }catch(err){
        console.log("error when post add cart",err.message);
    }
}


// client Cart Remove

exports.cartRemoveGet=async (req,res)=>{
    try{
        const productId=req.params.id
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const cart= await cartModel.findOne({userId:client._id})
        
        if(cart){
            const cartProduct = cart.products.find(product => product.productId.toString() === productId);
            if (cartProduct) {
                const product=await productModel.findOne({_id: productId})
                const productQuantity = cartProduct.quantity
                await cartModel.findOneAndUpdate(
                    { userId: client._id },
                    { $pull: { products: { productId: productId } } },
                    { new: true }
                );
                const discount=product.oldPrice-product.newPrice
                await cartModel.findOneAndUpdate(
                    {userId:client._id},
                    {$set:{
                        totalItems:cart.totalItems - productQuantity,
                        totalPrice:cart.totalPrice - (productQuantity * product.oldPrice),
                        totalDiscount:cart.totalDiscount - (productQuantity * discount),
                        discountedPrice:cart.discountedPrice - (productQuantity * product.newPrice)
                    }
                    },
                    {new:true, upsert: true}
                ) 
                res.redirect("/cart");
            }
            else{
                res.redirect("/cart")
            }
            
        }
        else{
            res.redirect("/cart")
        }
    }
    catch(err){
        console.log("error when cart remove Get",err.message);
    }
}

//client Cart Increment & Decrement 

exports.cartIncGet=async (req,res)=>{
    try{
        const productId=req.params.id
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const cart= await cartModel.findOne({userId:client._id})
        const product= await productModel.findOne({_id:productId})
        
        if(cart){
            const cartProduct = await cartModel.findOne({
                userId: client._id,
                products: { $elemMatch: { productId: productId } }
            });
            if (cartProduct) {
                await cartModel.findOneAndUpdate(
                    { userId: client._id, "products.productId": productId  },
                    { $inc: { "products.$.quantity": 1 } },
                    { upsert: true }
                );
                await cartModel.findOneAndUpdate(
                    {userId:client._id},
                    {
                        $set:{
                            totalItems: cart.totalItems + 1,
                            totalPrice: cart.totalPrice + product.oldPrice,
                            totalDiscount: cart.totalDiscount + (product.oldPrice - product.newPrice),
                            discountedPrice: cart.discountedPrice + product.newPrice
                        }
                    }
                )
                res.redirect("/cart");
            }
            else{
                res.redirect("/cart")
            }
            
        }
        else{
            res.redirect("/cart")
        }
    }
    catch(err){
        console.log("error when cart increment",err.message);
    }
}

exports.cartDecGet=async (req,res)=>{
    try{
        const productId=req.params.id
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const cart= await cartModel.findOne({userId:client._id})
        const product= await productModel.findOne({_id:productId})
        
        if(cart){
            const cartProduct = await cartModel.findOne({
                userId: client._id,
                products: { $elemMatch: { productId: productId } }
            });
            if (cartProduct) {
                await cartModel.findOneAndUpdate(
                    { userId: client._id, "products.productId": productId  },
                    { $inc: { "products.$.quantity": -1 } },
                    { upsert: true }
                );
                await cartModel.findOneAndUpdate(
                    {userId:client._id},
                    {
                        $set:{
                            totalItems: cart.totalItems - 1,
                            totalPrice: cart.totalPrice - product.oldPrice,
                            totalDiscount: cart.totalDiscount - (product.oldPrice - product.newPrice),
                            discountedPrice: cart.discountedPrice - product.newPrice
                        }
                    }
                )
                res.redirect("/cart");
            }
            else{
                res.redirect("/cart")
            }
            
        }
        else{
            res.redirect("/cart")
        }
    }
    catch(err){
        console.log("error when cart decrement",err.message);
    }
}


//client Remove All Cart

exports.cartRemoveAllGet= async (req,res)=>{
    try{
        const clientUserName=req.session.userName
        const client=await signUpModel.findOne({userName:clientUserName})
        const cart=await cartModel.findOne({userId:client._id})
        if(cart){
            await cartModel.findOneAndDelete({userId:client._id})
            res.redirect("/cart")
        }
        else{
            res.redirect("/cart")
        }
    }catch(err){
        console.log("error when remove all cart",err.message);
    }
}