const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  },
  used: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for email and expiration
otpSchema.index({ email: 1, expiresAt: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index to auto-delete expired docs

module.exports = mongoose.model('Otp', otpSchema);