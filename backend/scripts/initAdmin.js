import axios from 'axios';

const initAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/v1/admin/init');
    console.log('Admin initialization response:', response.data);
  } catch (error) {
    console.error('Error initializing admin:', error.response?.data || error.message);
  }
};

initAdmin(); 