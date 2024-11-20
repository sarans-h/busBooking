const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt = require('jsonwebtoken')
const crypto=require('crypto');
const { ObjectId } = mongoose.Schema;

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name should not exceed 30 characters"],
        minLength:[4,"Name should not be less than 4 characters"],
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password should be at least 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }

    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    address:{
        type:String,
        trim:true,
        // required:[true,"Please enter your address"],
    },
    phoneNo:{
        type:Number,
        max:[9999999999,"Enter Correct Phone Number"],
        required:[true,"Enter Phone Number"]
    },
    myBooking:[{
        type: ObjectId, 
        ref: 'Booking',
    }],
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
// userSchema.methods.getResetPasswordToken=function(){
//     const resetToken= crypto.randomBytes(20).toString("hex");
//     this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
//     this.resetPasswordExpire= Date.now() + 15 * 60 * 1000;
//     return resetToken;
// }

module.exports=mongoose.model("User",userSchema);
