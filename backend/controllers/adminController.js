import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/user.model.js';
import Task from '../models/task.model.js';
import Contact from '../models/contact.model.js';

// @desc    Login admin
// @route   POST /api/v1/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id,
        username: admin.username,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get dashboard data
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
export const getDashboardData = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page
    const skip = (page - 1) * limit;

    // Get counts
    const [totalUsers, totalTasks, totalContacts] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Contact.countDocuments()
    ]);

    // Get paginated users
    const users = await User.find()
      .select('name email createdAt points')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalTasks: totalTasks || 0,
        totalContacts: totalContacts || 0,
        users: users || [],
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

// @desc    Get all tasks
// @route   GET /api/v1/admin/tasks
// @access  Private/Admin
export const getTasks = async (req, res) => {
  try {
    console.log('Accessing getTasks route'); // Debug log
    console.log('Authenticated user:', req.user?._id, req.user?.role); // Debug log
    const tasks = await Task.find()
      .populate('addedBy', 'name email')
      .populate('completions.userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    console.log('Tasks fetched successfully. Count:', tasks.length); // Debug log

    res.status(200).json({
      success: true,
      data: tasks || []
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/admin/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(`Attempting to delete task with ID: ${taskId}`); // Debug log

    const task = await Task.findById(taskId);

    if (!task) {
      console.log(`Task not found with ID: ${taskId}`); // Debug log
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne(); // Or await task.remove() depending on Mongoose version

    console.log(`Task deleted successfully with ID: ${taskId}`); // Debug log
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

// @desc    Initialize admin account
// @route   POST /api/v1/admin/init
// @access  Public
export const initializeAdmin = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123'
      });
      
      await admin.save();
      
      res.status(201).json({
        success: true,
        message: 'Admin account created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Admin account already exists'
      });
    }
  } catch (error) {
    console.error('Initialize admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update user points
// @route   PUT /api/v1/admin/users/:id/points
// @access  Private/Admin
export const updateUserPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const userId = req.params.id;

    if (!points || points < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid points value'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.points = points;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User points updated successfully',
      data: {
        points: user.points
      }
    });
  } catch (error) {
    console.error('Update user points error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user points'
    });
  }
};

// @desc    Get user's completed tasks
// @route   GET /api/v1/admin/users/:id/tasks
// @access  Private/Admin
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get tasks where this user is in the completions array
    const completedTasks = await Task.find({
      'completions.userId': userId
    })
    .select('type action link createdAt')
    .sort({ createdAt: -1 })
    .lean();

    res.status(200).json({
      success: true,
      data: completedTasks
    });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user tasks'
    });
  }
}; 