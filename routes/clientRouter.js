const express=require('express')
const clientRouter=express()
const clientController=require('../controller/clientController')

clientRouter.use(express.json())
clientRouter.use(express.urlencoded({ extended: true }));
clientRouter.set('view engine','ejs')
clientRouter.set('views','./views/client')


clientRouter.get("/",clientController.clientGet)

module.exports=clientRouter