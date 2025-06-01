import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { adminApiSlice } from "./slices/adminApiSlice";
import authSlice from "./slices/authSlice";
import adminSlice from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    auth: authSlice,
    admin: adminSlice,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, adminApiSlice.middleware),
});
