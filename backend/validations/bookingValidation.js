const Joi = require('joi');

// Validation for booking creation
exports.createBookingValidation = (data) => {
  const schema = Joi.object({
    lab: Joi.string().required(),
    title: Joi.string().min(5).max(200).required().trim(),
    description: Joi.string().max(1000).optional().allow(''),
    date: Joi.date().iso().min('now').required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    participants: Joi.number().integer().min(1).required(),
    recurring: Joi.object({
      isRecurring: Joi.boolean().default(false),
      frequency: Joi.when('isRecurring', {
        is: true,
        then: Joi.string().valid('weekly', 'biweekly', 'monthly').required(),
        otherwise: Joi.optional()
      }),
      endDate: Joi.when('isRecurring', {
        is: true,
        then: Joi.date().iso().min(Joi.ref('date')).required(),
        otherwise: Joi.optional()
      })
    }).optional()
  });

  return schema.validate(data);
};

// Validation for booking update
exports.updateBookingValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).trim(),
    description: Joi.string().max(1000).allow(''),
    date: Joi.date().iso(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    participants: Joi.number().integer().min(1),
    recurring: Joi.object({
      isRecurring: Joi.boolean(),
      frequency: Joi.string().valid('weekly', 'biweekly', 'monthly'),
      endDate: Joi.date().iso()
    })
  }).min(1);

  return schema.validate(data);
};

// Validation for booking status update
exports.bookingStatusValidation = (data) => {
  const schema = Joi.object({
    adminNotes: Joi.string().max(500).optional().allow(''),
    cancellationReason: Joi.string().max(500).optional().allow('')
  });

  return schema.validate(data);
};

// Validation for availability check
exports.availabilityValidation = (data) => {
  const schema = Joi.object({
    lab: Joi.string().required(),
    date: Joi.date().iso().required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
  });

  return schema.validate(data);
};