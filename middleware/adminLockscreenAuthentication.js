const lockedAdmin=(req,res,next)=>{
    const adminLocked=req.session.lockedScreen
    if(adminLocked){
        res.status(401).redirect("/admin/lockScreen")
        // next()
    }
    else{
        next()
    }
}

module.exports=lockedAdmin