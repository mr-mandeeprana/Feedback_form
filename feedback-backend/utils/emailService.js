const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

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
  console.log('Using Resend API key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

  try {
    const result = await resend.emails.send({
      from: 'Beumer Feedback <onboarding@resend.dev>', // Use Resend's default sender
      to,
      subject,
      text,
      html
    });

    console.log('Email sent successfully via Resend:', result.data?.id);
    return result;
  } catch (error) {
    console.error('Email sending failed via Resend:', error);
    throw error; // Re-throw so the controller can catch it
  }
};

module.exports = { sendOtpEmail, sendEmail };
