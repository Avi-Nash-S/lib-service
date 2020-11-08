const joi = require('@hapi/joi');

const userRegisterValidationSchema = joi.object({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3),
    userEmail: joi.string().email().required(),
    userName: joi.string().min(4).required(),
    password: joi.string().min(4).required(),
});

const userLoginValidationSchema = joi.object({
    userName: joi.string().min(4),
    userEmail: joi.string().email(),
    password: joi.string().min(4).required(),
});

module.exports.userRegisterValidationSchema = userRegisterValidationSchema;
module.exports.userLoginValidationSchema = userLoginValidationSchema;