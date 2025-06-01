import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, Email, Phone, Message } from '@mui/icons-material';

const ContactContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
    : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 40, 60, 0.85)' 
    : '#fff',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(5),
  width: '100%',
  maxWidth: 700,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 20px 40px rgba(0, 0, 0, 0.5)'
    : '0 12px 30px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
    : 'linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)',
  color: '#fff',
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 3px 12px rgba(33, 150, 243, 0.3)'
    : '0 3px 12px rgba(25, 118, 210, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)'
      : 'linear-gradient(45deg, #1565C0 30%, #2196F3 90%)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 20px rgba(33, 150, 243, 0.4)'
      : '0 6px 20px rgba(25, 118, 210, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/contact', formData);
      if (response.data.success) {
        toast.success('Thank you! Your message has been sent successfully.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          description: ''
        });
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(
        error.response?.data?.message ||
        'Unable to send message. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContainer maxWidth="lg">
      <ContactCard elevation={3}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 700,
            color: theme => theme.palette.mode === 'dark' ? '#fff' : '#1a237e',
            mb: 4,
            background: theme => theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, #42e695 0%, #3bb2b8 50%, #0072ff 100%)'
              : 'linear-gradient(90deg, #1a237e 0%, #0d47a1 50%, #1565C0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Contact Us
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Message color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledButton
                type="submit"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </StyledButton>
            </Grid>
          </Grid>
        </Box>
      </ContactCard>
    </ContactContainer>
  );
};

export default Contact;