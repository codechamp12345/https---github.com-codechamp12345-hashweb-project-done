import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
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

export default authSlice.reducer;
