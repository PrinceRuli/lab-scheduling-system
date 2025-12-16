// backend/validations/articleValidation.js
const Joi = require('joi');

exports.createArticleValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(10).max(200).required().trim(),
        content: Joi.string().min(100).required(),
        excerpt: Joi.string().max(500).optional(),
        category: Joi.string().valid('tutorial', 'berita', 'penelitian', 'tips', 'lainnya').optional(),
        tags: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(Joi.string())
        ).optional(),
        isPublished: Joi.boolean().optional(),
        metaTitle: Joi.string().max(70).optional(),
        metaDescription: Joi.string().max(160).optional(),
        metaKeywords: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(Joi.string())
        ).optional()
    });

    return schema.validate(data);
};

exports.updateArticleValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(10).max(200).trim(),
        content: Joi.string().min(100),
        excerpt: Joi.string().max(500),
        category: Joi.string().valid('tutorial', 'berita', 'penelitian', 'tips', 'lainnya'),
        tags: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(Joi.string())
        ),
        isPublished: Joi.boolean(),
        metaTitle: Joi.string().max(70),
        metaDescription: Joi.string().max(160),
        metaKeywords: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(Joi.string())
        )
    }).min(1);

    return schema.validate(data);
};