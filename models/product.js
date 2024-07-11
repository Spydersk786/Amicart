const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

const ImageSchema=new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue')
})

const product=new Schema({
    title:String,
    price:Number,
    category:String,
    description:String,
    images:[
       ImageSchema
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    reviews:[
        {
            // Refering to collection named reviews
            type:Schema.Types.ObjectId,
            ref:'reviews'
        }
    ]
});

//will execute automatically after findbyidandDelete, it is mongoose middleware
product.post('findOneAndDelete', async(doc)=>{
    if (doc) {
        await Review.deleteMany({_id: {$in: doc.reviews}});
    }
});



//products will be name of collection in database
module.exports=mongoose.model('products',product);   
