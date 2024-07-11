const express=require('express');
const router=express.Router();
const catchAsync=require('../Utils/catchAsync');
const passport = require('passport');
const {storeReturnTo, isLoggedIn,isAdmin}=require('../middleware');
const users=require('../controllers/users');
const User=require('../models/user')

router.route('/signup')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.signUpUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginUser)

router.get('/logout',users.logoutUser)

router.get('/editUser',storeReturnTo,isLoggedIn,isAdmin,catchAsync(users.showUsers))

router.delete('/:userId',storeReturnTo,isLoggedIn,isAdmin,catchAsync(users.deleteUser))

router.put('/:userId',async(req,res)=>{
    const {userId}=req.params;
    const user=await User.findById(userId);
    user.role=req.body.role;
    user.save()
    res.redirect('editUser')
})

module.exports=router;
