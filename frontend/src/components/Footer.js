import { Box, Container, Typography, Grid, IconButton, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Earn Credits", path: "/earn-credits" }
    ],
    Services: [
      { name: "YouTube Growth", path: "/services/youtube" },
      { name: "Community Building", path: "/services/community" },
      { name: "Content Creation", path: "/services/content" }
    ],
    Support: [
      { name: "Help Center", path: "/help" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" }
    ]
  };

  const socialLinks = [
    { icon: <FaFacebook />, url: "https://facebook.com/hashweb" },
    { icon: <FaTwitter />, url: "https://twitter.com/hashweb" },
    { icon: <FaInstagram />, url: "https://instagram.com/hashweb" },
    { icon: <FaYoutube />, url: "https://youtube.com/hashweb" }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        pt: 6,
        pb: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #0077b6 0%, #00a8e8 100%)"
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              HashWeb
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
              Empowering content creators through community engagement and rewards. Join our platform to grow your online presence.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "primary.main",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight="bold">
                {title}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                    <Link
                      to={link.path}
                      style={{
                        color: theme.palette.text.secondary,
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        transition: "color 0.2s",
                        display: "inline-block"
                      }}
                      onMouseOver={(e) => e.target.style.color = theme.palette.primary.main}
                      onMouseOut={(e) => e.target.style.color = theme.palette.text.secondary}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Section */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <MdEmail style={{ marginRight: 8, color: theme.palette.text.secondary }} />
              <Typography 
                component="a"
                href="mailto:brandhashgenius@gmail.com"
                variant="body2" 
                sx={{ 
                  color: "text.secondary",
                  textDecoration: "none",
                  transition: "color 0.2s"
                }}
                onMouseOver={(e) => e.target.style.color = theme.palette.primary.main}
                onMouseOut={(e) => e.target.style.color = theme.palette.text.secondary}
              >
                brandhashgenius@gmail.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: 1,
            borderColor: "divider",
            mt: 6,
            pt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {currentYear} HashWeb. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link
              to="/terms"
              style={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.875rem",
                transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.color = theme.palette.primary.main}
              onMouseOut={(e) => e.target.style.color = theme.palette.text.secondary}
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              style={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.875rem",
                transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.color = theme.palette.primary.main}
              onMouseOut={(e) => e.target.style.color = theme.palette.text.secondary}
            >
              Privacy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
