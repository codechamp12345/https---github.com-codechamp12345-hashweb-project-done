import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/slices/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      if (response.success) {
        const userData = {
          ...response.user,
          token: response.token,
          points: response.user.points || 0,
        };
        dispatch(setCredentials(userData));
        toast.success(response.message || "Login successful");
        setFormData({ email: "", password: "" });
        navigate("/earn-credits");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to login!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: "20px",
          maxWidth: 400,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            required
            margin="normal"
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: {
                color: "#fff",
                borderColor: "#fff",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fff",
                },
                "&:hover fieldset": {
                  borderColor: "#ccc",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00bfff",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            required
            margin="normal"
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: {
                color: "#fff",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fff",
                },
                "&:hover fieldset": {
                  borderColor: "#ccc",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00bfff",
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              py: 1.5,
              background: "linear-gradient(to right, #00c6ff, #0072ff)",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "12px",
              "&:hover": {
                background: "linear-gradient(to right, #0072ff, #00c6ff)",
              },
            }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography sx={{ color: "#fff" }}>
              Don’t have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#00c6ff", fontWeight: "bold", textDecoration: "none" }}
              >
                Register
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;
