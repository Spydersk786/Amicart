const express=require('express');
const router=express.Router();
const catchAsync=require('../Utils/catchAsync');
const {isLoggedIn,storeReturnTo, isAdmin}=require('../middleware')
const carts=require('../controllers/carts')

router.route('/:id')
    .post(isLoggedIn,catchAsync(carts.addToCart))
    .delete(isLoggedIn,catchAsync(carts.deleteFromCart))

router.get('/',isLoggedIn,storeReturnTo,catchAsync(carts.goToCart));

router.post('/:id/increase',isLoggedIn,catchAsync(carts.increaseQuantity))

router.post('/:id/decrease',isLoggedIn,catchAsync(carts.decreaseQuantity))


module.exports=router