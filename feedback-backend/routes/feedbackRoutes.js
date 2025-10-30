// feedback-backend/routes/feedback.js

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { sendOtpEmail } = require('../utils/emailService');

function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

// In-memory OTP store with expiration (5 minutes TTL)
const otpStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) { // 5 minutes
      otpStore.delete(email);
    }
  }
}, 60000); // Clean up every minute

// OTP routes (must come before other routes to avoid conflicts)
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  // Check if Gmail App Password is configured properly
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || !emailUser.includes('gmail.com')) {
    console.error('ERROR: Gmail not properly configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
    return res.status(500).json({ message: 'Email service not configured. Please contact support.' });
  }

  const otp = generateOtp();
  otpStore.set(email, { otp, timestamp: Date.now() });

  try {
    await sendOtpEmail(email, otp);
    console.log(`OTP sent successfully to ${email}: ${otp}`);

    // Send real-time OTP to connected client
    const io = req.app.get('io');
    const connectedClients = req.app.get('connectedClients');
    const socketId = connectedClients.get(email);

    if (socketId) {
      io.to(socketId).emit('otp-received', { otp });
      console.log(`Real-time OTP sent to ${email}: ${otp}`);
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    otpStore.delete(email); // Clean up on failure
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const storedData = otpStore.get(email);
  if (!storedData) {
    return res.json({ success: false, message: 'OTP not found or expired. Please request a new one.' });
  }

  if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
    otpStore.delete(email);
    return res.json({ success: false, message: 'OTP expired. Please request a new one.' });
  }

  if (storedData.otp === otp) {
    otpStore.delete(email);
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.json({ success: false, message: 'Invalid OTP. Please try again.' });
  }
});

// Feedback CRUD routes using controller
router.get('/', feedbackController.getAllFeedback); // GET /api/feedback
router.get('/stats', feedbackController.getFeedbackStats); // GET /api/feedback/stats

// Handle specific ID routes (must come after OTP routes to avoid conflicts)
router.get('/:id', (req, res, next) => {
  // Skip if this is an OTP-related route or other API routes
  if (req.params.id === 'send-otp' || req.params.id === 'verify-otp' ||
      req.params.id === 'stats') {
    return next();
  }
  // Otherwise handle as feedback ID
  feedbackController.getFeedbackById(req, res);
});

router.post('/', feedbackController.createFeedback); // POST /api/feedback
router.delete('/:id', feedbackController.deleteFeedback); // DELETE /api/feedback/:id


module.exports = router;