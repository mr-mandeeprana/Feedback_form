const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail app passwords don't have spaces, but keep as-is
  }
});

async function sendOtpEmail(to, otp) {
  console.log('Attempting to send email to:', to);
  console.log('Using email user:', process.env.EMAIL_USER);
  console.log('App password length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');

  const mailOptions = {
    from: `"Beumer Feedback" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP for Beumer Feedback Form',
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP for the feedback form is: <strong>${otp}</strong></p>`
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('Email sent successfully:', result.messageId);
  return result;
}

const sendEmail = async (to, subject, text, html) => {
  console.log('Attempting to send email to:', to);
  console.log('Using email user:', process.env.EMAIL_USER);
  console.log('App password length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');

  const mailOptions = {
    from: `"Beumer Feedback" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('Email sent successfully:', result.messageId);
  return result;
};

module.exports = { sendOtpEmail, sendEmail };
