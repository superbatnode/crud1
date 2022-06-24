const { check_token } = require("../auth/token");
const Token = require("../database/model/Token");
const CustomError = require("../error/CustomError");

const resetTokenValidate = async (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header)
    return next(CustomError.unauthorized("unauthorized access denied"));
    const token = header.split(" ")[1];
    try{
        const exists = await Token.exists({token});
        if(!exists)
        return next(CustomError.unauthorized("not a valid token"));
    }catch(e){
        return next(e);
    }
    try {
        const validate = await check_token(token);
        if(req.body.email !== validate.email)
        return  next(CustomError.unauthorized("invalid email"));
        req.resetPassword = {validate,token}; 
        next();
    } catch (error) {
        return next(error);
    }
}
module.exports =  resetTokenValidate;