const Joi = require("joi");
const CustomError = require("../error/CustomError");
const registerUser = async (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        lastName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirmPassword: Joi.ref('password'),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    const { error } = schema.validate(req.body);
    if (error)
        return next(CustomError.invalidInput(error.message));
    next();
}
module.exports = registerUser; 
