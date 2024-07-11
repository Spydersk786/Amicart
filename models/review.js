const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:Number,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
});


module.exports=mongoose.model('reviews',reviewSchema);   