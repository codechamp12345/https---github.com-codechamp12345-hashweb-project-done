import Task from '../models/Task.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user and tasks
    const [user, tasks] = await Promise.all([
      User.findById(userId).select('points').lean(),
      Task.find().select('_id type action link addedBy completions').lean()
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Transform and separate own tasks and available tasks
    const { ownTasks, availableTasks } = tasks.reduce((acc, task) => {
      const isOwnTask = task.addedBy.toString() === userId.toString();
      const transformedTask = {
        _id: task._id,
        type: task.type,
        action: task.action,
        link: task.link
      };

      if (isOwnTask) {
        acc.ownTasks.push(transformedTask);
      } else {
        acc.availableTasks.push(transformedTask);
      }

      return acc;
    }, { ownTasks: [], availableTasks: [] });

    res.json({
      tasks: availableTasks,
      ownTasks: ownTasks,
      points: user.points
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Submit a new task
export const submitTask = async (req, res) => {
  try {
    const { type, action, link } = req.body;
    const userId = req.user._id;

    // Normalize link before checking
    const normalizedLink = link.toLowerCase().trim()
      .replace(/\/$/, '') // Remove trailing slash
      .replace(/^http:\/\//, 'https://'); // Normalize protocol

    // Check if task with same normalized link already exists
    const existingTask = await Task.findOne({
      link: { $regex: new RegExp('^' + normalizedLink.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '/?$', 'i') }
    });
    
    if (existingTask) {
      return res.status(400).json({
        success: false,
        message: 'A task with this link already exists'
      });
    }

    // Validate link format based on type
    const isValidLink = validateTaskLink(type, normalizedLink);
    if (!isValidLink) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${type} link format`
      });
    }

    const task = await Task.create({
      type,
      action,
      link: normalizedLink,
      addedBy: userId,
      completedBy: [],
      completions: []
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting task'
    });
  }
};

// Validate task link based on platform
const validateTaskLink = (type, link) => {
  if (!type || !link) return false;

  const patterns = {
    YouTube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
    Instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
    Facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/
  };

  return patterns[type]?.test(link) || false;
};

// Complete a task and award points
export const completeTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user._id;

    // Get task and user with points in a single query
    const [task, user] = await Promise.all([
      Task.findById(taskId),
      User.findById(userId).select('points name email isVerified')
    ]);

    if (!task || !user) {
      return res.status(404).json({
        success: false,
        message: !task ? 'Task not found' : 'User not found'
      });
    }

    // Check if task exists and is active
    if (!task || !task.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or is no longer active'
      });
    }

    await task.populate('addedBy', '_id');

    // Get current user with points
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is trying to complete their own task
    if (task.addedBy._id.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot complete your own tasks. Please try completing tasks added by other users.'
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });

      // Add completion record
    // Check if user is trying to complete their own task
    if (task.addedBy._id.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot complete your own task'
      });
    }

    // Check if user has already completed this task
    const hasCompleted = task.completions?.some(
      completion => completion.userId.toString() === userId.toString()
    );

    if (hasCompleted) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this task'
      });
    }

    try {
      // Start a session for the transaction
      const session = await mongoose.startSession();
      
      try {
        // Start transaction
        await session.startTransaction();

        // Update task first
        task.completions = task.completions || [];
        task.completions.push({
          userId: userId,
          completedAt: new Date(),
          pointsEarned: 2
        });
        await task.save({ session });

        // Update user points atomically and get updated user in one operation
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { 
            $inc: { points: 2 },
            $set: { lastPointsUpdate: new Date() }
          },
          { new: true, session }
        ).select('points name email isVerified');

        if (!updatedUser) {
          throw new Error('Failed to update user points');
        }

        // Commit the transaction
        await session.commitTransaction();

        // Calculate points earned and new balance
        const pointsEarned = 2;
        const newBalance = updatedUser.points;
        message: 'Task completed successfully. 2 points have been deducted for completing your own task.',
        // Return success with updated user info and points details
        res.status(200).json({
          success: true,
          message: `Task completed successfully! You earned ${pointsEarned} points.`,
          userInfo: {
            _id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            isVerified: updatedUser.isVerified,
            points: newBalance
          },
          pointsEarned,
          newBalance
        });

        return;
      } catch (error) {
        // If anything fails, abort the transaction
        await session.abortTransaction();
        throw error;
      } finally {
        // End session
        await session.endSession();
      }
    } catch (error) {
      console.error('Transaction error:', error);
      throw new Error('Failed to complete task: ' + error.message);
    }
    // For completing other users' tasks, add points
    user.points += 2;
    res.status(500).json({
      success: false,
      message: 'Error completing task'
    });

    // Add completion record
    task.completions.push({
      userId,
      completedAt: new Date()
    });
    await task.save();

    res.json({
      message: 'Task completed successfully. You earned 2 points!',
      pointsDeducted: 0,
      currentPoints: user.points
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: 'Error completing task' });
  }
};

// Initialize default tasks
export const initializeTasks = async () => {
  try {
    const existingTasks = await Task.find();
    if (existingTasks.length === 0) {
      const defaultTasks = [
        {
          title: 'Watch Short Video',
          description: 'Watch this short video to earn 2 points!',
          videoUrl: 'https://youtube.com/shorts/iB-YtR9-vjw?si=DK0eoOoDUQc9Ga9w',
          points: 2
        },
        {
          title: 'Watch Full Video',
          description: 'Watch this full video to earn 2 points!',
          videoUrl: 'https://youtu.be/RNYZ2dt1A5Y?si=KjUtEqWRGpXYL48b',
          points: 2
        }
      ];

      await Task.insertMany(defaultTasks);
      console.log('Default tasks initialized');
    }
  } catch (error) {
    console.error('Error initializing tasks:', error);
  }
};
