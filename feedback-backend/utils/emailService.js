const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'me.ranamandeep@gmail.com',
    pass: process.env.EMAIL_PASS || 'lisyoujbkiplqani'
  }
});

transporter.verify((error, success) => {
  if (error) console.error('SMTP error:', error);
  else console.log('SMTP ready');
});

// OTP functionality removed - email service kept for future use if needed

module.exports = {};
