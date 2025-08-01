const nodemailer = require('nodemailer');
const OTP = require('../models/otpModel'); // Create this if not yet created
const EmailConfig = require('../models/emailConfigModel');
const Student = require('../models/student');

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const emailConfig = await EmailConfig.findOne({ for: 'student' });
    if (!emailConfig) return res.status(500).json({ message: 'Email config missing' });

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.email,
        pass: emailConfig.password,
      },
    });

    await transporter.sendMail({
      from: emailConfig.email,
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });

    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    return res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpDoc = await OTP.findOne({ email });
    if (!otpDoc || otpDoc.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const expiry = new Date(otpDoc.createdAt.getTime() + 5 * 60000); // 5 mins
    if (new Date() > expiry) return res.status(400).json({ message: 'OTP expired' });

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'User not found' });

    student.password = newPassword; // Hash it if needed
    await student.save();

    await OTP.deleteOne({ email }); // cleanup

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(500).json({ message: 'Password reset failed' });
  }
};

module.exports = { sendOtp, resetPassword };
