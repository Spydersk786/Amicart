const ExpressError=require('./Utils/ExpressError');
const Product=require('./models/product');
const Review=require('./models/review');
const user = require('./models/user');
const {ProductSchema,ReviewSchema}=require('./schemas');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateProduct=(req,res,next)=>{
    const {error}=ProductSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    if((product.owner.equals(req.user._id)&&req.user.role=='dealer')||req.user.role=='admin'){
        next();
        return;
    }
    req.flash('error','You do not have permission to do that');
    return res.redirect(`/products/${id}`);
}

module.exports.isReviewOwner=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(review.owner.equals(req.user._id)||req.user.role=='admin'){
        next();
        return;
    }
    req.flash('error','You do not have permission to do that');
    res.redirect(`/products/${id}`);
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=ReviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

module.exports.isAdmin=(req,res,next)=>{
    if(req.user.role!='admin'){
        req.flash('error','You do not have permission to do that');
        const redirectUrl=res.locals.returnTo ||'/Products';
        return res.redirect(redirectUrl);
        }
    next();
}

module.exports.isDealer=(req,res,next)=>{
    if(req.user.role=='admin'||req.user.role=='dealer'){
        next();
        return;
    }
    req.flash('error','You do not have permission to do that');
    const redirectUrl=res.locals.returnTo ||'/Products';
    res.redirect(redirectUrl);
}