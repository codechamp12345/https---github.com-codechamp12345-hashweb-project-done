import mongoose from 'mongoose';
import Task from '../models/task.model.js';

const tasks = [
  {
    type: 'YouTube',
    action: 'Like',
    link: 'https://youtu.be/P6iRc0P9sKo?si=cjbdRVu_QrDfvw_i',
    isActive: true
  },
  {
    type: 'Instagram',
    action: 'Follow',
    link: 'https://www.instagram.com/pxrth.xi?igsh=cDZoMmwxMHdkcHFn',
    isActive: true
  }
];

mongoose.connect('mongodb://localhost:27017/hashweb')
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await Task.insertMany(tasks);
      console.log('Tasks added successfully');
    } catch (error) {
      console.error('Error adding tasks:', error);
    }
    mongoose.disconnect();
  })
  .catch(err => console.error('MongoDB connection error:', err));
