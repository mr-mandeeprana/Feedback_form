const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

// Rate limiting middleware (simple in-memory implementation)
const otpRequests = new Map();

function rateLimit(req, res, next) {
  const email = req.body.email;
  if (!email) return next();

  const now = Date.now();
  const windowStart = now - (15 * 60 * 1000); // 15 minutes window

  if (!otpRequests.has(email)) {
    otpRequests.set(email, []);
  }

  const requests = otpRequests.get(email);
  // Remove requests outside the window
  const recentRequests = requests.filter(time => time > windowStart);

  if (recentRequests.length >= 3) {
    return res.status(429).json({
      success: false,
      message: 'Too many OTP requests. Please try again later.'
    });
  }

  recentRequests.push(now);
  otpRequests.set(email, recentRequests);

  next();
}

// Request OTP endpoint
router.post('/request', rateLimit, otpController.requestOtp);

// Verify OTP endpoint
router.post('/verify', otpController.verifyOtp);

module.exports = router;