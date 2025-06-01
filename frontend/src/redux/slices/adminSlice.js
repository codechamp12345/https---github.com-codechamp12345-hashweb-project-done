import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminInfo: localStorage.getItem('adminInfo') 
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.adminInfo = action.payload;
      localStorage.setItem('adminInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.adminInfo = null;
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('adminToken');
    },
  },
});

export const { setCredentials, logout } = adminSlice.actions;

export default adminSlice.reducer; 