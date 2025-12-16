const Booking = require('../models/Booking');
const Lab = require('../models/Lab');
const User = require('../models/User');
const { createNotification } = require('./notificationController');


// @desc    Get all bookings with advanced filtering
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    // Build query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Search functionality
    if (req.query.search) {
      reqQuery.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
      delete reqQuery.search;
    }
    
    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      reqQuery.date = {};
      if (req.query.startDate) {
        reqQuery.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        reqQuery.date.$lte = new Date(req.query.endDate);
      }
    }
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Booking.find(JSON.parse(queryStr))
      .populate('user', 'name email department')
      .populate('lab', 'name code location capacity');
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-date -startTime');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const bookings = await query;
    
    // Get total count for pagination
    const total = await Booking.countDocuments(JSON.parse(queryStr));
    
    // Pagination result
    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.json({
      success: true,
      count: bookings.length,
      pagination,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email department phone')
      .populate('lab', 'name code location capacity facilities operatingHours');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to view this booking
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      lab,
      title,
      description,
      date,
      startTime,
      endTime,
      participants,
      recurring
    } = req.body;
    
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check if lab exists and is active
    const labExists = await Lab.findById(lab);
    if (!labExists || !labExists.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Lab not found or not available'
      });
    }
    
    // Check if participants exceed lab capacity
    if (participants > labExists.capacity) {
      return res.status(400).json({
        success: false,
        message: `Number of participants exceeds lab capacity (${labExists.capacity})`
      });
    }
    
    // Check if booking date is in the past
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book for past dates'
      });
    }
    
    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      lab,
      date: bookingDate,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { 
          startTime: { $lt: endTime }, 
          endTime: { $gt: startTime } 
        }
      ]
    });
    
    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot overlaps with existing booking'
      });
    }
    
    // Check if time is within lab operating hours
    if (startTime < labExists.operatingHours.open || endTime > labExists.operatingHours.close) {
      return res.status(400).json({
        success: false,
        message: `Booking time must be within lab operating hours (${labExists.operatingHours.open} - ${labExists.operatingHours.close})`
      });
    }
    
    // Create booking
    const booking = await Booking.create(req.body);
    
    // Populate the created booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email department')
      .populate('lab', 'name code location');

    // Create notification for user
    await createNotification(
      req.user.id,
      'Booking Created',
      `Your booking "${title}" has been created successfully and is pending approval.`,
      'booking_created',
      {
        relatedTo: { model: 'Booking', id: booking._id },
        actionUrl: `/bookings/${booking._id}`,
        priority: 'medium',
        sendEmail: true,
        booking: populatedBooking.toObject()
      }
    );
    
    // Notify admin users about new booking
    const adminUsers = await User.find({ role: 'admin' }, '_id');
    for (const admin of adminUsers) {
      await createNotification(
        admin._id,
        'New Booking Request',
        `New booking "${title}" has been submitted by ${req.user.name}.`,
        'booking_created',
        {
          relatedTo: { model: 'Booking', id: booking._id },
          actionUrl: `/admin/bookings/${booking._id}`,
          priority: 'medium',
          sendEmail: true
        }
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully and pending approval',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to update this booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }
    
    // Check if booking can be modified
    if (booking.status === 'approved' && booking.date < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify completed or ongoing approved bookings'
      });
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify completed or cancelled bookings'
      });
    }
    
    // If changing time or date, check for conflicts
    if (req.body.date || req.body.startTime || req.body.endTime || req.body.lab) {
      const checkDate = req.body.date ? new Date(req.body.date) : booking.date;
      const checkStartTime = req.body.startTime || booking.startTime;
      const checkEndTime = req.body.endTime || booking.endTime;
      const checkLab = req.body.lab || booking.lab;
      
      const overlappingBooking = await Booking.findOne({
        _id: { $ne: booking._id },
        lab: checkLab,
        date: checkDate,
        status: { $in: ['pending', 'approved'] },
        $or: [
          { 
            startTime: { $lt: checkEndTime }, 
            endTime: { $gt: checkStartTime } 
          }
        ]
      });
      
      if (overlappingBooking) {
        return res.status(400).json({
          success: false,
          message: 'Time slot overlaps with existing booking'
        });
      }
    }
    
    // Update booking
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email department')
     .populate('lab', 'name code location');
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to delete this booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }
    
    // Check if booking can be deleted
    if (booking.status === 'approved' && booking.date < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete completed or ongoing approved bookings'
      });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve booking
// @route   PUT /api/bookings/:id/approve
// @access  Private/Admin
exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('lab', 'name code');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`
      });
    }
    
    // Check for overlapping approved bookings
    const overlappingBooking = await Booking.findOne({
      _id: { $ne: booking._id },
      lab: booking.lab,
      date: booking.date,
      status: 'approved',
      $or: [
        { 
          startTime: { $lt: booking.endTime }, 
          endTime: { $gt: booking.startTime } 
        }
      ]
    });
    
    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot overlaps with existing approved booking'
      });
    }
    
    booking.status = 'approved';
    booking.adminNotes = req.body.adminNotes || 'Booking approved';
    await booking.save();

    // Create notification for user
    await createNotification(
      booking.user._id,
      'Booking Approved ✅',
      `Your booking "${booking.title}" has been approved.`,
      'booking_approved',
      {
        relatedTo: { model: 'Booking', id: booking._id },
        actionUrl: `/bookings/${booking._id}`,
        priority: 'high',
        sendEmail: true,
        booking: booking.toObject()
      }
    );
    
    // Create reminder notification for 1 hour before booking
    const bookingDateTime = new Date(`${booking.date.toDateString()} ${booking.startTime}`);
    const reminderTime = new Date(bookingDateTime.getTime() - (60 * 60 * 1000)); // 1 hour before
    
    await createNotification(
      booking.user._id,
      'Booking Reminder ⏰',
      `Reminder: You have a booking "${booking.title}" starting at ${booking.startTime}.`,
      'booking_reminder',
      {
        relatedTo: { model: 'Booking', id: booking._id },
        actionUrl: `/bookings/${booking._id}`,
        priority: 'medium',
        sendEmail: true,
        expiresAt: reminderTime,
        booking: booking.toObject()
      }
    );
    
    res.json({
      success: true,
      message: 'Booking approved successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private/Admin
exports.rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject booking that is ${booking.status}`
      });
    }
    
    booking.status = 'rejected';
    booking.adminNotes = req.body.adminNotes || 'Booking rejected';
    await booking.save();

    // Create notification for user
    await createNotification(
      booking.user._id,
      'Booking Rejected ❌',
      `Your booking "${booking.title}" has been rejected. Reason: ${req.body.adminNotes || 'No reason provided'}`,
      'booking_rejected',
      {
        relatedTo: { model: 'Booking', id: booking._id },
        actionUrl: `/bookings/${booking._id}`,
        priority: 'medium',
        sendEmail: true,
        booking: booking.toObject()
      }
    );
    
    res.json({
      success: true,
      message: 'Booking rejected successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to cancel this booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`
      });
    }
    
    // Check if it's too late to cancel
    const bookingDateTime = new Date(`${booking.date.toDateString()} ${booking.startTime}`);
    const now = new Date();
    const hoursDifference = (bookingDateTime - now) / (1000 * 60 * 60);
    
    if (hoursDifference < 2 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 2 hours before start time'
      });
    }
    
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.cancellationReason || 'Cancelled by user';
    await booking.save();

    // Create notification
    const notificationUserId = req.user.role === 'admin' ? booking.user._id : req.user.id;
    
    await createNotification(
      notificationUserId,
      'Booking Cancelled',
      `Your booking "${booking.title}" has been cancelled.`,
      'booking_cancelled',
      {
        relatedTo: { model: 'Booking', id: booking._id },
        actionUrl: `/bookings/${booking._id}`,
        priority: 'medium',
        sendEmail: true,
        booking: booking.toObject()
      }
    );
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user/my-bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('lab', 'name code location')
      .sort('-date -startTime');
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for specific lab
// @route   GET /api/bookings/lab/:labId
// @access  Private
exports.getLabBookings = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { lab: req.params.labId };
    
    // Date range filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const bookings = await Booking.find(query)
      .populate('user', 'name email department')
      .sort('date startTime');
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check lab availability
// @route   GET /api/bookings/availability
// @access  Private
exports.checkAvailability = async (req, res, next) => {
  try {
    const { lab, date, startTime, endTime } = req.query;
    
    if (!lab || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide lab, date, startTime, and endTime'
      });
    }
    
    const bookingDate = new Date(date);
    
    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      lab,
      date: bookingDate,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { 
          startTime: { $lt: endTime }, 
          endTime: { $gt: startTime } 
        }
      ]
    }).populate('user', 'name');
    
    const isAvailable = !conflictingBooking;
    
    res.json({
      success: true,
      data: {
        available: isAvailable,
        conflictingBooking: isAvailable ? null : {
          id: conflictingBooking._id,
          title: conflictingBooking.title,
          user: conflictingBooking.user.name,
          startTime: conflictingBooking.startTime,
          endTime: conflictingBooking.endTime
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = {};
    
    // Date range filtering
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }
    
    const stats = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalParticipants: { $sum: '$participants' }
        }
      }
    ]);
    
    // Total bookings count
    const totalBookings = await Booking.countDocuments(matchStage);
    
    // Recent bookings trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const trendStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    
    // Most booked labs
    const popularLabs = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$lab',
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'labs',
          localField: '_id',
          foreignField: '_id',
          as: 'labInfo'
        }
      },
      {
        $unwind: '$labInfo'
      },
      {
        $project: {
          labName: '$labInfo.name',
          labCode: '$labInfo.code',
          bookingCount: 1
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalBookings,
        byStatus: stats,
        trend: trendStats,
        popularLabs
      }
    });
  } catch (error) {
    next(error);
  }
};