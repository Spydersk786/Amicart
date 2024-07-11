const User=require('../models/user')

module.exports.renderRegisterForm=(req,res)=>{
    res.render('Users/signup');
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('Users/login');
}

module.exports.loginUser=(req,res)=>{
    const redirectUrl=res.locals.returnTo ||'/Products';
    req.flash('success','Welcome Back!');
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succusefully Logged Out!');
        res.redirect('/Products');
    });
}

module.exports.signUpUser=async (req,res)=>{
    try{
    const {email,username,password}=req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        req.flash('error', 'A user with the same email or username already exists.');
        return res.redirect('/signup');
    }
    const user=new User({email,username,role:"customer"});
    const registedUser=await User.register(user,password);
    req.login(registedUser,err=>{
        if(err){
            return next(err)
        }
        req.flash('success','Registration Successfull!');
        res.redirect('/Products');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
}

module.exports.showUsers=async(req,res)=>{
    const {username}=req.query||''
    let users=[];
    if (username) {
        const regex = new RegExp(username, 'i'); // 'i' makes the search case-insensitive
        users = await User.find({ username: regex });
    } else {
        users = await User.find({});
    }
    res.render('Users/editUser', { users,username });
}

module.exports.deleteUser=async(req,res)=>{
    const {userId}=req.params;
    await User.findByIdAndDelete(userId);
    req.flash('success','User deleted successfully')
    res.redirect('/editUser');
}