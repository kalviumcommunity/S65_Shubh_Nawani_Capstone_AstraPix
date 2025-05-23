const express = require('express')
const {getUsers, signup, login} = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Keep the original model name

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

router.get("/users", authMiddleware, getUsers)
router.post("/signup", signup)
router.post("/login", login)

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(email, { otp, timestamp: Date.now() });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"AstraPix" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your AstraPix Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6b46c1;">Reset Your Password</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #4c1d95; letter-spacing: 5px; text-align: center; padding: 10px; background-color: #f3f4f6; border-radius: 8px;">${otp}</h1>
          <p style="color: #4b5563;">This code will expire in 10 minutes.</p>
          <p style="color: #4b5563;">If you didn't request this, please ignore this email.</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">AstraPix - AI Image Generation Platform</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reset code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reset code. Please try again.' });
  }
});

router.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData || storedData.otp != otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() - storedData.timestamp > 600000) { // 10 minutes expiry
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    
    
    otpStore.delete(email);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update-username', async (req, res) => {
    try {
      const { email, newUsername } = req.body;
      const user = await User.findOneAndUpdate(
        { email },
        { username: newUsername },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        success: true,
        message: 'Username updated successfully',
        user: {
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating username',
        error: error.message
      });
    }
  });
  

module.exports = router