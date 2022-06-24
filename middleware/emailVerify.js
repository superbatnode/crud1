const Joi = require("joi");
const emailVerify = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    });
    const { error } = await schema.validate(req.body);
    if (error)
        return next(error.message);

    next();
}
module.exports = emailVerify;