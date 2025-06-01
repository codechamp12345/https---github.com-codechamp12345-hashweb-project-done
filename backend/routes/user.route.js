import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/me', verifyToken, getMe);
router.get("/logout", logout);

export default router;
