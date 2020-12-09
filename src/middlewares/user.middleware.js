const {
  userLoginValidationSchema,
  userRegisterValidationSchema,
} = require("../validations/user.validation");

//validate userLogin & userRegisterValidation
const userLoginValidation = (reqBody) =>
  userLoginValidationSchema.validate(reqBody);
const userRegisterValidation = (reqBody) =>
  userRegisterValidationSchema.validate(reqBody);

module.exports.userLoginValidation = userLoginValidation;
module.exports.userRegisterValidation = userRegisterValidation;
