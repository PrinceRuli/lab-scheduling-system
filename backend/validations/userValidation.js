const Joi = require('joi');

// Validation for user registration
exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'teacher', 'student').default('student'),
    department: Joi.string().when('role', {
      is: Joi.valid('teacher', 'student'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional()
  });

  return schema.validate(data);
};

// Validation for user update
exports.updateUserValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    email: Joi.string().email().trim().lowercase(),
    department: Joi.string(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/),
    role: Joi.string().valid('admin', 'teacher', 'student')
  }).min(1); // At least one field to update

  return schema.validate(data);
};

// Validation for role update
exports.roleValidation = (data) => {
  const schema = Joi.object({
    role: Joi.string().valid('admin', 'teacher', 'student').required()
  });

  return schema.validate(data);
};

// Validation for password update
exports.passwordValidation = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  });

  return schema.validate(data);
};