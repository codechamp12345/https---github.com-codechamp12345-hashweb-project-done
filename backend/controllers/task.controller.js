import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

// Create a new task
export const createTask = async (req, res) => {
  const { type, action, link } = req.body;

  try {
    // Log the request details
    console.log('Creating task with:', { type, action, link, userId: req.user._id });

    // Validate required fields
    if (!type || !action || !link) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: type, action, link'
      });
    }

    // Create the task
    const task = await Task.create({
      type,
      action,
      link,
      addedBy: req.user._id,
      completions: [],
      isActive: true
    });

    // Log the created task
    console.log('Task created successfully:', task);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Error creating task:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message || 'Validation failed'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error while creating task'
    });
  }
};

// Get all available tasks for a user
export const getAllTasks = async (req, res) => {
  try {
    console.log('Getting tasks for user:', req.user._id);

    // Find all active tasks
    const tasks = await Task.find({ isActive: true })
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });

    console.log('Found tasks:', tasks);

    // Filter out tasks that the user has already completed
    const availableTasks = tasks.filter(task => {
      const hasCompleted = task.completions.some(
        completion => completion.userId.toString() === req.user._id.toString()
      );
      return !hasCompleted;
    });

    console.log('Available tasks:', availableTasks.length);

    res.status(200).json({
      success: true,
      tasks: availableTasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error while fetching tasks'
    });
  }
};

// Complete a task and earn points
export const completeTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id;

  try {
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task is active
    if (!task.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This task is no longer active'
      });
    }

    // Check if user has already completed this task
    const hasCompleted = task.completions.some(
      completion => completion.userId.toString() === userId.toString()
    );

    if (hasCompleted) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this task'
      });
    }

    // Update user points and add completion record
    const pointsEarned = 2; // Fixed 2 points per task
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: pointsEarned } },
      { new: true }
    );

    // Add completion record to task
    task.completions.push({
      userId,
      pointsEarned
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      updatedPoints: user.points
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing task'
    });
  }
};

// Admin: Delete a task
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { isActive: false },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
};

// Admin: Get all tasks (including inactive)
export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
};
