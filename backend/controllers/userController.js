const User=require("../models/userModel");
const ErrorHandler =require("../utils/errorhander");
const sendToken=require("../utils/jwtToken");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const crypto=require("crypto");



exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password,phoneNo,role}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        phoneNo,
        role,
        avatar:{
            public_id:"duumy id",
            url:"https://example.com/duumy.jpg"
        }
    });
    sendToken(user,200,res);
    
})
exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;
    console.log(email,password);
    
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
})