const User=require("../models/userModel");
const ErrorHandler =require("../utils/errorhander");
const sendToken=require("../utils/jwtToken");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const crypto=require("crypto");
const cloudinary=require('cloudinary');
const sendEmail = require("../messages/email");


exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    })
    const {name,email,password,phoneNo,role}=req.body;

    const user=await User.create({
        name,
        email,
        password,
        phoneNo,
        role,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

    try {
        await sendEmail({
          email: user.email,
          subject: "Welcome to Rideverse",
          message: `Hi ${user.name},\n\nThank you for registering at Rideverse! We're thrilled to have you on board.\n\nBest regards,\nThe Rideverse Team`,
        });
      } catch (error) {
        console.error("Error sending email:", error);
        return next(new ErrorHandler("User registered but failed to send email.", 500));
      }
    

    sendToken(user,200,res);
    
})
exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;
    
    if(!email||!password){
        return next(new ErrorHandler("Please enter email and password",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);
});

exports.logout=catchAsyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
        secure: true, 
        sameSite: "None", 
    })
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
})

exports.myProfile=catchAsyncErrors(async(req,res,next)=>{
    try {
        // The user is attached to req.user by the middleware
        res.status(200).json({
            // success: true,
            user: req.user
        });
    } catch (error) {
        return next(new ErrorHandler("Error retrieving user details", 500));
    }
});

exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    // console.log('====================================');
    // console.log("holaa");
    // console.log('====================================');
    try{
        // console.log('====================================');
        // console.log(req.body);
        // console.log('====================================');
        const newUserData={
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        phoneNo:req.body.phoneNo,
    }
    if(req.body.avatar!==""){
        const user=await User.findByIdAndUpdate(req.user.id);
        const imageId=user.avatar.public_id;
        await cloudinary.uploader.destroy(imageId);
        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale",
        });
        newUserData.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }

        
    }
    const user=await User.findByIdAndUpdate(req.user.id, 
    newUserData, {
        new: true,
        runValidators:true,
        userFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    })}catch(error){
        return next(new ErrorHandler("Error can not update", 500));
        
    }
});
