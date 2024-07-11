const Cart=require('../models/cart');
const mongoose= require('mongoose');

module.exports.addToCart=async(req,res)=>{
    const {id}=req.params;
    if(req.user){
        const cart= await Cart.findOne({owner: req.user._id});
        if(cart){
            const productIndex = cart.products.findIndex(product => product.productId.equals(new mongoose.Types.ObjectId(id)));
            if(productIndex!=-1){
                req.flash('info','Product already in Cart!')
                res.redirect('/cart');
            }
            else{
                cart.products.push({productId:id,quantity:1});
                await cart.save();
            }
            return res.redirect(`/Products/${id}`) 
        }
        else {
            const newCart=new Cart({owner:req.user._id})
            newCart.products.push({productId:id,quantity:1});
            await newCart.save();
            req.flash('success','Successfully Added to Cart!');
            return res.redirect(`/Products/${id}`)
        }
    }
}

module.exports.goToCart=async(req,res)=>{
    const cart=await Cart.findOne({owner:req.user._id}).populate({
        path: 'products.productId',
        select: 'title price'
    });
    res.render('cart',{cart});
}

module.exports.increaseQuantity=async(req,res)=>{
    const {id}=req.params;
    if(req.user){
        const userId=req.user._id;
        const cart = await Cart.findOne({ owner: userId });
        if (!cart) {
            const newCart = new Cart({ owner: userId, products: [{ id, quantity: 1 }] });
            await newCart.save();
            req.flash('success', 'Successfully Added to Cart!');
            return res.redirect(`/Cart`);
        }
        const productIndex = cart.products.findIndex(product => product.productId.equals(new mongoose.Types.ObjectId(id)));
        if (productIndex === -1) {
            req.flash('success', 'Successfully Added to Cart!');
            cart.products.push({ productId:id, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
            req.flash('success', 'Updated quantity!');
        }
        await cart.save();
        res.redirect(`/Cart`);
    } else {
        req.flash('info','Login Required!')
        res.redirect('/login')
    }
}

module.exports.decreaseQuantity=async(req,res)=>{
    const {id}=req.params;
    if(req.user){
        const userId=req.user._id;
        const cart = await Cart.findOne({ owner: userId });
        if (!cart) {
            req.flash('info', 'Cart is Already Empty!');
            return res.redirect(`/Cart`);
        }
        const productIndex = cart.products.findIndex(product => product.productId.equals(new mongoose.Types.ObjectId(id)));
        if (productIndex === -1) {
            req.flash('error', 'Product Not found in Cart!');
        } else {
            cart.products[productIndex].quantity--;
            if (cart.products[productIndex].quantity === 0) {
                cart.products.splice(productIndex, 1);
                req.flash('success','Removed from Cart')
            }
            else{
            req.flash('success', 'Updated quantity!');
            }
        }
        await cart.save();
        res.redirect(`/Cart`);
    } else {
        req.flash('info','Login Required!')
        res.redirect('/login')
    }
}

module.exports.deleteFromCart=async(req,res)=>{
    const {id}=req.params;
    if(req.user){
        const userId=req.user._id;
        const cart = await Cart.findOne({ owner: userId });
        if (!cart) {
            req.flash('info', 'Cart is Already Empty!');
            return res.redirect(`/Cart`);
        }
        const productIndex = cart.products.findIndex(product => product.productId.equals(new mongoose.Types.ObjectId(id)));
        if (productIndex === -1) {
            req.flash('error', 'Product Not found in Cart!');
        } else {
            cart.products.splice(productIndex, 1);
            req.flash('success','Successfully Removed from Cart')
        }
        await cart.save();
        res.redirect(`/Cart`);
    } else {
        req.flash('info','Login Required!')
        res.redirect('/login')
    }
}