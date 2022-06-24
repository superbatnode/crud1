const Joi = require("joi");
const loginDetailsValidatorWithEmail = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        "reset_password": Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });
    const { error } = await schema.validate(req.body);
    if (error)
        return next(error.message);
    next();
}
module.exports = loginDetailsValidatorWithEmail;