const Joi = require("joi");
const CustomError = require("../error/CustomError");
const addressVerify = async (req, res, next) => {
    const schema = Joi.object({
        address: Joi.string()
            .min(3)
            .max(30)
            .required(),
        city: Joi.string()
            .min(3)
            .max(30)
            .required(),
        state: Joi.string()
            .min(3)
            .max(30)
            .required(),
        pincode: Joi.string().pattern(new RegExp('[0-9]{5,6}')).min(5).max(6),
        phoneno: Joi.string().pattern(new RegExp('[0-9]')).min(10).max(10)
    });
    const { error } = await schema.validate(req.body);
    if (error)
        return next(CustomError.invalidInput(error.message));

    next();
}

module.exports = addressVerify;

// "address": "String",
// "city": "String",
// "state": "String",
// "pinCode": "Number",
// "phoneNo": "Number"