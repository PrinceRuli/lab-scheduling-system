const Lab = require('../models/Lab');
const Booking = require('../models/Booking');

// @desc    Get all labs with advanced filtering
// @route   GET /api/labs
// @access  Private
exports.getLabs = async (req, res, next) => {
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
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
      delete reqQuery.search;
    }
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Lab.find(JSON.parse(queryStr));
    
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
      query = query.sort('name');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const labs = await query.populate('maintainedBy', 'name email');
    
    // Get total count for pagination
    const total = await Lab.countDocuments(JSON.parse(queryStr));
    
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
      count: labs.length,
      pagination,
      data: labs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lab
// @route   GET /api/labs/:id
// @access  Private
exports.getLab = async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params.id).populate('maintainedBy', 'name email department');
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    // Get lab booking statistics
    const bookingStats = await Booking.aggregate([
      {
        $match: { lab: lab._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      lab: lab._id,
      date: { $gte: new Date() },
      status: 'approved'
    })
    .populate('user', 'name email')
    .sort('date startTime')
    .limit(5);
    
    const labWithStats = {
      ...lab.toObject(),
      bookingStats,
      upcomingBookings
    };
    
    res.json({
      success: true,
      data: labWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create lab
// @route   POST /api/labs
// @access  Private/Admin
exports.createLab = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      capacity,
      equipment,
      facilities,
      location,
      operatingHours,
      maintainedBy
    } = req.body;
    
    // Check if lab code already exists
    const existingLab = await Lab.findOne({ code });
    if (existingLab) {
      return res.status(400).json({
        success: false,
        message: 'Lab with this code already exists'
      });
    }
    
    const lab = await Lab.create({
      name,
      code: code.toUpperCase(),
      description,
      capacity,
      equipment: equipment || [],
      facilities: facilities || [],
      location,
      operatingHours,
      maintainedBy: maintainedBy || req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Lab created successfully',
      data: lab
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lab
// @route   PUT /api/labs/:id
// @access  Private/Admin
exports.updateLab = async (req, res, next) => {
  try {
    const {
      name,
      description,
      capacity,
      facilities,
      location,
      operatingHours,
      maintainedBy
    } = req.body;
    
    const fieldsToUpdate = {
      name,
      description,
      capacity,
      facilities,
      location,
      operatingHours,
      maintainedBy
    };
    
    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );
    
    const lab = await Lab.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Lab updated successfully',
      data: lab
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lab
// @route   DELETE /api/labs/:id
// @access  Private/Admin
exports.deleteLab = async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params.id);
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    // Check if lab has future bookings
    const futureBookings = await Booking.findOne({
      lab: req.params.id,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'approved'] }
    });
    
    if (futureBookings) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete lab with future bookings'
      });
    }
    
    await Lab.findByIdAndDelete(req.params.id);
    
    // Cancel all pending bookings for this lab
    await Booking.updateMany(
      {
        lab: req.params.id,
        status: 'pending'
      },
      {
        status: 'cancelled',
        cancellationReason: 'Lab deleted'
      }
    );
    
    res.json({
      success: true,
      message: 'Lab deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available labs for a specific date and time
// @route   GET /api/labs/available
// @access  Public
exports.getAvailableLabs = async (req, res, next) => {
  try {
    const { date, startTime, endTime } = req.query;
    
    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, startTime, and endTime'
      });
    }
    
    // Convert date to proper format
    const bookingDate = new Date(date);
    
    // Find all active labs
    const allLabs = await Lab.find({ isActive: true });
    
    // Find conflicting bookings
    const conflictingBookings = await Booking.find({
      date: bookingDate,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { 
          startTime: { $lt: endTime }, 
          endTime: { $gt: startTime } 
        }
      ]
    });
    
    // Get lab IDs that are booked
    const bookedLabIds = conflictingBookings.map(booking => booking.lab.toString());
    
    // Filter available labs
    const availableLabs = allLabs.filter(lab => 
      !bookedLabIds.includes(lab._id.toString())
    );
    
    res.json({
      success: true,
      count: availableLabs.length,
      data: availableLabs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lab status (active/inactive)
// @route   PUT /api/labs/:id/status
// @access  Private/Admin
exports.updateLabStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    const lab = await Lab.findByIdAndUpdate(
      req.params.id,
      { isActive },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    if (!isActive) {
      // Cancel all future pending bookings if lab is deactivated
      await Booking.updateMany(
        {
          lab: req.params.id,
          date: { $gte: new Date() },
          status: 'pending'
        },
        {
          status: 'cancelled',
          cancellationReason: 'Lab temporarily unavailable'
        }
      );
    }
    
    res.json({
      success: true,
      message: `Lab ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: lab
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lab statistics
// @route   GET /api/labs/stats
// @access  Public
exports.getLabStats = async (req, res, next) => {
  try {
    const totalLabs = await Lab.countDocuments();
    const activeLabs = await Lab.countDocuments({ isActive: true });
    
    // Get labs with equipment status
    const equipmentStats = await Lab.aggregate([
      {
        $unwind: '$equipment'
      },
      {
        $group: {
          _id: '$equipment.status',
          count: { $sum: 1 },
          labs: { $addToSet: '$_id' }
        }
      }
    ]);
    
    // Get booking statistics by lab
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: '$lab',
          totalBookings: { $sum: 1 },
          approvedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          }
        }
      },
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
          totalBookings: 1,
          approvedBookings: 1,
          utilizationRate: {
            $round: [
              { $multiply: [{ $divide: ['$approvedBookings', '$totalBookings'] }, 100] },
              2
            ]
          }
        }
      },
      {
        $sort: { utilizationRate: -1 }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalLabs,
        active: activeLabs,
        inactive: totalLabs - activeLabs,
        equipmentStats,
        utilization: bookingStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add equipment to lab
// @route   POST /api/labs/:id/equipment
// @access  Private/Admin
exports.addLabEquipment = async (req, res, next) => {
  try {
    const { name, quantity, status } = req.body;
    
    const lab = await Lab.findById(req.params.id);
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    // Check if equipment already exists
    const existingEquipment = lab.equipment.find(
      eq => eq.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingEquipment) {
      return res.status(400).json({
        success: false,
        message: 'Equipment with this name already exists in the lab'
      });
    }
    
    lab.equipment.push({
      name,
      quantity: quantity || 1,
      status: status || 'available'
    });
    
    await lab.save();
    
    res.json({
      success: true,
      message: 'Equipment added successfully',
      data: lab
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lab equipment
// @route   PUT /api/labs/:id/equipment
// @access  Private/Admin
exports.updateLabEquipment = async (req, res, next) => {
  try {
    const { equipmentId, name, quantity, status } = req.body;
    
    const lab = await Lab.findById(req.params.id);
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    const equipment = lab.equipment.id(equipmentId);
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }
    
    if (name) equipment.name = name;
    if (quantity) equipment.quantity = quantity;
    if (status) equipment.status = status;
    
    await lab.save();
    
    res.json({
      success: true,
      message: 'Equipment updated successfully',
      data: lab
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove equipment from lab
// @route   DELETE /api/labs/:id/equipment/:equipmentId
// @access  Private/Admin
exports.removeLabEquipment = async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params.id);
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    lab.equipment.pull(req.params.equipmentId);
    await lab.save();
    
    res.json({
      success: true,
      message: 'Equipment removed successfully',
      data: lab
    });
  } catch (error) {
    next(error);
  }
};