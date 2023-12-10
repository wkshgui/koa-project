const Joi = require("joi");
const { User } = require("../model/index");

module.exports.registerValidate = async (ctx, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().email().required(),
        phone: Joi.required()
    }).validate(ctx.request.body);

    if(schema.error) {
        ctx.throw(400, schema.error);
    }

    const emailValidate = await User.findOne({email: ctx.request.body.email});
    if(emailValidate) {
        ctx.throw(400, "邮箱已经被注册");
    }

    await next();
}

module.exports.loginValidate = async (ctx, next) => {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
        email: Joi.string().email().required()
    }).validate(ctx.request.body);

    if(schema.error) {
        ctx.throw(400, schema.error);
    }

    const emailValidate = await User.findOne({email: ctx.request.body.email});
    if(!emailValidate) {
        ctx.throw(400, "邮箱未注册");
    }

    await next();
}