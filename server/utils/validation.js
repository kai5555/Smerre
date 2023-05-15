const Joi = require("joi")

const registerSchema = Joi.object({
    username: Joi.string().min(4).max(30).alphanum().required(),
    firstName: Joi.string().min(4).max(30).alphanum().required(),
    lastName: Joi.string().min(4).max(30).regex(/^[a-zA-Z\s]*$/).required(),
    password: Joi.string().required().min(4).max(30),
    location: Joi.string().required(),
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

const plantSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Please provide a name for the plant'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Please provide a description for the plant'
    }),
    block: Joi.number().required().messages({
        'number.base': 'Please provide a valid block number',
        'number.empty': 'Please provide a value for the block number'
    }),
})

const plantValidation = (data => {
    return plantSchema.validate(data);
})


module.exports = {
    registrationValidation: registrationValidation,
    loginValidation: loginValidation,
    plantValidation: plantValidation
}