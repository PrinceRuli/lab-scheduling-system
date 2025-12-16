const crypto = require('crypto');

// Generate random string
exports.generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format date to readable string
exports.formatDate = (date, includeTime = true) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Date(date).toLocaleDateString('en-US', options);
};

// Calculate duration between two times
exports.calculateDuration = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  
  const durationMinutes = endTotal - startTotal;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return { hours, minutes, totalMinutes: durationMinutes };
};

// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Generate booking code
exports.generateBookingCode = (labCode, date) => {
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${labCode}-${dateStr}-${random}`;
};

// Pagination helper
exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  
  return { limit, offset };
};

// Response formatter
exports.formatResponse = (success, message, data = null, meta = null) => {
  return {
    success,
    message,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString()
  };
};