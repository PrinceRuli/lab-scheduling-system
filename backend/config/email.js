// backend/config/email.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const emailTemplates = {
    bookingConfirmation: (booking, user) => ({
        subject: `Booking Confirmation - ${booking.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Booking Confirmation</h2>
                <p>Hello ${user.name},</p>
                <p>Your booking has been successfully submitted and is pending approval.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #3498db;">Booking Details:</h3>
                    <p><strong>Title:</strong> ${booking.title}</p>
                    <p><strong>Lab:</strong> ${booking.lab?.name || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
                    <p><strong>Participants:</strong> ${booking.participants}</p>
                    <p><strong>Status:</strong> ${booking.status}</p>
                </div>
                
                <p>You will receive another email once your booking is approved.</p>
                <p>Best regards,<br>Lab Scheduling System</p>
            </div>
        `
    }),
    
    bookingApproved: (booking, user) => ({
        subject: `Booking Approved - ${booking.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #27ae60;">✅ Booking Approved</h2>
                <p>Hello ${user.name},</p>
                <p>Your booking has been approved!</p>
                
                <div style="background: #e8f6f3; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #27ae60;">Approved Booking Details:</h3>
                    <p><strong>Title:</strong> ${booking.title}</p>
                    <p><strong>Lab:</strong> ${booking.lab?.name || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
                    <p><strong>Participants:</strong> ${booking.participants}</p>
                </div>
                
                <p>Please arrive on time and follow lab safety regulations.</p>
                <p>Best regards,<br>Lab Scheduling System</p>
            </div>
        `
    }),
    
    bookingRejected: (booking, user, reason) => ({
        subject: `Booking Rejected - ${booking.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e74c3c;">❌ Booking Rejected</h2>
                <p>Hello ${user.name},</p>
                <p>Your booking request has been rejected.</p>
                
                <div style="background: #fdeaea; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #e74c3c;">Booking Details:</h3>
                    <p><strong>Title:</strong> ${booking.title}</p>
                    <p><strong>Lab:</strong> ${booking.lab?.name || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
                    <p><strong>Reason for Rejection:</strong> ${reason || 'No reason provided'}</p>
                </div>
                
                <p>You may submit a new booking request with adjusted details.</p>
                <p>Best regards,<br>Lab Scheduling System</p>
            </div>
        `
    }),
    
    passwordReset: (user, resetUrl) => ({
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3498db;">Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>You have requested to reset your password. Click the button below to reset it:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>Lab Scheduling System</p>
            </div>
        `
    }),
    
    welcomeEmail: (user) => ({
        subject: 'Welcome to Lab Scheduling System',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Welcome to Lab Scheduling System!</h2>
                <p>Hello ${user.name},</p>
                <p>Your account has been successfully created.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #3498db;">Account Details:</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                </div>
                
                <p>You can now login and start booking labs.</p>
                <p>Best regards,<br>Lab Scheduling System Team</p>
            </div>
        `
    })
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Lab Scheduling System" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendEmail,
    emailTemplates
};