const ErrorHandler=require("../utils/errorhander");
const catchAsyncErrors=require("./catchAsyncErrors");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token) return next(new ErrorHandler("Please Login to access this"));
   const decodedData=jwt.verify(token,process.env.JWT_SECRET);
   req.user=await User.findById(decodedData.id).populate('myBooking');//this help us to aceess the usert data whenever we want whne user is login
   next();
}
);

exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(` Role: ${req.user.role} does not have a permission to this`,403));
        }
        next();
    }
}