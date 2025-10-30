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

async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: '"Beumer Feedback" <me.ranamandeep@gmail.com>',
    to: email,
    subject: "Your OTP for Beumer Feedback Form",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP for the feedback form is: <strong>${otp}</strong></p>`
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent to:', email, 'Result:', result.messageId, result.response);
    return result;
  } catch (err) {
    console.error('Email sending failed:', err);
    throw err;
  }
}

module.exports = { sendOtpEmail };
