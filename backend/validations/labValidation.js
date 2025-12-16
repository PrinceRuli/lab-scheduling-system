const Joi = require('joi');

// Validation for lab creation
exports.createLabValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().trim(),
    code: Joi.string().pattern(/^[A-Z0-9]{3,10}$/).required().uppercase(),
    description: Joi.string().max(500).optional().allow(''),
    capacity: Joi.number().integer().min(1).max(100).required(),
    equipment: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).default(1),
        status: Joi.string().valid('available', 'maintenance', 'out_of_service').default('available')
      })
    ).optional(),
    facilities: Joi.array().items(
      Joi.string().valid(
        'projector', 'whiteboard', 'air_conditioner', 'wifi', 'computers', 'sound_system'
      )
    ).optional(),
    location: Joi.object({
      building: Joi.string().required(),
      floor: Joi.number().integer().required(),
      room: Joi.string().required()
    }).required(),
    operatingHours: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    }).required(),
    maintainedBy: Joi.string().optional()
  });

  return schema.validate(data);
};

// Validation for lab update
exports.updateLabValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).trim(),
    description: Joi.string().max(500).allow(''),
    capacity: Joi.number().integer().min(1).max(100),
    facilities: Joi.array().items(
      Joi.string().valid(
        'projector', 'whiteboard', 'air_conditioner', 'wifi', 'computers', 'sound_system'
      )
    ),
    location: Joi.object({
      building: Joi.string(),
      floor: Joi.number().integer(),
      room: Joi.string()
    }),
    operatingHours: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    }),
    maintainedBy: Joi.string()
  }).min(1);

  return schema.validate(data);
};

// Validation for equipment operations
exports.equipmentValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1),
    status: Joi.string().valid('available', 'maintenance', 'out_of_service').default('available')
  });

  return schema.validate(data);
};

// Validation for available labs query
exports.availableLabsValidation = (data) => {
  const schema = Joi.object({
    date: Joi.date().iso().required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
  });

  return schema.validate(data);
};