const authenticatedClient=(req,res,next)=>{
    const clientIsAuthenticated=req.session.userName
  if (clientIsAuthenticated) {
    next();
  } else {
    res.status(401).redirect('/login'); 
  }
}

module.exports=authenticatedClient