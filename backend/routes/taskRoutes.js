import express from 'express';
import {
  createTask,
  getAllTasks,
  completeTask,
  deleteTask,
  getAllTasksAdmin
} from '../controllers/task.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// User routes
router.post('/create', verifyToken, createTask);
router.get('/list', verifyToken, getAllTasks);
router.post('/:taskId/complete', verifyToken, completeTask);

// Admin routes
router.get('/admin/tasks', verifyToken, getAllTasksAdmin);
router.delete('/admin/:taskId', verifyToken, deleteTask);

export default router;
