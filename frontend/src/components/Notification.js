import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');

  useEffect(() => {
    const handleShowNotification = (event) => {
      setMessage(event.detail.message);
      setType(event.detail.type);
      setOpen(true);
    };

    window.addEventListener('showNotification', handleShowNotification);

    return () => {
      window.removeEventListener('showNotification', handleShowNotification);
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 