const multer = require("multer");
const CustomError = require("./CustomError");

const errorHandler = (err,req,res,next)=>{
    let statuscode = 400; 
    let error = {
        message: "Internal server error", 
        originalMessage: err
    }
    if(err instanceof CustomError){
        error.message = err.message; 
        statuscode = err.status; 
    }
    if(err instanceof multer){
        console.log(err);
    }
    res.status(statuscode).json(error);
} 
module.exports = errorHandler;