import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FreeCredits = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    }
  };

  const handleWatchVideo = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
    // Open video in new tab
    window.open(task.videoUrl, '_blank');
  };

  const handleConfirmWatched = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/v1/tasks/${selectedTask._id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(`Congratulations! You earned ${response.data.points} points!`);
      fetchTasks(); // Refresh tasks
      setOpenDialog(false);
      
      // Update points in localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        userData.points = (userData.points || 0) + response.data.points;
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to complete task');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Free Credits
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  +{task.points} Points
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color={task.isCompleted ? "success" : "primary"}
                  startIcon={task.isCompleted ? <CheckCircleIcon /> : <PlayCircleOutlineIcon />}
                  onClick={() => handleWatchVideo(task)}
                  disabled={task.isCompleted}
                >
                  {task.isCompleted ? 'Completed' : 'Watch Video'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Video Watched</DialogTitle>
        <DialogContent>
          <Typography>
            Did you watch the entire video? Click confirm to receive your points!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmWatched} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FreeCredits;
