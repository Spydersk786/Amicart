const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../Utils/catchAsync');
const reviews=require('../controllers/reviews');

const {isLoggedIn,validateReview, isReviewOwner}=require('../middleware')

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))

// pull will pull that review out from the product
router.delete('/:reviewId',isLoggedIn,isReviewOwner,catchAsync(reviews.deleteReview))

module.exports=router