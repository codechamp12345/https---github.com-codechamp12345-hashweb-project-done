import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Grid, useTheme, Divider, List } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import UpdateIcon from '@mui/icons-material/Update';

const GradientFeatureTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #e1bee7 0%, #ce93d8 50%, #e1bee7 100%)'
    : 'linear-gradient(90deg, #8e24aa 0%, #d81b60 50%, #8e24aa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  letterSpacing: 1,
  marginBottom: theme.spacing(2),
  animation: 'gradientFlow 8s ease infinite',
  '@keyframes gradientFlow': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  backgroundSize: '200% auto',
  color: theme.palette.mode === 'dark' ? undefined : theme.palette.text.primary,
}));

const FeatureCard = styled(motion.div)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: '24px',
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
  border: '2px solid transparent',
  transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    animation: 'outlineGlow 1.5s ease-in-out infinite alternate',
  },
  '@keyframes outlineGlow': {
    '0%': { outlineColor: '#FF6B6B' },
    '50%': { outlineColor: '#4ECDC4' },
    '100%': { outlineColor: '#45B7D1' },
  },
}));

const ContactCard = styled(motion.a)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '24px',
  padding: theme.spacing(4),
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' ? '0 12px 30px rgba(255, 255, 255, 0.1)' : '0 12px 30px rgba(0, 0, 0, 0.1)',
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)'
    : 'linear-gradient(135deg, #8e24aa 0%, #d81b60 100%)',
  borderRadius: '20px',
  width: '72px',
  height: '72px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '& svg': {
    fontSize: '36px',
    color: '#ffffff'
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  }
}));

const features = [
  {
    icon: <YouTubeIcon />,
    title: 'Social Media Growth',
    description: 'Boost your YouTube presence through genuine engagement and community support'
  },
  {
    icon: <GroupIcon />,
    title: 'Community Building',
    description: 'Connect with like-minded content creators and grow together'
  },
  {
    icon: <EmojiEventsIcon />,
    title: 'Reward System',
    description: 'Earn points by completing tasks and supporting other creators'
  },
  {
    icon: <UpdateIcon />,
    title: 'Real-time Updates',
    description: 'Instant notifications and points tracking for seamless experience'
  }
];

const AboutUs = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #e0f2f7 0%, #b3e5fc 100%)',
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          pt: 12,
          pb: 12,
          position: 'relative',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                mb: 3,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #e1bee7 0%, #ce93d8 50%, #e1bee7 100%)'
                  : 'linear-gradient(90deg, #8e24aa 0%, #d81b60 50%, #8e24aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                animation: 'gradientFlow 8s ease infinite',
                '@keyframes gradientFlow': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
                backgroundSize: '200% auto',
              }}
            >
              Welcome to HashWeb
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.9,
                fontWeight: 500,
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Empowering content creators through community engagement and rewards
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, mt: -10 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                  transition={{ duration: 0.6, type: 'spring' }}
                >
                  <IconWrapper>{feature.icon}</IconWrapper>
                  <GradientFeatureTitle variant="h6">
                    {feature.title}
                  </GradientFeatureTitle>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.primary,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              Get in Touch
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <ContactCard
                  href="tel:+919582859535"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <IconWrapper>
                    <PhoneIcon />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    +91 95828 59535
                  </Typography>
                </ContactCard>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <ContactCard
                  href="mailto:brandhashgenius@gmail.com"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <IconWrapper>
                    <EmailIcon />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    brandhashgenius@gmail.com
                  </Typography>
                </ContactCard>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <ContactCard
                  href="https://g.co/kgs/YgTaEzR"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <IconWrapper>
                    <LocationOnIcon />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Address
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    Block E, Saket
                    <br />
                    New Delhi - 110017
                  </Typography>
                </ContactCard>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Map Section */}
      <Box sx={{ height: '450px', width: '100%' }}>
        <iframe
          title="HashWeb Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.5726461947253!2d77.21494731507926!3d28.52442798246063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1f1a6cd4c35%3A0x5c6e3f35c9068a8c!2sBlock%20E%2C%20Saket%2C%20New%20Delhi%2C%20Delhi%20110017!5e0!3m2!1sen!2sin!4v1674561234567!5m2!1sen!2sin"
          style={{
            border: 0,
            width: '100%',
            height: '100%'
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
    </Box>
  );
};

export default AboutUs;