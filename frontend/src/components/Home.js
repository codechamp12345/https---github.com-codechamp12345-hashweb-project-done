import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme, useMediaQuery } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Link } from "react-router-dom";
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

// Enhanced animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Enhanced styled components
const Section = styled(Box)(({ theme, variant = "default" }) => ({
  padding: theme.spacing(15, 0),
  position: "relative",
  overflow: "hidden",
  background:
    variant === "primary"
      ? (theme.palette.mode === "dark"
          ? "linear-gradient(-45deg, #0f2027, #2c5364, #232526, #414345)"
          : "linear-gradient(-45deg, #1a237e, #0d47a1, #01579b, #0277bd)")
      : variant === "secondary"
      ? (theme.palette.mode === "dark"
          ? "linear-gradient(-45deg, #232526, #414345, #232526, #232526)"
          : "linear-gradient(-45deg, #311b92, #4527a0, #512da8, #5e35b1)")
      : variant === "accent"
      ? (theme.palette.mode === "dark"
          ? "linear-gradient(-45deg, #232526, #0f2027, #232526, #232526)"
          : "linear-gradient(-45deg, #004d40, #00695c, #00796b, #00897b)")
      : theme.palette.background.default,
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
  color: theme.palette.text.primary,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === "dark"
      ? "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)"
      : "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)",
    pointerEvents: "none",
    opacity: 0.5,
    transition: "opacity 0.3s ease",
  },
  "&:hover::before": {
    opacity: 0.8,
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  padding: theme.spacing(1.5, 0, 15, 0),
  overflow: 'hidden',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
    pointerEvents: 'none',
    opacity: 0.5,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 0.8,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(8, 2),
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    textAlign: "center",
  },
}));

const TextContent = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingRight: theme.spacing(4),
  animation: `${slideInLeft} 1s ease-out`,
  [theme.breakpoints.down("md")]: {
    paddingRight: 0,
    marginBottom: theme.spacing(4),
  },
}));

const ImageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  animation: `${slideInRight} 1s ease-out`,
  "& img": {
    maxWidth: "100%",
    height: "auto",
    animation: `${floatAnimation} 3s ease-in-out infinite`,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #0072ff 0%, #42e695 100%)',
  color: '#fff',
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 16px rgba(66,230,149,0.08)',
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    background: 'linear-gradient(90deg, #42e695 0%, #0072ff 100%)',
    color: '#fff',
    transform: 'translateY(-2px) scale(1.04)',
    boxShadow: '0 8px 24px rgba(0,114,255,0.18)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease-in-out',
    zIndex: 0,
  },
  zIndex: 1,
}));

const OutlinedGradientButton = styled(Button)(({ theme }) => ({
  color: '#0072ff',
  border: '2px solid #42e695',
  background: 'transparent',
  fontWeight: 700,
  fontSize: '1.1rem',
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(90deg, #42e695 0%, #0072ff 100%)',
    color: '#fff',
    border: '2px solid #0072ff',
    boxShadow: '0 8px 24px rgba(0,114,255,0.18)',
    transform: 'translateY(-2px) scale(1.04)',
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  minWidth: 280,
  maxWidth: 340,
  minHeight: 340,
  height: 340,
  background: "rgba(255,255,255,0)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
  padding: theme.spacing(4, 3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
  animation: `${fadeIn} 0.5s ease-out`,
  border: `1.5px solid rgba(255,255,255,0.10)`,
  backdropFilter: "blur(0.5px)",
  '&:hover': {
    transform: "translateY(-10px) scale(1.03)",
    boxShadow: "0 12px 32px 0 rgba(33,150,243,0.18)",
    '& .feature-icon': {
      animation: `${pulseAnimation} 1s ease-in-out infinite`,
    },
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: 260,
    height: 'auto',
    marginBottom: theme.spacing(3),
  },
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.6rem",
  marginBottom: theme.spacing(2),
  background: "linear-gradient(90deg, #42e695 0%, #3bb2b8 50%, #0072ff 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textFillColor: "transparent",
  letterSpacing: 1,
}));

// Add typewriter effect and gradient to hero headline
const TypewriterGradient = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
  fontWeight: 700,
  mb: 3,
  background: 'linear-gradient(90deg, #ff0000 0%, #0000ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  letterSpacing: 1,
  minHeight: '4.5rem',
  display: 'inline-block',
  whiteSpace: 'pre',
  animation: `${fadeIn} 1s ease-out`,
}));

// Add GradientSectionTitle styled component
const GradientSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.2rem',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #42e695 0%, #3bb2b8 50%, #00c6fb 100%)'
    : 'linear-gradient(90deg, #0072ff 0%, #42e695 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  letterSpacing: 1,
  textAlign: 'center',
  marginBottom: theme.spacing(8),
}));

// Add GradientCTA styled component
const GradientCTA = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.1rem',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #42e695 0%, #3bb2b8 50%, #00c6fb 100%)'
    : 'linear-gradient(90deg, #0072ff 0%, #42e695 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  letterSpacing: 1,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

// SVG Components
const GeoTargetingSvg = () => (
  <svg width="200" height="150" viewBox="0 0 200 150">
    <path
      d="M100 20c-22 0-40 18-40 40 0 30 40 70 40 70s40-40 40-70c0-22-18-40-40-40zm0 54c-7.7 0-14-6.3-14-14s6.3-14 14-14 14 6.3 14 14-6.3 14-14 14z"
      fill="#FF4081"
    />
    <path
      d="M160 75c0 33.1-60 75-60 75s-60-41.9-60-75a60 60 0 1 1 120 0"
      fill="none"
      stroke="#3F51B5"
      strokeWidth="2"
    />
    <circle cx="100" cy="60" r="10" fill="#FFF" />
  </svg>
);

const SecuritySvg = () => (
  <svg width="200" height="150" viewBox="0 0 200 150">
    <path
      d="M100 20l60 30v30c0 27.6-25.6 54.5-60 60-34.4-5.5-60-32.4-60-60V50l60-30z"
      fill="#4CAF50"
      opacity="0.2"
    />
    <path
      d="M100 25l50 25v25c0 23-21.3 45.4-50 50-28.7-4.6-50-27-50-50V50l50-25z"
      fill="#4CAF50"
    />
    <path d="M90 65l-15 15-5-5-10 10 15 15 25-25-10-10z" fill="#FFF" />
  </svg>
);

const BonusesSvg = () => (
  <svg width="200" height="150" viewBox="0 0 200 150">
    {/* Background */}
    <circle cx="100" cy="75" r="65" fill="#E3F2FD" />

    {/* Trophy Body */}
    <path
      d="
      M70,45 h60 v10
      q0,25 -20,40
      h-20
      q-20,-15 -20,-40
      v-10
      Z
    "
      fill="#FFC107"
      stroke="#FFA000"
      strokeWidth="2"
    />

    {/* Trophy Cup */}
    <path
      d="
      M85,45 h30 v-10 h-30 v10
    "
      fill="#FFC107"
      stroke="#FFA000"
      strokeWidth="2"
    />

    {/* Trophy Base */}
    <path
      d="
      M90,95 h20 l5,15 h-30 l5,-15
    "
      fill="#FFA000"
    />
    <rect x="80" y="110" width="40" height="5" fill="#FFA000" />

    {/* Stars */}
    <path
      d="M40,60 l6,0 l2,-6 l2,6 l6,0 l-5,4 l2,6 l-5,-3 l-5,3 l2,-6 z"
      fill="#FFD700"
    />
    <path
      d="M150,60 l6,0 l2,-6 l2,6 l6,0 l-5,4 l2,6 l-5,-3 l-5,3 l2,-6 z"
      fill="#FFD700"
    />

    {/* Bonus Text */}
    <text
      x="100"
      y="70"
      fontSize="20"
      fill="#D50000"
      textAnchor="middle"
      fontWeight="bold"
    >
      100
    </text>
    <text
      x="100"
      y="130"
      fontSize="14"
      fill="#1565C0"
      textAnchor="middle"
      fontWeight="bold"
    >
      BONUS
    </text>
  </svg>
);

const ReferAndEarnSvg = () => (
  <svg width="250" height="200" viewBox="0 0 250 200">
    {/* Animated gradient background */}
    <defs>
      <linearGradient id="referGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B">
          <animate
            attributeName="stop-color"
            values="#FF6B6B; #4ECDC4; #45B7D1; #FF6B6B"
            dur="4s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="#4ECDC4">
          <animate
            attributeName="stop-color"
            values="#4ECDC4; #45B7D1; #FF6B6B; #4ECDC4"
            dur="4s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>

    {/* Main circle with gradient */}
    <circle cx="125" cy="100" r="80" fill="url(#referGradient)" opacity="0.1" />

    {/* Connection lines */}
    <path
      d="M125 60 L85 100 L125 140"
      stroke="#FF6B6B"
      strokeWidth="3"
      fill="none"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0,1000;200,0"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M125 60 L165 100 L125 140"
      stroke="#4ECDC4"
      strokeWidth="3"
      fill="none"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0,1000;200,0"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>

    {/* People icons */}
    <circle cx="125" cy="60" r="15" fill="#FF6B6B" />
    <circle cx="85" cy="100" r="15" fill="#4ECDC4" />
    <circle cx="165" cy="100" r="15" fill="#4ECDC4" />
    <circle cx="125" cy="140" r="15" fill="#FF6B6B" />

    {/* Sparkles */}
    <g>
      <circle cx="145" cy="40" r="3" fill="#FFD700">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
      <circle cx="65" cy="120" r="3" fill="#FFD700">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>
      <circle cx="185" cy="120" r="3" fill="#FFD700">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="1s"
        />
      </circle>
    </g>

    {/* Coin symbols */}
    <text x="120" y="65" fontSize="12" fill="#FFF" fontWeight="bold">
      $
    </text>
    <text x="80" y="105" fontSize="12" fill="#FFF" fontWeight="bold">
      $
    </text>
    <text x="160" y="105" fontSize="12" fill="#FFF" fontWeight="bold">
      $
    </text>
    <text x="120" y="145" fontSize="12" fill="#FFF" fontWeight="bold">
      $
    </text>
  </svg>
);

const services = [
  {
    name: 'YouTube',
    icon: <YouTubeIcon sx={{ fontSize: 40, color: '#FF0000' }} />,
    gradient: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
    tasks: ['Like videos', 'Subscribe channels', 'Watch videos'],
  },
  {
    name: 'Instagram',
    icon: <InstagramIcon sx={{ fontSize: 40, color: '#E1306C' }} />,
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%)',
    tasks: ['Follow accounts', 'Like posts', 'Comment'],
  },
  {
    name: 'Facebook',
    icon: <FacebookIcon sx={{ fontSize: 40, color: '#1877F3' }} />,
    gradient: 'linear-gradient(135deg, #1877F3 0%, #00c6fb 100%)',
    tasks: ['Like pages', 'Share posts', 'Join groups'],
  },
  {
    name: 'Twitter',
    icon: <TwitterIcon sx={{ fontSize: 40, color: '#1DA1F2' }} />,
    gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0a8dcd 100%)',
    tasks: ['Follow accounts', 'Retweet', 'Like tweets'],
  },
  {
    name: 'LinkedIn',
    icon: <LinkedInIcon sx={{ fontSize: 40, color: '#0077b5' }} />,
    gradient: 'linear-gradient(135deg, #0077b5 0%, #00c6fb 100%)',
    tasks: ['Connect', 'Like posts', 'Endorse skills'],
  },
  {
    name: 'More',
    icon: <PlayCircleFilledIcon sx={{ fontSize: 40, color: '#42e695' }} />,
    gradient: 'linear-gradient(135deg, #42e695 0%, #3bb2b8 100%)',
    tasks: ['More platforms coming soon!'],
  },
];

const ServiceCard = styled(Box)(({ theme, gradient }) => ({
  minWidth: 240,
  maxWidth: 260,
  height: 210,
  background: gradient,
  borderRadius: theme.spacing(3),
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(3),
  padding: theme.spacing(3, 2),
  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.04)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
}));

// Add IconCircle for icon backgrounds
const IconCircle = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  borderRadius: '50%',
  width: 56,
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  margin: '0 auto',
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Transform Your Business with Social Media Marketing";
  const sliderRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    let scrollAmount = 0;
    const scrollStep = 1.2; // px per frame
    let req;
    function autoScroll() {
      if (slider.scrollWidth - slider.clientWidth - slider.scrollLeft <= 1) {
        slider.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        slider.scrollLeft += scrollStep;
        scrollAmount += scrollStep;
      }
      req = requestAnimationFrame(autoScroll);
    }
    req = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(req);
  }, []);

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <ContentWrapper>
            <TextContent sx={{
              maxWidth: { xs: '100%', md: 600 },
              textAlign: { xs: 'center', md: 'left' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
            }}>
              <TypewriterGradient
                variant="h1"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.1,
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem', lg: '3.5rem' },
                  maxWidth: 520,
                  minHeight: 'unset',
                  wordBreak: 'break-word',
                }}
              >
                {typedText.split(' ').length > 0
                  ? `${typedText.split(' ').slice(0,2).join(' ')}\n${typedText.split(' ').slice(2,5).join(' ')}\n${typedText.split(' ').slice(5).join(' ')}`
                  : typedText}
              </TypewriterGradient>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  maxWidth: "600px",
                  animation: `${fadeIn} 1s ease-out 0.2s both`,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #ffffff 0%, #cccccc 100%)'
                    : 'linear-gradient(90deg, #333333 0%, #666666 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  fontWeight: 500,
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Create, send, and track professional email campaigns that help you build relationships and grow your business. Our platform makes it easy to reach your audience and drive results.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  animation: `${fadeIn} 1s ease-out 0.4s both`,
                }}
              >
                <StyledButton
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                >
                  Start Free Trial
                </StyledButton>
                <OutlinedGradientButton
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                >
                  Sign In
                </OutlinedGradientButton>
              </Box>
            </TextContent>
            <ImageContent>
              <img
                src="/social-media-illustration.svg"
                alt="Social Media Illustration"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))",
                }}
              />
            </ImageContent>
          </ContentWrapper>
        </Container>
      </HeroSection>

      <Section variant="default">
        <Container maxWidth="lg">
          <GradientSectionTitle
            variant="h2"
            sx={{ animation: `${fadeIn} 1s ease-out` }}
          >
            Everything you need to grow your business
          </GradientSectionTitle>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={12}>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <FeatureCard>
                    <Box sx={{ mb: 2 }} className="feature-icon">
                      <GeoTargetingSvg />
                    </Box>
                    <GradientTitle variant="h5">
                      Smart Targeting
                    </GradientTitle>
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, textAlign: 'center' }}>
                      Reach the right audience with our advanced targeting tools and segmentation features. Drive better engagement and higher conversion rates.
                    </Typography>
                  </FeatureCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FeatureCard>
                    <Box sx={{ mb: 2 }} className="feature-icon">
                      <SecuritySvg />
                    </Box>
                    <GradientTitle variant="h5">
                      Enterprise Security
                    </GradientTitle>
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, textAlign: 'center' }}>
                      Your data is protected with enterprise-grade security and 99.9% uptime guarantee. We take your privacy seriously.
                    </Typography>
                  </FeatureCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FeatureCard>
                    <Box sx={{ mb: 2 }} className="feature-icon">
                      <BonusesSvg />
                    </Box>
                    <GradientTitle variant="h5">
                      Earn Rewards
                    </GradientTitle>
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, textAlign: 'center' }}>
                      Get rewarded for your engagement with our credit system and referral program. Grow your business while earning.
                    </Typography>
                  </FeatureCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Section>

      <Section variant="primary">
        <Container maxWidth="md">
          <Box 
            textAlign="center" 
            sx={{
              pt: 5,
              pb: 8,
              animation: `${fadeIn} 1s ease-out`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GradientCTA variant="h3">
              Ready to transform your business?
            </GradientCTA>
            <Typography
              variant="h6"
              sx={{
                mb: 6,
                color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                fontWeight: 500,
                maxWidth: 540,
                textAlign: 'center',
                textShadow: theme => theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.08)',
                margin: '0 auto',
              }}
            >
              Join thousands of successful businesses already using our platform
            </Typography>
            <Box
              ref={sliderRef}
              sx={{
                width: '100%',
                maxWidth: 1100,
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'row',
                gap: 3,
                py: 3,
                mb: 2,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  height: 8,
                  background: 'rgba(0,0,0,0.08)',
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(66,230,149,0.3)',
                  borderRadius: 4,
                },
              }}
            >
              {services.map((service, idx) => (
                <ServiceCard key={service.name} gradient={service.gradient}>
                  <IconCircle>
                    {service.icon}
                  </IconCircle>
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, letterSpacing: 0.5 }}>
                    {service.name}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {service.tasks.map((task, i) => (
                      <Typography key={i} variant="body2" sx={{ color: '#fff', opacity: 0.92, fontWeight: 400 }}>
                        {task}
                      </Typography>
                    ))}
                  </Box>
                </ServiceCard>
              ))}
            </Box>
          </Box>
        </Container>
      </Section>
    </Box>
  );
};

export default Home;