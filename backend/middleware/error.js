const ErrorHandler=require("../utils/errorhander");
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message||'Internal server errr';
    if(err.name==='CastError'){
        const message=`Resource Not found/ Invalid: ${err.path}`
        err=new ErrorHandler(message,400);
    }
    if(err.code===11000){
        const message=`Duplicate field value entered for ${Object.keys(err.keyValue)}`
        err=new ErrorHandler(message,400);
    }
    if(err.name==='JsonWebTokenError'){
        const message=`Json Web Token is Invalid try again`
        err=new ErrorHandler(message,400);
    }
    if(err.name==='TokenExpiredError'){
        const message=`Json Web Token is expired`
        err=new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({

        success:false,
        // error:err,
        errorStack:err.stack,
        message:err.message
    })

}