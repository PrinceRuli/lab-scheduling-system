// User roles
exports.USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Booking statuses
exports.BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Lab equipment status
exports.EQUIPMENT_STATUS = {
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service'
};

// Facilities available in labs
exports.FACILITIES = [
  'projector',
  'whiteboard',
  'air_conditioner',
  'wifi',
  'computers',
  'sound_system'
];

// Recurring booking frequencies
exports.RECURRING_FREQUENCIES = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly'
};

// Default pagination
exports.PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// File upload limits
exports.FILE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_DOC_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

// Time constraints
exports.TIME_CONSTRAINTS = {
  MIN_BOOKING_DURATION: 30, // minutes
  MAX_BOOKING_DURATION: 480, // minutes (8 hours)
  ADVANCE_BOOKING_DAYS: 30, // can book up to 30 days in advance
  CANCELLATION_DEADLINE: 2 // hours before booking
};

// Error messages
exports.ERROR_MESSAGES = {
  UNAUTHORIZED: 'Not authorized to access this resource',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  DUPLICATE_ERROR: 'Duplicate entry found',
  DATABASE_ERROR: 'Database operation failed',
  FILE_UPLOAD_ERROR: 'File upload failed'
};

// Success messages
exports.SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  OPERATION_SUCCESS: 'Operation completed successfully'
};