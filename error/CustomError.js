class CustomError extends Error{
    constructor(status, message){
        super(); 
        this.status  = status; 
        this.message = message; 
    }
    static Error404(msg="Sorry page not available"){
        return new CustomError(404, msg);
    }
    static invalidInput(msg="Invalid Input"){
        return new CustomError(400, msg);
    }
    static unauthorized(msg="unauthorized user"){
        return new CustomError(401, msg);
    }

}
module.exports = CustomError;