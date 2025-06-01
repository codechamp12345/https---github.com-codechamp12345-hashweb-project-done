import axios from 'axios';

const initAdmin = async () => {
  try {
    const response = await axios.post('https://hashweb-backend.onrender.com/api/v1/admin/init');
    console.log('Admin initialization response:', response.data);
  } catch (error) {
    console.error('Error initializing admin:', error.response?.data || error.message);
  }
};

initAdmin(); 