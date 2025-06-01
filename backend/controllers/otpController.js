import User from '../models/user.model.js';
import { sendOTPEmail } from '../utils/emailService.js';

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate new OTP and set expiry (10 minutes)
        const otp = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        // Save OTP to user document
        user.otp = {
            code: otp,
            expiresAt
        };
        await user.save();

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if OTP exists and is valid
        if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new one'
            });
        }

        // Check if OTP has expired
        if (new Date() > new Date(user.otp.expiresAt)) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }

        // Verify OTP
        if (user.otp.code !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Resend OTP
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate new OTP and set expiry (10 minutes)
        const otp = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        // Save new OTP
        user.otp = {
            code: otp,
            expiresAt
        };
        await user.save();

        // Send new OTP email
        const emailSent = await sendOTPEmail(email, otp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email'
            });
        }

        res.status(200).json({
            success: true,
            message: 'New OTP sent successfully'
        });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
