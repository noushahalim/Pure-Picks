const signUpModel=require('../model/clientSignUpModel')
const wishlistModel=require('../model/wishlistModel')
const cartModel=require('../model/cartModel')
const profileModel=require('../model/clientProfileModel')
const addressModel=require('../model/addressModel')

exports.accountGet= async(req,res)=>{
    try{
        const clientUserName=req.session.userName
        const userData=await signUpModel.findOne({userName:clientUserName})
        const wishlist=await wishlistModel.findOne({userId:userData._id})
        const wishlistLength=wishlist?.products.length || 0
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("account",{userData,user:true,cartLength,wishlistLength,page:'',dash:'account'})
            }
            else{
                res.render("account",{userData,user:true,cartLength:'',wishlistLength,page:'',dash:'account'})
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
        const wishlistLength=wishlist?.products.length || 0
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("profile",{userData,user:true,cartLength,wishlistLength,page:'',profile,dash:'profile'})
            }
            else{
                res.render("profile",{userData,user:true,cartLength:'',wishlistLength,page:'',profile,dash:'profile'})
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
        const wishlistLength=wishlist?.products.length || 0
        if(userData){
            const cart=await cartModel.findOne({userId:userData._id})
            if(cart){
                const cartLength=cart.products.length
                res.render("profileEdit",{userData,user:true,cartLength,wishlistLength,page:'',profile,dash:'profile'})
            }
            else{
                res.render("profileEdit",{userData,user:true,cartLength:'',wishlistLength,page:'',profile,dash:'profile'})
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