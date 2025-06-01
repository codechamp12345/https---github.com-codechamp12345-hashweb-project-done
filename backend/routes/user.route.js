import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Auth routes
router.post("/users/login", login);
router.post("/users/register", register);
router.get('/users/me', verifyToken, getMe);
router.get("/users/logout", logout);

export default router;
