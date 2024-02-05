const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv').config()
const session=require('express-session')
const nocache=require('nocache')


//Connecting DB
const DBconnect= require('./config/mongodb')
DBconnect.dbconnect()


const port=process.env.PORT || 8080
const secret=process.env.SECRET
const app=express()

app.use(session({
  secret,
  resave: false,
  saveUninitialized: true
  }))
app.use(nocache());

//loading assets
app.use('/admin',express.static('./public/admin'))
app.use('/client',express.static('./public/client'))
app.use(express.static('./public'))



//for admin route
const admin=require("./routes/adminRouter")
app.use("/admin",admin)

//for user route
const client=require("./routes/clientRouter")
app.use("/",client)




app.listen(port,()=>{
    console.log(`server started on ${port}`);
})