import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllTasksQuery,
  useSubmitTaskMutation,
  useCompleteTaskMutation,
} from "../redux/slices/tasksApiSlice";
import toast from "react-hot-toast";
import { setCredentials } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { CircularProgress, Alert, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const TaskPopup = ({ task, onClose, onConfirm, isCompleting }) => {
  const [hasVisitedLink, setHasVisitedLink] = useState(false);
  
  const handleLinkClick = (e) => {
    e.preventDefault();
    window.open(task?.link, '_blank');
    setHasVisitedLink(true);
  };

  const handleConfirm = async () => {
    await onConfirm();
    // Auto-close after claiming points
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-200"
          type="button"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center pr-8">
          {task?.type} - {task?.action}
        </h3>
        <div className="mb-4">
          <p className="text-gray-700 mb-2 text-center">
            {hasVisitedLink ? 'Great! Now you can claim your points.' : 'Complete the task by clicking the link below:'}
          </p>
          <button
            onClick={handleLinkClick}
            className="block w-full bg-[#0077b6] text-white text-center py-2 px-4 rounded-md hover:bg-[#005b8c] mb-4 transition duration-200"
          >
            {hasVisitedLink ? 'Open Link Again' : 'Open Task Link'}
          </button>
        </div>
        {hasVisitedLink && (
          <button
            onClick={handleConfirm}
            className={`w-full py-2 px-4 rounded-md text-white ${isCompleting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition duration-200`}
            disabled={isCompleting}
            type="button"
          >
            {isCompleting ? 'Claiming Points...' : 'Claim Points'}
          </button>
        )}
      </div>
    </div>
  );
};

// Add animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const EarnCredits = ({ toggleTheme }) => {
  const [taskForm, setTaskForm] = useState({
    type: '',
    action: '',
    link: '',
    description: ''
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPoints, setLocalPoints] = useState(0);
  const [showPointsDeducted, setShowPointsDeducted] = useState(false);
  const [pointsDeducted, setPointsDeducted] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: taskData = { tasks: [], points: 0, ownTasks: [] }, isLoading, error, refetch } = useGetAllTasksQuery(undefined, {
    skip: !userInfo,
    refetchOnMountOrArgChange: true
  });
  const [submitTask] = useSubmitTaskMutation();
  const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();

  const theme = useTheme();

  // Handle authentication and navigation
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    // Cleanup function
    return () => {
      setTaskForm({
        type: '',
        action: '',
        link: '',
        description: ''
      });
      setSelectedTask(null);
    };
  }, [userInfo, navigate]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      if (error.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error(errorMessage);
      }
    }
  }, [error, navigate]);

    // Get available actions based on task type
  const getAvailableActions = (type) => {
    if (!type) return [];

    switch (type) {
      case 'YouTube':
        return ['Like', 'Subscribe'];
      case 'Instagram':
      case 'Facebook':
        return ['Like', 'Follow'];
      default:
        return [];
    }
  };

  // Handle task type change
  const handleTaskTypeChange = (e) => {
    setTaskForm({
      ...taskForm,
      type: e.target.value
    });
  };

  // Handle task action change
  const handleTaskActionChange = (e) => {
    setTaskForm({
      ...taskForm,
      action: e.target.value
    });
  };

  // Handle task link change
  const handleTaskLinkChange = (e) => {
    setTaskForm({
      ...taskForm,
      link: e.target.value
    });
  };

  // Handle task description change
  const handleTaskDescriptionChange = (e) => {
    setTaskForm({
      ...taskForm,
      description: e.target.value
    });
  };

  // Validate URL based on platform
  const validateUrl = (type, url) => {
    if (!type || !url) return false;

    const patterns = {
      YouTube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
      Instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
      Facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/
    };

    return patterns[type]?.test(url) || false;
  };

  // Check if link already exists in tasks
  const isDuplicateLink = (link) => {
    if (!link || !taskData?.tasks) return false;
    
    const normalizedLink = link.toLowerCase().trim()
      .replace(/\/$/, '') // Remove trailing slash
      .replace(/^http:\/\//, 'https://'); // Normalize protocol

    return taskData.tasks.some(task => {
      const taskLink = task.link.toLowerCase().trim()
        .replace(/\/$/, '')
        .replace(/^http:\/\//, 'https://');
      return taskLink === normalizedLink;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.error('Please log in to submit tasks');
      navigate('/login');
      return;
    }

    if (!validateUrl(taskForm.type, taskForm.link)) {
      toast.error('Invalid URL for the selected platform');
      return;
    }

    // Check for duplicate link
    if (isDuplicateLink(taskForm.link)) {
      toast.error('This link has already been added as a task');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitTask(taskForm).unwrap();
      if (result.success) {
        toast.success(result.message || 'Task submitted successfully!');
        setTaskForm({
          type: '',
          action: '',
          link: '',
          description: ''
        });
        refetch();
      } else {
        toast.error(result.message || 'Failed to submit task');
      }
    } catch (err) {
      const errorMsg = err?.data?.message || 'Failed to submit task';
      toast.error(errorMsg);
      
      // If error is due to duplicate link, clear the link field
      if (errorMsg.includes('already exists')) {
        setTaskForm(prev => ({ ...prev, link: '' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task click
  const handleTaskClick = async (task) => {
    if (!userInfo) {
      toast.error("Please login to complete tasks");
      return;
    }

    // Double check that user isn't trying to complete their own task
    if (task.isOwnTask) {
      toast.error("You cannot complete tasks that you created");
      return;
    }

    setSelectedTask(task);
  };

  // Effect to handle points synchronization
  useEffect(() => {
    if (!userInfo) return;

    const syncPoints = () => {
      const currentPoints = Number(userInfo.points);
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const storedPoints = Number(storedUser.points);

      // If points are different, use the higher value
      if (!isNaN(currentPoints) && !isNaN(storedPoints) && currentPoints !== storedPoints) {
        const finalPoints = Math.max(currentPoints, storedPoints);
        const updatedInfo = {
          ...userInfo,
          points: finalPoints
        };

        // Update both Redux and localStorage atomically
        dispatch(setCredentials(updatedInfo));
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));

        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('pointsUpdated', {
          detail: { points: finalPoints }
        }));
      }
    };

    // Initial sync
    syncPoints();

    // Listen for points updates from other components
    const handlePointsUpdate = (e) => syncPoints();
    window.addEventListener('pointsUpdated', handlePointsUpdate);

    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);
  }, [userInfo, dispatch]);

  // Listener for points updates from localStorage (assuming this is for real-time updates)
  useEffect(() => {
    if (userInfo?.points !== undefined) {
      setLocalPoints(Number(userInfo.points));
    }
  }, [userInfo?.points]);

  // Handle task confirmation
  const handleConfirmTask = async () => {
    if (!selectedTask) {
      toast.error("No task selected");
      return;
    }

    try {
      // Multiple validation checks
      if (!userInfo) {
        toast.error("Please login to complete tasks");
        return;
      }

      if (selectedTask.isOwnTask) {
        toast.error("You cannot complete tasks that you created");
        return;
      }

      setIsSubmitting(true);

      // Calculate points for instant update
      const currentBalance = Number(userInfo.points) || 0;
      const pointsToAdd = 2; // Fixed points per task
      const newBalance = currentBalance + pointsToAdd;

      // Update UI immediately
      const updatedUserInfo = {
        ...userInfo,
        points: newBalance
      };
      dispatch(setCredentials(updatedUserInfo));
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      // Update points in UI
      window.dispatchEvent(new CustomEvent('pointsUpdated', {
        detail: { 
          points: newBalance,
          timestamp: Date.now()
        }
      }));

      // Close popup immediately after showing success
      setSelectedTask(null);

      // Make the API call in background
      const result = await completeTask(selectedTask._id).unwrap();
      
      // If server update failed, revert the optimistic update
      if (!result.success) {
        const originalUserInfo = {
          ...userInfo,
          points: currentBalance
        };
        dispatch(setCredentials(originalUserInfo));
        localStorage.setItem('userInfo', JSON.stringify(originalUserInfo));
        
        toast.error('Failed to update points. Please try again.');
        return;
      }

      // Show styled success toast
      toast.custom((t) => (
        <div className="fixed inset-x-0 top-4 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 border-l-4 border-green-500 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-gray-900">
                  Task Completed!
                </p>
                <p className="text-base text-gray-600">
                  You've earned <span className="font-semibold text-[#0077b6]">2 points</span> for completing this task!
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => toast.dismiss(t)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ), {
        duration: 3000,
        position: 'top-center'
      });

      if (result.pointsDeducted > 0) {
        setPointsDeducted(result.pointsDeducted);
        setCurrentPoints(result.currentPoints);
        setShowPointsDeducted(true);
      } else {
        toast.success(result.message);
      }
      
      refetch(); // Refresh tasks list
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || 'Failed to complete task. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle popup close
  const handleClosePopup = () => {
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error && error.status !== 401) {
    return <div className="text-center py-8 text-red-500 dark:text-red-400">Error loading tasks.</div>;
  }

  const availableTasks = taskData?.tasks?.filter(task => !task.isOwnTask) || [];
  const ownTasks = taskData?.ownTasks || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 py-12 px-4 sm:px-6 lg:px-8 font-poppins text-gray-800 dark:text-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto">
        {/* Dark mode toggle */}
        <div className="flex justify-end mb-8">
          <IconButton 
            onClick={toggleTheme} 
            color="inherit" 
            aria-label="toggle dark mode"
            className="text-gray-800 dark:text-gray-200"
          >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>

        {/* Points Balance Section with fade-in */}
        <motion.section 
          className="mb-12 relative"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative bg-white dark:bg-gray-700 rounded-2xl p-6 overflow-hidden shadow-xl">
            {/* Neon Border Effect */}
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 25px #00ffff, 0 0 30px #00ffff' }}></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Your Points Balance</h2>
                <p className="text-gray-600 dark:text-gray-300">Complete tasks to earn more points!</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  {/* Count-up animation */}
                  <CountUp 
                    start={0} 
                    end={localPoints}
                    duration={2.5} 
                    separator=","
                    // Optional: useEasing={true} // Add easing for smoother animation
                  />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Points</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Submit New Task Section with fade-in */}
        <motion.section 
          className="mb-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }} // Add delay for staggered effect
        >
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.01]"> {/* Card styling with hover effect */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Submit New Task</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform</label>
                  <div className="relative">
                    <select
                      value={taskForm.type}
                      onChange={handleTaskTypeChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm transition duration-200 ease-in-out focus:scale-[1.02] focus:ring-2 focus:ring-opacity-50"
                      required
                    >
                      <option value="">Select Platform</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
                   <div className="relative">
                    <select
                      value={taskForm.action}
                      onChange={handleTaskActionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm transition duration-200 ease-in-out focus:scale-[1.02] focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={!taskForm.type}
                    >
                      <option value="">Select Action</option>
                      {getAvailableActions(taskForm.type).map(action => (
                        <option key={action} value={action}>{action}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Link</label>
                <div className="relative">
                  <input
                    type="url"
                    value={taskForm.link}
                    onChange={handleTaskLinkChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm pl-3 pr-10 py-2 transition duration-200 ease-in-out focus:scale-[1.02] focus:ring-2 focus:ring-opacity-50"
                    placeholder={`Enter ${taskForm.type || 'platform'} link`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <TextField
                  multiline
                  rows={4}
                  value={taskForm.description}
                  onChange={handleTaskDescriptionChange}
                  fullWidth
                  required
                  placeholder="Describe your task"
                  className="mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Task'}
              </button>
            </form>
          </div>
        </motion.section>

        {/* Available Tasks Section with fade-in */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }} // Add delay for staggered effect
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Available Tasks</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : availableTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"> {/* Grid layout with consistent row height */}
              {availableTasks.map((task) => (
                <div
                  key={task._id}
                  className={
                    `p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl cursor-pointer ` +
                    (task.action === 'Like' ? 'bg-green-100 dark:bg-green-800' : 
                     task.action === 'Subscribe' ? 'bg-orange-100 dark:bg-orange-800' : 
                     'bg-white dark:bg-gray-700') // Color coding based on action
                  }
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{task.type} - {task.action}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Complete this task to earn points.</p>
                    </div>
                    {/* Points with Fade-in and Slide Animation */}
                    <div className="relative">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400 opacity-0 animate-fade-in-slide-up">
                        +2 points
                      </span>
                    </div>
                  </div>
                  {/* You might want to add a button or link to perform the task here */}
                   <button
                       onClick={(e) => { e.stopPropagation(); handleTaskClick(task); }}
                       className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
                   >
                       View Task
                   </button>
                </div>
              ))}
            </div>
          ) : ( availableTasks.length === 0 && ownTasks.length === 0) ? (
            <div className="text-center py-12 bg-white dark:bg-gray-700 rounded-2xl shadow-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No tasks available</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Be the first to submit a task or check back later!</p>
            </div>
          ) : null /* Render nothing if only own tasks are present, or handle them separately if needed */}
        </motion.section>

        {/* Task Completion Popup */}
        {selectedTask && (
          <TaskPopup
            task={selectedTask}
            onClose={handleClosePopup}
            onConfirm={handleConfirmTask}
            isCompleting={isCompleting}
          />
        )}

        {/* Points Deducted Dialog */}
        <Dialog open={showPointsDeducted} onClose={handleClosePopup}>
          <DialogTitle>Points Deducted</DialogTitle>
          <DialogContent>
            <p className="text-lg">
              You have been deducted {pointsDeducted} points for completing your own task.
            </p>
            <p className="mt-2">
              Your current points balance: {currentPoints}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopup} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default EarnCredits;