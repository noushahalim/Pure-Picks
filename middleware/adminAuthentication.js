const authenticatedAdmin=(req,res,next)=>{
    const adminIsAuthenticated=req.session.admin
  if (adminIsAuthenticated) {
    next();
  } else {
    // next();
    res.status(401).redirect('/admin/login'); 
  }
}

module.exports=authenticatedAdmin