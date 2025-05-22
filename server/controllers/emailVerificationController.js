const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Generate secure OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Force TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
    },
    debug: process.env.NODE_ENV === "development",
});

// Test email configuration
const testEmailConfig = async () => {
    try {
        const result = await transporter.verify();
        console.log("SMTP connection verified successfully");
        return true;
    } catch (error) {
        console.error("SMTP verification failed:", error);
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
            subject: "Verify your AstraPix account",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6b46c1;">Welcome to AstraPix!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4c1d95; letter-spacing: 5px;">${otp}</h1>
          <p>Code expires in 10 minutes.</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return true;
    } catch (error) {
        console.error("Email sending failed:", {
            error: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command,
        });
        throw error;
    }
};

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const otp = generateOTP();

        // Store OTP with expiration from env
        otpStore.set(email, {
            otp,
            expiry: Date.now() + parseInt(process.env.OTP_EXPIRE_TIME),
        });

        await sendVerificationEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send OTP",
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found",
            });
        }

        if (Date.now() > storedData.expiry) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Clear OTP after successful verification
        otpStore.delete(email);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const otp = generateOTP();

        // Store new OTP
        otpStore.set(email, {
            otp,
            expiry: Date.now() + 600000,
        });

        await sendVerificationEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "New OTP sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to resend OTP",
        });
    }
};
