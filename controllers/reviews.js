const Product=require('../models/product');
const Review=require('../models/review');

module.exports.createReview=async(req,res)=>{
    const product=await Product.findById(req.params.id);
    const review=new Review(req.body.review);
    product.reviews.push(review);
    review.owner=req.user._id;
    await review.save();
    await product.save();
    req.flash('success','Successfully Added a Review!');
    res.redirect(`/Products/${product._id}`);
}

module.exports.deleteReview=async (req,res)=>{
    const {id,reviewId}=req.params;
    await Product.findByIdAndUpdate(id,{$pull : {reviews:reviewId}}) 
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully Deleted!');
    res.redirect(`/Products/${id}`)
}