const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   if(file.fieldname=="productImage"){
    //     cb(null, './public/images/upload/products')
    //   }
      if(file.fieldname=="adminProfileImage"){
        cb(null, './public/images/upload/admin')
      }
      else if(file.fieldname=="productImage"){
        cb(null, './public/images/upload/others/products')
      }
      else if(file.fieldname=="bannerImage"){
        cb(null, './public/images/upload/others/banners')
      }
      else{
        cb(null, './public/images/upload/others')
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname
      cb(null, uniqueSuffix)
    }
  })

module.exports = storage

