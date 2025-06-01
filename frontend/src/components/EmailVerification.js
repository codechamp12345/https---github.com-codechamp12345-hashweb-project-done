import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress
} from "@mui/material";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OTPVerification from './OTPVerification';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/send-otp', 
        { email },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      if (response.data?.success) {
        setShowOTP(true);
        toast.success('OTP sent successfully! Please check your email.');
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to send OTP. Please try again.'
      );
      setShowOTP(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    toast.success('Email verified successfully!');
    navigate('/login');
  };

  if (showOTP) {
    return <OTPVerification email={email} onVerificationComplete={handleVerificationComplete} />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Verify Your Email
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          Enter your email address to receive a verification code
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)',
              }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Sending...</span>
              </Box>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EmailVerification;
