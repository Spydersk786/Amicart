const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const user=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['admin','dealer','customer'],
        required:true
    }
});

//it will add to our user schema unique username and password
user.plugin(passportLocalMongoose);

//products will be name of collection in database
module.exports=mongoose.model('users',user);   
