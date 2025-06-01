import React, { useEffect } from 'react';
import { useGetTasksQuery, useDeleteTaskMutation } from '../../redux/slices/adminApiSlice';
import { CircularProgress, Alert, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { Delete as DeleteIcon } from '@mui/icons-material';

const AdminTasks = () => {
  const { data: tasksResponse, isLoading, error, refetch } = useGetTasksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log('Tasks data received:', tasksResponse); // Debug log

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || 'Error loading tasks', {
        toastId: 'tasks-error'
      });
    }
  }, [error]);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await deleteTask(taskId).unwrap();
        toast.success(res.message || 'Task deleted successfully');
        // Tasks list will automatically refetch due to invalidated tag
      } catch (err) {
        toast.error(err.data?.message || 'Failed to delete task');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error">
          {error.data?.message || 'Failed to load tasks. Please try again.'}
        </Alert>
      </div>
    );
  }

  // Access the tasks array from the data property of the response
  const tasks = tasksResponse?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Task Submissions</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.platform || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.addedBy?.name || task.addedBy?.email || 'Unknown User'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{task.description || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.status || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(task._id)}
                        disabled={isDeleting} // Disable button while deleting
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTasks; 