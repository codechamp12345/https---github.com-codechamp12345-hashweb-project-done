import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Home,
  Info,
  Login,
  PersonAdd,
  Close,
  AccountCircle,
  Logout,
  Star,
  CreditScore,
} from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import { logout, setCredentials } from "../redux/slices/authSlice";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
  backdropFilter: "blur(10px)",
  boxShadow: theme.palette.mode === "dark"
    ? "0 6px 40px rgba(255, 255, 255, 0.1)"
    : "0 6px 40px rgba(0, 0, 0, 0.1)",
  borderBottom: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.15)"
  }`,
  color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
  transition: '0.3s ease-in-out',
  padding: theme.spacing(0.5, 0),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  cursor: "pointer",
  userSelect: "none",
  transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
  "& img": {
    height: 40,
    transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
    filter: "drop-shadow(0 2px 8px rgba(33,150,243,0.18))",
  },
  "&:hover": {
    transform: "scale(1.04) rotate(-2deg)",
  },
  "&:hover img": {
    transform: "scale(1.10) rotate(4deg)",
    filter: "drop-shadow(0 6px 18px rgba(33,150,243,0.25))",
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: 20,
  padding: theme.spacing(0.5, 2),
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
  background: "none",
  position: "relative",
  overflow: "hidden",
  fontWeight: 600,
  fontSize: "1.08rem",
  letterSpacing: 0.5,
  transition: "all 0.3s ease",
  textShadow: '0 0 4px rgba(255,255,255,0.5)',
  "&::after": {
    content: '""',
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 6,
    height: 3,
    borderRadius: 2,
    background: theme.palette.mode === "dark"
      ? "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)"
      : "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
    transform: "scaleX(0)",
    transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
    zIndex: 1,
  },
  "&:hover": {
    color: theme.palette.mode === "dark" ? "#00c6ff" : "#4facfe",
    background: "none",
    boxShadow: "none",
    textShadow: theme.palette.mode === "dark"
      ? '0 0 8px rgba(0,198,255,0.8)'
      : '0 0 8px rgba(79,172,254,0.8)',
    "&::after": {
      transform: "scaleX(1)",
    },
  },
  "&.Mui-selected, &.active": {
    color: theme.palette.mode === "dark" ? "#00c6ff" : "#4facfe",
    textShadow: theme.palette.mode === "dark"
      ? '0 0 8px rgba(0,198,255,0.8)'
      : '0 0 8px rgba(79,172,254,0.8)',
    "&::after": {
      transform: "scaleX(1)",
    },
  },
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: "50%",
  border: theme.palette.mode === "dark" ? "2px solid #FFA07A" : "2px solid #FF6347",
  background: theme.palette.mode === "dark"
    ? "linear-gradient(135deg, #232526 0%, #414345 100%)"
    : "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
  boxShadow: theme.palette.mode === "dark"
    ? "0 2px 8px rgba(250,128,114,0.3)"
    : "0 2px 8px rgba(255,99,71,0.3)",
  transition: "all 0.4s cubic-bezier(.4,2,.6,1)",
  "&:hover": {
    boxShadow: theme.palette.mode === "dark"
      ? "0 4px 16px rgba(250,128,114,0.5)"
      : "0 4px 16px rgba(255,99,71,0.5)",
    background: theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #FFA07A 0%, #232526 100%)"
      : "linear-gradient(135deg, #FF6347 0%, #e0eafc 100%)",
  },
  "& svg": {
    transition: "transform 0.6s cubic-bezier(.4,2,.6,1), filter 0.4s cubic-bezier(.4,2,.6,1)",
    transform: theme.palette.mode === "dark" ? "rotate(360deg)" : "rotate(0deg)",
    filter: theme.palette.mode === "dark"
      ? "drop-shadow(0 0 8px #FFA07A)"
      : "drop-shadow(0 0 6px #FF6347)",
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    background:
      theme.palette.mode === "dark"
        ? "rgba(10, 31, 37, 0.95)"
        : "rgba(30, 77, 92, 0.95)",
    backdropFilter: "blur(12px)",
    color: "#ffffff",
    borderLeft: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.2)"
    }`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "-4px 0 30px rgba(0, 0, 0, 0.5)"
        : "-4px 0 30px rgba(0, 0, 0, 0.2)",
    "& .MuiListItemIcon-root": {
      color: "inherit",
      minWidth: 40,
    },
    "& .MuiListItem-root": {
      margin: theme.spacing(0.5, 1),
      borderRadius: theme.spacing(1),
      transition: "all 0.3s ease",
    },
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(10, 31, 37, 0.95)"
        : "rgba(30, 77, 92, 0.95)",
    backdropFilter: "blur(12px)",
    color: "#ffffff",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.2)"
    }`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 30px rgba(0, 0, 0, 0.5)"
        : "0 4px 30px rgba(0, 0, 0, 0.2)",
    "& .MuiListItemIcon-root": {
      color: "inherit",
      minWidth: 40,
    },
    "& .MuiMenuItem-root": {
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
      },
    },
  },
}));

const Navbar = ({ toggleTheme }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [localPoints, setLocalPoints] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // Update points when userInfo changes
  useEffect(() => {
    if (userInfo?.points !== undefined) {
      const points = Number(userInfo.points);
      if (!isNaN(points)) {
        setLocalPoints(points);
      }
    }
  }, [userInfo]);

  // Listen for real-time points updates
  useEffect(() => {
    const handlePointsUpdate = (event) => {
      const newPoints = Number(event.detail.points);
      if (!isNaN(newPoints)) {
        // Update local state
        setLocalPoints(newPoints);
        
        // Update Redux
        const updatedUser = {
          ...userInfo,
          points: newPoints
        };
        dispatch(setCredentials(updatedUser));

        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }
    };

    const handleForceUpdate = () => {
      // Force re-read from localStorage
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const storedPoints = Number(storedUser.points);
      if (!isNaN(storedPoints)) {
        setLocalPoints(storedPoints);
        dispatch(setCredentials(storedUser));
      }
    };

    window.addEventListener('pointsUpdated', handlePointsUpdate);
    document.addEventListener('forcePointsUpdate', handleForceUpdate);

    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdate);
      document.removeEventListener('forcePointsUpdate', handleForceUpdate);
    };
  }, [dispatch, userInfo]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate("/login");
  };

  const navItems = [
    { text: "Home", path: "/", icon: <Home /> },
    { text: "About", path: "/about", icon: <Info /> },
    userInfo && { text: "Earn Credits", path: "/earn-credits", icon: <CreditScore /> },
    !userInfo && { text: "Login", path: "/login", icon: <Login /> },
    !userInfo && { text: "Register", path: "/register", icon: <PersonAdd /> },
  ].filter(Boolean);

  const profileItems = userInfo ? [
    {
      text: userInfo.name || 'User',
      icon: <AccountCircle />,
      action: null
    },
    {
      text: `Points: ${localPoints}`,
      icon: <Star />,
      action: null,
      style: { color: '#FFD700' } // Gold color for points
    },
    {
      text: "Logout",
      icon: <Logout />,
      action: handleLogout
    }
  ] : [];

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <LogoContainer component={Link} to="/" onClick={handleDrawerToggle}>
          <img src="/logo.svg" alt="BrandHash Logo" />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#FFD700" }}
          >
            BrandHash
          </Typography>
        </LogoContainer>
        <IconButton
          color="inherit"
          onClick={handleDrawerToggle}
          sx={{ ml: 2 }}
        >
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.1)" }} />

      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {userInfo && (
          <>
            <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.1)" }} />
            {profileItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={item.action || handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <LogoContainer component={Link} to="/">
            <img src="/logo.svg" alt="BrandHash Logo" />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#FFD700",
                textDecoration: "none",
              }}
            >
              BrandHash
            </Typography>
          </LogoContainer>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {navItems.map((item) => (
                <NavButton
                  key={item.text}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                >
                  {item.text}
                </NavButton>
              ))}
              {userInfo && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 2 }}
                  >
                    <AccountCircle />
                  </IconButton>
                  <StyledMenu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    {profileItems.map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={item.action || handleProfileMenuClose}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </MenuItem>
                    ))}
                  </StyledMenu>
                </>
              )}
            </Box>
          )}

          <ThemeToggle color="inherit" onClick={toggleTheme} sx={{ ml: 2 }}>
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </ThemeToggle>

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </StyledAppBar>
      <Toolbar /> {/* Spacer */}
      {isMobile && (
        <MobileDrawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </MobileDrawer>
      )}
    </>
  );
};

export default Navbar;