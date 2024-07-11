const Product=require('../models/product');
const {cloudinary}=require('../cloudinary');
const Cart=require('../models/cart');
const mongoose= require('mongoose');

module.exports.index=async (req,res)=>{
    const products=await Product.find({});
    res.render('Products/index',{products});
}

module.exports.renderNewForm=(req,res)=>{
    res.render('Products/new');
}

//if you throw an error in async func you need to pass it to next after adding next parameter and also return if you don't want code after it to compile
module.exports.createProduct=async (req,res)=>{
    const product=new Product(req.body.product);
    product.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    product.owner=req.user._id;
    await product.save();
    req.flash('success','Successfully Added a new Product!');
    res.redirect(`/Products/${product._id}`);
}

//populate take the name of array in product schema
module.exports.showProduct=async (req,res,next)=>{
    const {id}=req.params;
    const product=await Product.findById(id).populate({
        path:'reviews',
        populate:{
            path:'owner'
        }
    }).populate('owner');
    if(!product){
        req.flash('error','Product not found!');
        return res.redirect('/Products')
    }
    let quantity=0;
    if(req.user){
        const cart= await Cart.findOne({owner: req.user._id});
        if(cart){
            const productIndex = cart.products.findIndex(p => p.productId.equals(new mongoose.Types.ObjectId(id)));
            if(productIndex!=-1){
                quantity+=cart.products[productIndex].quantity;
            }
        }
    }
    // res.render('Products/show',{product,msg:req.flash('success')});
    res.render('Products/show',{product,quantity});
}

module.exports.renderEditForm=async (req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        req.flash('error','Product not found!');
        res.redirect('/Products')
        return
    }
    res.render('Products/edit',{product});
}

//No need to save when updating
module.exports.editProduct=async (req,res)=>{
    const {id}=req.params;
    const product=await Product.findByIdAndUpdate(id,{...req.body.product})
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    product.images.push(...imgs);
    await product.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    req.flash('success','Successfully Updated!');
    res.redirect(`/Products/${product._id}`)
}

module.exports.deleteProduct=async (req,res)=>{
    const {id}=req.params;
    await Product.findByIdAndDelete(id)
    req.flash('success','Successfully Deleted!');
    res.redirect(`/Products`)
}
