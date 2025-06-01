import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      if (!action.payload) return;
      
      console.log('Setting credentials:', action.payload);
      if (action.payload.user?.role === 'admin') {
        state.adminInfo = {
          ...action.payload.user,
          token: action.payload.token
        };
        localStorage.setItem("adminInfo", JSON.stringify(state.adminInfo));
      } else if (action.payload.userInfo) {
        // If we have userInfo in the payload, ensure points is a number
        const points = Number(action.payload.userInfo?.points ?? action.payload?.points ?? 0);
        state.userInfo = {
          ...state.userInfo,
          ...action.payload.userInfo,
          points: points
        };
        console.log('Updated user info with points:', state.userInfo);
      } else {
        // Otherwise update with the payload directly
        const points = Number(action.payload?.points ?? state.userInfo?.points ?? 0);
        state.userInfo = {
          ...state.userInfo,
          ...action.payload,
          points: points
        };
        console.log('Updated user info directly with points:', state.userInfo);
      }
      
      // Always update localStorage if we have userInfo
      if (state.userInfo) {
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      }
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      state.adminInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("adminInfo");
    },
    updatePoints: (state, action) => {
      if (state.userInfo) {
        state.userInfo.points = action.payload.points;
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      }
    },
    logout: (state, action) => {
      console.log('Logging out:', action.payload);
      if (action.payload === 'admin') {
        state.adminInfo = null;
        localStorage.removeItem("adminInfo");
      } else {
        state.userInfo = null;
        localStorage.removeItem("userInfo");
      }
      // Clear both states if no specific type is provided
      if (!action.payload) {
        state.userInfo = null;
        state.adminInfo = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("adminInfo");
      }
    },
  },
});

export const { setCredentials, updatePoints, logout, clearCredentials } = authSlice.actions;

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Attempting login with:', { email });
      
      // Make sure we're sending the correct data format
      const response = await api.post("/users/login", {
        email: email.trim(),
        password: password
      });
      
      console.log('Login response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      // Store the user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      
      // Dispatch setCredentials action
      dispatch(setCredentials(response.data));
      
      // Show welcome back message
      const event = new CustomEvent('showNotification', {
        detail: {
          message: `Welcome back, ${response.data.user.name}!`,
          type: 'success'
        }
      });
      window.dispatchEvent(event);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data,
        error: error.message
      });
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed. Please try again."
      );
    }
  }
);

export default authSlice.reducer;
