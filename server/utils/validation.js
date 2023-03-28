const Joi = require("joi")

const registerSchema = Joi.object({
    username: Joi.string().min(4).max(30).alphanum().required(),
    firstName: Joi.string().min(4).max(30).alphanum().required(),
    lastName: Joi.string().min(4).max(30).regex(/^[a-zA-Z\s]*$/).required(),
    password: Joi.string().required().min(4).max(30),
    email: Joi.string().email(),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').options({ messages: { 'any.only': '{{#label}} does not match'} })
})

const registrationValidation = (data => {
    return registerSchema.validate(data);
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const loginValidation = (data => {
    return loginSchema.validate(data);
})


module.exports = {
    registrationValidation: registrationValidation,
    loginValidation: loginValidation,
}