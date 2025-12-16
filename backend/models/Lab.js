const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lab name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Lab name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Lab code is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z0-9]{3,10}$/, 'Lab code must be 3-10 uppercase alphanumeric characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [100, 'Capacity cannot exceed 100']
  },
  equipment: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'out_of_service'],
      default: 'available'
    }
  }],
  facilities: [{
    type: String,
    enum: ['projector', 'whiteboard', 'air_conditioner', 'wifi', 'computers', 'sound_system']
  }],
  location: {
    building: {
      type: String,
      required: true
    },
    floor: {
      type: Number,
      required: true
    },
    room: {
      type: String,
      required: true
    }
  },
  operatingHours: {
    open: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    },
    close: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    }
  },
  images: [{
    url: String,
    alt: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  maintainedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual for checking if lab is available
labSchema.virtual('isAvailable').get(function() {
  return this.isActive && this.equipment.every(eq => eq.status === 'available');
});

// Index for better query performance
labSchema.index({ code: 1 });
labSchema.index({ 'location.building': 1, 'location.floor': 1 });

module.exports = mongoose.model('Lab', labSchema);