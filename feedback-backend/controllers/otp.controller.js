const Otp = require('../models/Otp');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../utils/emailService');

// Generate and send OTP
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate a 6-digit numeric OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false
    });

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing unused OTPs for this email
    await Otp.deleteMany({ email, used: false });

    // Create new OTP record
    const otpRecord = new Otp({
      email,
      otp,
      expiresAt
    });

    await otpRecord.save();

    // Send OTP via email
    const emailSubject = 'Your OTP for Feedback Form Verification';
    const emailText = `Your OTP is: ${otp}. This OTP will expire in 10 minutes.`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Feedback Form Verification</h2>
        <p>Your OTP for verifying your email is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `;

    console.log(`Generated OTP for ${email}: ${otp}`);
    await sendEmail(email, emailSubject, emailText, emailHtml);
    console.log(`OTP email sent successfully to ${email}`);

    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Controller Error - requestOtp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find valid, unused OTP for this email
    const otpRecord = await Otp.findOne({
      email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Controller Error - verifyOtp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};