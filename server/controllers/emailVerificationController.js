const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Generate secure OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Force TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2"
  },
  debug: process.env.NODE_ENV === 'development'
});

// Test email configuration
const testEmailConfig = async () => {
  try {
    const result = await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP verification failed:', error);
    return false;
  }
};

// Call the test immediately
testEmailConfig();

const sendVerificationEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"AstraPix" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your AstraPix account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6b46c1;">Welcome to AstraPix!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4c1d95; letter-spacing: 5px;">${otp}</h1>
          <p>Code expires in 10 minutes.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};

const sendForgotPasswordEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"AstraPix" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - AstraPix',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6b46c1;">Reset Your Password</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #4c1d95; letter-spacing: 5px;">${otp}</h1>
          <p>Code expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Password reset email failed:', error);
    throw error;
  }
};

const debugOtpStore = () => {
  console.log('Current OTP Store State:', {
    size: otpStore.size,
    entries: Array.from(otpStore.entries()).map(([email, data]) => ({
      email,
      otp: data.otp,
      type: data.type,
      expiry: new Date(data.expiry).toISOString()
    }))
  });
};

exports.sendOTP = async (req, res) => {
  try {
    const { email, type = 'verification' } = req.body;
    console.log('Sending OTP Request:', { email, type });
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Different validation for verification vs forgot password
    if (type === 'verification') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }
    } else if (type === 'forgot-password') {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email'
        });
      }
    }

    const otp = generateOTP();
    console.log('Generated new OTP:', { email, otp });

    // Clear any existing OTP for this email
    if (otpStore.has(email)) {
      console.log('Clearing existing OTP for:', email);
      otpStore.delete(email);
    }

    const otpData = {
      otp: otp.toString(), // Ensure OTP is stored as string
      expiry: Date.now() + parseInt(process.env.OTP_EXPIRE_TIME || '600000'),
      type: type
    };

    // Store new OTP data
    otpStore.set(email, otpData);
    console.log('Stored new OTP data:', { email, ...otpData });

    // Verify storage
    const verification = otpStore.get(email);
    console.log('Storage verification:', {
      email,
      stored: !!verification,
      data: verification
    });

    debugOtpStore();

    // Send appropriate email
    if (type === 'forgot-password') {
      await sendForgotPasswordEmail(email, otp);
    } else {
      await sendVerificationEmail(email, otp);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, newPassword, type = 'verification' } = req.body;
    console.log('Verify OTP Request:', { email, otp, type });

    debugOtpStore();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const storedData = otpStore.get(email);
    console.log('OTP Verification Check:', {
      email,
      providedOtp: otp,
      storedData: storedData,
      matches: storedData?.otp === otp
    });

    // Dump entire OTP store for debugging
    console.log('Current OTP Store:', {
      size: otpStore.size,
      keys: Array.from(otpStore.keys()),
      hasEmail: otpStore.has(email)
    });

    // Detailed logging
    console.log('Stored OTP data for email:', email, storedData);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    console.log('Stored OTP data:', {
      exists: !!storedData,
      storedOtp: storedData?.otp,
      storedType: storedData?.type,
      isExpired: storedData ? Date.now() > storedData.expiry : true,
      receivedOtp: otp
    });

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this email'
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStore.delete(email); // Clean up expired OTP
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP type matches
    if (storedData.type !== type) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP type'
      });
    }

    // Compare OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Handle password reset
    if (type === 'forgot-password') {
      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password is required'
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      user.password = newPassword;
      await user.save();
    }

    // Clear OTP after successful verification
    otpStore.delete(email);
    console.log('OTP verified successfully for:', email);

    res.status(200).json({
      success: true,
      message: type === 'forgot-password' ? 'Password updated successfully' : 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Verification failed'
    });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email, type = 'verification' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const otp = generateOTP();
    
    const otpData = {
      otp: otp.toString(),
      expiry: Date.now() + parseInt(process.env.OTP_EXPIRE_TIME || '600000'),
      type: type
    };

    otpStore.set(email, otpData);
    debugOtpStore();

    await sendVerificationEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};
