const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const cartSchema=new Schema({
    products:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'products'
        },
        quantity:{
            type:Number
        }
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }
});


module.exports=mongoose.model('cart',cartSchema);   