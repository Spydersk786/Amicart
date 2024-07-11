const express=require('express');
const router=express.Router();
const catchAsync=require('../Utils/catchAsync');
const {isLoggedIn,validateProduct,isOwner,storeReturnTo,isDealer}=require('../middleware')
const products=require('../controllers/products');
const multer=require('multer')
// dont need to specify index as node automatically looks for index
const {storage}=require('../cloudinary')
const upload=multer({storage})
//Joi do server side validations

//use upload.array for multiple files and in input fiel add multiple as an attribute
router.route('/')
    .get(catchAsync(products.index))
    .post(isLoggedIn,upload.array('image'),validateProduct,catchAsync(products.createProduct))

//this req should come before /Drivers/:id as it is more constant
router.get('/new',isLoggedIn,isDealer,storeReturnTo,products.renderNewForm)

router.route('/:id')
    .get(storeReturnTo,catchAsync(products.showProduct))
    .put(isLoggedIn,isOwner,upload.array('image'),validateProduct,catchAsync(products.editProduct))
    .delete(isLoggedIn,isOwner,catchAsync(products.deleteProduct))

router.get('/:id/edit',isLoggedIn,isOwner,storeReturnTo,catchAsync(products.renderEditForm))

module.exports=router