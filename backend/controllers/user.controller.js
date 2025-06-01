import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const register = async (req, res) => {
  console.log('Registration attempt with data:', { ...req.body, password: '[REDACTED]' });
  
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({
        message: "All fields are required!",
        success: false
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        message: "User Already Exists!",
        success: false
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({
        message: "Invalid email format",
        success: false
      });
    }

    // Validate password length
    if (password.length < 8) {
      console.log('Password too short');
      return res.status(400).json({
        message: "Password must be at least 8 characters long!",
        success: false
      });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({
        message: "Error hashing password",
        success: false
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log('User created successfully:', user._id);

    // Generate token
    generateTokenAndSetCookie(user._id, res);
    console.log('Token generated and cookie set');

    // Remove password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      message: "Account created! You got 50 points as a signup reward 🎉",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Either Email or Password is missing!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Invalid Credentials!",
        success: false,
      });
    }

    const isPassCorrect = await bcrypt.compare(password, user?.password);
    if (!isPassCorrect) {
      return res.status(404).json({
        message: "Invalid Credentials!",
        success: false,
      });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json({
      message: "Welcome Back!",
      success: true,
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.log("Error Occured in login", error);
    res.status(500).json({ message: "Internal Server Error", succcess: false });
  }
};

export const getMe = async (req, res) => {
  try {
    // console.log(req.userId)
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getMe ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged Out Successfylly!",
      success: true,
    });
  } catch (error) {
    console.log("Error in logout ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
