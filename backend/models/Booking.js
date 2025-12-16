const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: [true, 'Lab is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Booking title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Booking date cannot be in the past'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
    validate: {
      validator: function(endTime) {
        return endTime > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  participants: {
    type: Number,
    required: [true, 'Number of participants is required'],
    min: [1, 'At least 1 participant is required'],
    validate: {
      validator: async function(participants) {
        const lab = await mongoose.model('Lab').findById(this.lab);
        return participants <= lab.capacity;
      },
      message: 'Number of participants exceeds lab capacity'
    }
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      required: function() { return this.recurring.isRecurring; }
    },
    endDate: {
      type: Date,
      required: function() { return this.recurring.isRecurring; }
    }
  },
  adminNotes: {
    type: String,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent double bookings
bookingSchema.index({ 
  lab: 1, 
  date: 1, 
  startTime: 1, 
  endTime: 1 
});

// Virtual for duration calculation
bookingSchema.virtual('duration').get(function() {
  const start = parseInt(this.startTime.replace(':', ''));
  const end = parseInt(this.endTime.replace(':', ''));
  return end - start;
});

// Pre-save middleware to check for overlapping bookings
bookingSchema.pre('save', async function(next) {
  if (this.isModified('lab') || this.isModified('date') || 
      this.isModified('startTime') || this.isModified('endTime')) {
    
    const overlappingBooking = await mongoose.model('Booking').findOne({
      _id: { $ne: this._id },
      lab: this.lab,
      date: this.date,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { 
          startTime: { $lt: this.endTime }, 
          endTime: { $gt: this.startTime } 
        }
      ]
    });

    if (overlappingBooking) {
      return next(new Error('Time slot overlaps with existing booking'));
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);