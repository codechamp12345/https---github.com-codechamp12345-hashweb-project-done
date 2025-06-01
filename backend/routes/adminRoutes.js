import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  adminLogin,
  getDashboardData,
  getTasks,
  initializeAdmin,
  deleteTask,
  updateUserPoints,
  getUserTasks
} from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);
router.post('/init', initializeAdmin);

// Protected routes - Apply middleware to all routes below
router.use(protect);
router.use(authorize('admin'));

// Admin routes
router.get('/dashboard', getDashboardData);
router.get('/tasks', getTasks);
router.delete('/tasks/:id', deleteTask);
router.put('/users/:id/points', updateUserPoints);
router.get('/users/:id/tasks', getUserTasks);

export default router; 