import React, { useState } from 'react';
import { useGetDashboardDataQuery, useUpdateUserPointsMutation, useGetUserTasksQuery } from '../../redux/slices/adminApiSlice';
import { CircularProgress, Alert, Pagination, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';
import { PersonOutline, TaskOutlined, MailOutline } from '@mui/icons-material';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium truncate">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
    <div className="text-indigo-600">{icon}</div>
  </div>
);

const UserTasksModal = ({ open, onClose, userId, userName }) => {
  const { data, isLoading, error } = useGetUserTasksQuery(userId, {
    skip: !open
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Completed Tasks - {userName}
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">
            {error.data?.message || 'Failed to load tasks'}
          </Alert>
        ) : (
          <div className="mt-4">
            {data?.data?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((task, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                            View Link
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No completed tasks found</p>
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const [editingPoints, setEditingPoints] = useState(null);
  const [newPoints, setNewPoints] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  const { data, isLoading, error } = useGetDashboardDataQuery({ page, limit: usersPerPage });
  const [updatePoints] = useUpdateUserPointsMutation();

  const handlePointsEdit = (user) => {
    setEditingPoints(user._id);
    setNewPoints(user.points.toString());
  };

  const handlePointsSave = async (userId) => {
    try {
      const points = parseInt(newPoints);
      if (isNaN(points) || points < 0) {
        toast.error('Please enter a valid points value');
        return;
      }

      await updatePoints({ userId, points }).unwrap();
      toast.success('Points updated successfully');
      setEditingPoints(null);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update points');
    }
  };

  const handlePointsCancel = () => {
    setEditingPoints(null);
    setNewPoints('');
  };

  const handleViewTasks = (user) => {
    setSelectedUser(user);
  };

  const handleCloseTasks = () => {
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    toast.error(error.data?.message || 'Error loading dashboard data', {
      toastId: 'dashboard-error'
    });
    return (
      <div className="p-4">
        <Alert severity="error">
          {error.data?.message || 'Failed to load dashboard data. Please try again.'}
        </Alert>
      </div>
    );
  }

  const { totalUsers, totalTasks, totalContacts, users, totalPages } = data?.data || {};

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <StatCard title="Total Users" value={totalUsers} icon={<PersonOutline fontSize="large" />} />
        <StatCard title="Total Tasks" value={totalTasks} icon={<TaskOutlined fontSize="large" />} />
        <StatCard title="Total Contacts" value={totalContacts} icon={<MailOutline fontSize="large" />} />
      </div>

      {/* Recent Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign Up Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingPoints === user._id ? (
                        <div className="flex items-center space-x-2">
                          <TextField
                            size="small"
                            type="number"
                            value={newPoints}
                            onChange={(e) => setNewPoints(e.target.value)}
                            className="w-24"
                          />
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handlePointsSave(user._id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={handlePointsCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{user.points || 0}</span>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handlePointsEdit(user)}
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewTasks(user)}
                      >
                        See Tasks
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex justify-center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )}
      </div>

      {/* Tasks Modal */}
      {selectedUser && (
        <UserTasksModal
          open={!!selectedUser}
          onClose={handleCloseTasks}
          userId={selectedUser._id}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 