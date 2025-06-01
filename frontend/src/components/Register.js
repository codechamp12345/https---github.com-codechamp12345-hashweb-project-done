// Register.jsx

import React, { useState } from "react";
import OTPVerification from './OTPVerification';
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useRegisterMutation } from "../redux/slices/usersApiSlice";

// New gradient background with minimal animation
const Section = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #2b5876, #4e4376)",
  color: "#fff",
  padding: theme.spacing(4),
}));

const FormContainer = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  borderRadius: "20px",
  padding: theme.spacing(6),
  width: "100%",
  maxWidth: 460,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),

  "& .MuiTextField-root": {
    input: { color: "#fff" },
    label: { color: "rgba(255, 255, 255, 0.7)" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#90caf9" },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
  color: "#fff",
  fontWeight: 600,
  padding: theme.spacing(1.5),
  textTransform: "none",
  fontSize: "1.1rem",
  borderRadius: "12px",
  boxShadow: "0px 6px 18px rgba(0, 114, 255, 0.3)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "linear-gradient(135deg, #0072ff, #00c6ff)",
    boxShadow: "0px 8px 24px rgba(0, 114, 255, 0.5)",
    transform: "translateY(-2px)",
  },
}));

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await register(formData).unwrap();
      toast.success("Account created successfully! Please verify your email.");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create an account!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    toast.success("Email verified successfully!");
    navigate("/login");
  };

  return (
    <Section>
      <FormContainer component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" align="center" fontWeight="bold">
          Create an Account
        </Typography>

        <TextField
          label="Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          required
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          required
        />
        <TextField
          label="Password"
          name="password"
          fullWidth
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          required
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          fullWidth
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          variant="outlined"
          required
        />

        <StyledButton type="submit" fullWidth disabled={isLoading || loading}>
          {isLoading || loading ? "Signing Up..." : "Sign Up"}
        </StyledButton>

        <Typography variant="body2" align="center" sx={{ mt: 1, color: "#ccc" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fff", textDecoration: "underline" }}>
            Log in
          </Link>
        </Typography>
      </FormContainer>
    </Section>
  );
};

export default Register;
