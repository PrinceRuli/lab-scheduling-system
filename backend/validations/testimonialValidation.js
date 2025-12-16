// backend/validations/testimonialValidation.js
const Joi = require('joi');

exports.createTestimonialValidation = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(10).max(1000).required(),
        rating: Joi.number().integer().min(1).max(5).required(),
        lab: Joi.string().hex().length(24).optional()
    });

    return schema.validate(data);
};

exports.updateTestimonialValidation = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(10).max(1000),
        rating: Joi.number().integer().min(1).max(5),
        lab: Joi.string().hex().length(24),
        isVerified: Joi.boolean(),
        isFeatured: Joi.boolean(),
        featuredOrder: Joi.number().integer().min(0)
    }).min(1);

    return schema.validate(data);
};

exports.toggleHelpfulValidation = (data) => {
    const schema = Joi.object({
        isHelpful: Joi.boolean().required()
    });

    return schema.validate(data);
};