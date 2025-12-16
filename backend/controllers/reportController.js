// backend/controllers/reportController.js
const Report = require('../models/Report');
const Booking = require('../models/Booking');
const Lab = require('../models/Lab');
const User = require('../models/User');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// @desc    Generate booking summary report
// @route   POST /api/reports/generate/booking-summary
// @access  Private/Admin
exports.generateBookingSummary = async (req, res, next) => {
    try {
        const { startDate, endDate, labId, format = 'pdf' } = req.body;
        
        // Build filter
        const filter = {
            status: { $in: ['approved', 'completed'] }
        };
        
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        
        if (labId) {
            filter.lab = labId;
        }
        
        // Get bookings with population
        const bookings = await Booking.find(filter)
            .populate('lab', 'name code capacity')
            .populate('user', 'name email department')
            .sort({ date: 1, startTime: 1 });
        
        // Calculate statistics
        const stats = {
            totalBookings: bookings.length,
            totalParticipants: bookings.reduce((sum, b) => sum + (b.participants || 0), 0),
            totalHours: bookings.reduce((sum, b) => {
                const start = parseInt(b.startTime.replace(':', ''));
                const end = parseInt(b.endTime.replace(':', ''));
                return sum + (end - start);
            }, 0),
            byLab: {},
            byUser: {},
            byStatus: {},
            byDay: {}
        };
        
        bookings.forEach(booking => {
            // By lab
            const labName = booking.lab?.name || 'Unknown';
            stats.byLab[labName] = (stats.byLab[labName] || 0) + 1;
            
            // By user
            const userName = booking.user?.name || 'Unknown';
            stats.byUser[userName] = (stats.byUser[userName] || 0) + 1;
            
            // By status
            stats.byStatus[booking.status] = (stats.byStatus[booking.status] || 0) + 1;
            
            // By day
            const day = booking.date.toISOString().split('T')[0];
            stats.byDay[day] = (stats.byDay[day] || 0) + 1;
        });
        
        // Create report record
        const report = new Report({
            title: `Booking Summary Report - ${new Date().toLocaleDateString()}`,
            description: `Booking summary from ${startDate || 'beginning'} to ${endDate || 'now'}`,
            type: 'booking_summary',
            format: format,
            generatedBy: req.user.id,
            parameters: {
                startDate,
                endDate,
                labId
            },
            filters: {
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                lab: labId
            },
            metadata: {
                recordCount: bookings.length,
                fileFormat: format
            }
        });
        
        // Generate file based on format
        let filePath;
        let fileName;
        
        if (format === 'excel') {
            const { path, name } = await generateExcelReport(bookings, stats);
            filePath = path;
            fileName = name;
        } else if (format === 'pdf') {
            const { path, name } = await generatePDFReport(bookings, stats);
            filePath = path;
            fileName = name;
        } else if (format === 'csv') {
            const { path, name } = await generateCSVReport(bookings, stats);
            filePath = path;
            fileName = name;
        } else {
            // JSON format (default)
            filePath = null;
            report.fileUrl = null;
        }
        
        if (filePath) {
            report.fileUrl = `/uploads/reports/${fileName}`;
            report.fileSize = fs.statSync(filePath).size;
        }
        
        report.status = 'completed';
        await report.save();
        
        // Populate generatedBy
        await report.populate('generatedBy', 'name email');
        
        res.json({
            success: true,
            message: 'Report generated successfully',
            data: {
                report,
                preview: {
                    totalBookings: stats.totalBookings,
                    totalParticipants: stats.totalParticipants,
                    totalHours: stats.totalHours
                },
                downloadUrl: report.downloadUrl
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Generate lab utilization report
// @route   POST /api/reports/generate/lab-utilization
// @access  Private/Admin
exports.generateLabUtilization = async (req, res, next) => {
    try {
        const { startDate, endDate, format = 'pdf' } = req.body;
        
        // Get date range
        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date();
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        // Get all labs
        const labs = await Lab.find({ isActive: true });
        
        // Get bookings for each lab
        const labUtilization = [];
        
        for (const lab of labs) {
            const bookings = await Booking.find({
                lab: lab._id,
                date: { $gte: start, $lte: end },
                status: { $in: ['approved', 'completed'] }
            });
            
            // Calculate utilization
            const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            const totalPossibleHours = totalDays * 8; // Assuming 8-hour workday
            let bookedHours = 0;
            
            bookings.forEach(booking => {
                const startHour = parseInt(booking.startTime.split(':')[0]);
                const endHour = parseInt(booking.endTime.split(':')[0]);
                bookedHours += (endHour - startHour);
            });
            
            const utilizationRate = totalPossibleHours > 0 ? 
                (bookedHours / totalPossibleHours) * 100 : 0;
            
            labUtilization.push({
                lab: lab.name,
                labCode: lab.code,
                capacity: lab.capacity,
                totalBookings: bookings.length,
                bookedHours,
                totalPossibleHours,
                utilizationRate: Math.round(utilizationRate * 100) / 100,
                peakHours: calculatePeakHours(bookings)
            });
        }
        
        // Sort by utilization rate
        labUtilization.sort((a, b) => b.utilizationRate - a.utilizationRate);
        
        // Create report
        const report = new Report({
            title: `Lab Utilization Report - ${new Date().toLocaleDateString()}`,
            description: `Lab utilization analysis from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
            type: 'lab_utilization',
            format: format,
            generatedBy: req.user.id,
            parameters: { startDate, endDate },
            filters: {
                startDate: start,
                endDate: end
            },
            metadata: {
                recordCount: labs.length,
                fileFormat: format
            }
        });
        
        // Generate file if needed
        if (format !== 'json') {
            const { path, name } = await generateLabUtilizationFile(labUtilization, format);
            report.fileUrl = `/uploads/reports/${name}`;
            report.fileSize = fs.statSync(path).size;
        }
        
        report.status = 'completed';
        await report.save();
        
        res.json({
            success: true,
            message: 'Lab utilization report generated',
            data: {
                report,
                summary: labUtilization,
                overallUtilization: calculateOverallUtilization(labUtilization)
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get user activity report
// @route   POST /api/reports/generate/user-activity
// @access  Private/Admin
exports.generateUserActivity = async (req, res, next) => {
    try {
        const { startDate, endDate, department, role, format = 'pdf' } = req.body;
        
        // Build user filter
        const userFilter = {};
        if (department) userFilter.department = department;
        if (role) userFilter.role = role;
        
        // Get users with their bookings
        const users = await User.find(userFilter)
            .populate({
                path: 'bookings',
                match: {
                    createdAt: {
                        $gte: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default: last 30 days
                        $lte: endDate ? new Date(endDate) : new Date()
                    }
                },
                select: 'title date status participants'
            })
            .select('name email department role createdAt lastLogin');
        
        // Process user activity
        const userActivity = users.map(user => {
            const bookings = user.bookings || [];
            const approvedBookings = bookings.filter(b => b.status === 'approved');
            const pendingBookings = bookings.filter(b => b.status === 'pending');
            
            return {
                name: user.name,
                email: user.email,
                department: user.department,
                role: user.role,
                totalBookings: bookings.length,
                approvedBookings: approvedBookings.length,
                pendingBookings: pendingBookings.length,
                totalParticipants: bookings.reduce((sum, b) => sum + (b.participants || 0), 0),
                lastActivity: user.lastLogin || user.createdAt,
                bookingFrequency: calculateBookingFrequency(bookings)
            };
        });
        
        // Create report
        const report = new Report({
            title: `User Activity Report - ${new Date().toLocaleDateString()}`,
            description: `User activity analysis${department ? ` for ${department}` : ''}`,
            type: 'user_activity',
            format: format,
            generatedBy: req.user.id,
            parameters: { startDate, endDate, department, role },
            metadata: {
                recordCount: users.length,
                fileFormat: format
            }
        });
        
        if (format !== 'json') {
            const { path, name } = await generateUserActivityFile(userActivity, format);
            report.fileUrl = `/uploads/reports/${name}`;
            report.fileSize = fs.statSync(path).size;
        }
        
        report.status = 'completed';
        await report.save();
        
        res.json({
            success: true,
            message: 'User activity report generated',
            data: {
                report,
                summary: {
                    totalUsers: users.length,
                    totalBookings: userActivity.reduce((sum, u) => sum + u.totalBookings, 0),
                    activeUsers: userActivity.filter(u => u.totalBookings > 0).length
                },
                userActivity
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
    try {
        // Build query
        let query;
        const reqQuery = { ...req.query };
        
        // Remove special fields
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        // Filter by type
        if (req.query.type) {
            reqQuery.type = req.query.type;
        }
        
        // Filter by status
        if (req.query.status) {
            reqQuery.status = req.query.status;
        }
        
        // Date range filtering
        if (req.query.startDate || req.query.endDate) {
            reqQuery.createdAt = {};
            if (req.query.startDate) reqQuery.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) reqQuery.createdAt.$lte = new Date(req.query.endDate);
        }
        
        // Only show reports accessible to user
        if (req.user.role !== 'admin') {
            reqQuery.$or = [
                { generatedBy: req.user.id },
                { accessLevel: { $in: ['department', 'public'] } }
            ];
        }
        
        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        // Finding resource
        query = Report.find(JSON.parse(queryStr))
            .populate('generatedBy', 'name email')
            .populate('filters.lab', 'name code')
            .populate('filters.user', 'name email');
        
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
            query = query.sort('-createdAt');
        }
        
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.page, 10) || 10;
        const startIndex = (page - 1) * limit;
        
        query = query.skip(startIndex).limit(limit);
        
        // Execute query
        const reports = await query;
        
        // Get total count
        const total = await Report.countDocuments(JSON.parse(queryStr));
        
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
            count: reports.length,
            pagination,
            data: reports
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('generatedBy', 'name email')
            .populate('filters.lab', 'name code')
            .populate('filters.user', 'name email');
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }
        
        // Check access
        if (report.generatedBy._id.toString() !== req.user.id && 
            req.user.role !== 'admin' && 
            report.accessLevel === 'private') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this report'
            });
        }
        
        res.json({
            success: true,
            data: report
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Download report file
// @route   GET /api/reports/:id/download
// @access  Private
exports.downloadReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report || !report.fileUrl) {
            return res.status(404).json({
                success: false,
                message: 'Report file not found'
            });
        }
        
        // Check access
        if (report.generatedBy.toString() !== req.user.id && 
            req.user.role !== 'admin' && 
            report.accessLevel === 'private') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download this report'
            });
        }
        
        const filePath = path.join(__dirname, '..', report.fileUrl);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }
        
        // Set headers based on file type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = {
            '.pdf': 'application/pdf',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.csv': 'text/csv',
            '.json': 'application/json'
        }[ext] || 'application/octet-stream';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${report.title}${ext}"`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
    } catch (error) {
        next(error);
    }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
exports.deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }
        
        // Check authorization
        if (req.user.role !== 'admin' && report.generatedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this report'
            });
        }
        
        // Delete file if exists
        if (report.fileUrl) {
            const filePath = path.join(__dirname, '..', report.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await Report.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Report deleted successfully',
            data: {}
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get report statistics
// @route   GET /api/reports/stats
// @access  Private/Admin
exports.getReportStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        let matchStage = {};
        
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }
        
        const stats = await Report.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalSize: { $sum: '$fileSize' },
                    avgProcessingTime: { $avg: '$metadata.processingTime' }
                }
            }
        ]);
        
        // Get format distribution
        const formatStats = await Report.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$format',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get monthly trend
        const monthlyTrend = await Report.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    totalSize: { $sum: '$fileSize' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);
        
        res.json({
            success: true,
            data: {
                byType: stats,
                byFormat: formatStats,
                monthlyTrend,
                totalReports: stats.reduce((sum, s) => sum + s.count, 0),
                totalSize: stats.reduce((sum, s) => sum + (s.totalSize || 0), 0)
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// Helper functions
async function generateExcelReport(bookings, stats) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Booking Summary');
    
    // Add headers
    worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Lab', key: 'lab', width: 20 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'User', key: 'user', width: 25 },
        { header: 'Start Time', key: 'startTime', width: 10 },
        { header: 'End Time', key: 'endTime', width: 10 },
        { header: 'Duration', key: 'duration', width: 10 },
        { header: 'Participants', key: 'participants', width: 12 },
        { header: 'Status', key: 'status', width: 10 }
    ];
    
    // Add data
    bookings.forEach((booking, index) => {
        worksheet.addRow({
            no: index + 1,
            date: booking.date.toLocaleDateString(),
            lab: booking.lab?.name || 'N/A',
            title: booking.title,
            user: booking.user?.name || 'N/A',
            startTime: booking.startTime,
            endTime: booking.endTime,
            duration: booking.duration || 'N/A',
            participants: booking.participants,
            status: booking.status
        });
    });
    
    // Add summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow(['Booking Summary Report']);
    summarySheet.addRow(['Generated on', new Date().toLocaleString()]);
    summarySheet.addRow([]);
    summarySheet.addRow(['Total Bookings', stats.totalBookings]);
    summarySheet.addRow(['Total Participants', stats.totalParticipants]);
    summarySheet.addRow(['Total Hours', stats.totalHours]);
    
    // Save file
    const fileName = `booking-summary-${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    
    await workbook.xlsx.writeFile(filePath);
    
    return { path: filePath, name: fileName };
}

async function generatePDFReport(bookings, stats) {
    const fileName = `booking-summary-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Title
    doc.fontSize(20).text('Booking Summary Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);
    
    // Summary
    doc.fontSize(12).text('Summary Statistics:');
    doc.moveDown();
    doc.fontSize(10).text(`Total Bookings: ${stats.totalBookings}`);
    doc.text(`Total Participants: ${stats.totalParticipants}`);
    doc.text(`Total Hours: ${stats.totalHours}`);
    doc.moveDown(2);
    
    // Table header
    doc.fontSize(10);
    doc.text('Date', 50, doc.y);
    doc.text('Lab', 120, doc.y);
    doc.text('Title', 200, doc.y);
    doc.text('User', 350, doc.y);
    doc.text('Time', 450, doc.y);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    
    // Table rows
    bookings.forEach((booking, index) => {
        if (doc.y > 700) { // New page if near bottom
            doc.addPage();
        }
        
        doc.text(booking.date.toLocaleDateString(), 50, doc.y);
        doc.text(booking.lab?.name || 'N/A', 120, doc.y);
        doc.text(booking.title.substring(0, 20) + '...', 200, doc.y);
        doc.text(booking.user?.name || 'N/A', 350, doc.y);
        doc.text(`${booking.startTime}-${booking.endTime}`, 450, doc.y);
        doc.moveDown();
    });
    
    doc.end();
    
    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve({ path: filePath, name: fileName }));
        stream.on('error', reject);
    });
}

async function generateCSVReport(bookings, stats) {
    const fileName = `booking-summary-${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../uploads/reports', fileName);
    
    const headers = ['Date', 'Lab', 'Title', 'User', 'Start Time', 'End Time', 'Participants', 'Status'];
    const rows = bookings.map(booking => [
        booking.date.toLocaleDateString(),
        booking.lab?.name || 'N/A',
        booking.title,
        booking.user?.name || 'N/A',
        booking.startTime,
        booking.endTime,
        booking.participants,
        booking.status
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    fs.writeFileSync(filePath, csvContent);
    
    return { path: filePath, name: fileName };
}

// Other helper functions
function calculatePeakHours(bookings) {
    const hourCount = {};
    bookings.forEach(booking => {
        const start = parseInt(booking.startTime.split(':')[0]);
        const end = parseInt(booking.endTime.split(':')[0]);
        for (let hour = start; hour < end; hour++) {
            hourCount[hour] = (hourCount[hour] || 0) + 1;
        }
    });
    
    const peakHour = Object.entries(hourCount)
        .sort((a, b) => b[1] - a[1])[0];
    
    return peakHour ? `${peakHour[0]}:00 (${peakHour[1]} bookings)` : 'No data';
}

function calculateOverallUtilization(labUtilization) {
    const totalHours = labUtilization.reduce((sum, lab) => sum + lab.bookedHours, 0);
    const totalPossible = labUtilization.reduce((sum, lab) => sum + lab.totalPossibleHours, 0);
    
    return totalPossible > 0 ? Math.round((totalHours / totalPossible) * 10000) / 100 : 0;
}

function calculateBookingFrequency(bookings) {
    if (bookings.length === 0) return 'None';
    
    const dates = bookings.map(b => b.date.getTime());
    const avgDays = (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24);
    
    if (avgDays <= 0) return 'Daily';
    const frequency = bookings.length / (avgDays || 1);
    
    if (frequency >= 1) return 'Daily';
    if (frequency >= 0.5) return 'Every other day';
    if (frequency >= 0.14) return 'Weekly';
    return 'Monthly or less';
}