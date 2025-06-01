import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.route.js";
import otpRoutes from './routes/otpRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",               // local dev frontend
  "https://hashweb-project-u53z.vercel.app"  // your deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,                       // allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Optional: handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1/auth", otpRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1", contactRoutes);
app.use("/api/v1/admin", adminRoutes);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
