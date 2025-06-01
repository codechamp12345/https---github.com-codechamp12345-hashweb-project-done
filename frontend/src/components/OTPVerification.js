import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OTPVerification.css';

const OTPVerification = ({ email, onVerificationComplete }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        // Start countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            toast.error('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/verify-otp', {
                email,
                otp: otpString
            });

            if (response.data.success) {
                toast.success('Email verified successfully!');
                onVerificationComplete();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/resend-otp', {
                email
            });

            if (response.data.success) {
                toast.success('New OTP sent successfully');
                setTimeLeft(600);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-verification">
            <h2>Email Verification</h2>
            <p className="instruction">
                Please enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            
            <form onSubmit={handleSubmit}>
                <div className="otp-inputs">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            name={`otp-${index}`}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={loading}
                        />
                    ))}
                </div>

                <div className="timer">
                    Time remaining: {formatTime(timeLeft)}
                </div>

                <button 
                    type="submit" 
                    className="verify-btn"
                    disabled={loading || otp.join('').length !== 6}
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>

                <button
                    type="button"
                    className={`resend-btn ${canResend ? 'active' : ''}`}
                    onClick={handleResendOTP}
                    disabled={!canResend || loading}
                >
                    Resend OTP
                </button>
            </form>
        </div>
    );
};

export default OTPVerification;
