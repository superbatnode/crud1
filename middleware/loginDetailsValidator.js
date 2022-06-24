const Joi = require("joi");
const loginDetailsValidator = async (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });
    const { error } = await schema.validate(req.body);
    if (error)
        return next(error.message);
    next();
}
module.exports = loginDetailsValidator;